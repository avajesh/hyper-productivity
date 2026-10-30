# Hyper Productivity: Architectural & Feature Guide

This document describes the architectural enhancements introduced in **Hyper Productivity** over upstream Super Productivity, focusing on multi-level nested subtasks, recursive time aggregation, independent parent tracking, and tree navigation.

---

## 1. Infinite Task Hierarchies (Arbitrary Nesting)

### Architectural Background
In upstream Super Productivity, subtasks were constrained to a single flat level (`!parentTask.parentId`). Attempting to add a subtask to an existing subtask was disallowed in reducers, UI detail panels, context menus, and keyboard shortcuts.

Hyper Productivity re-architects task relationships to support **arbitrary depth** (`Task › Subtask › Sub-subtask › Sub-sub-subtask...`):

- **Data Model:** Each task maintains a `parentId?: string` (identifying its immediate parent) and `subTaskIds: string[]` (identifying its immediate children).
- **Cycle Prevention:** In `task.reducer.ts`, `wouldCreateCircularReference(state, taskId, targetTaskId)` inspects the entire ancestor chain before allowing a reparent or subtask move. If moving task $A$ under task $B$ would make $A$ an ancestor of itself, the action is rejected safely.
- **Recursive Selectors:** `buildSubTasksRecursively` and `mapSubTasksToTask` in `task.selectors.ts` construct deeply nested `TaskWithSubTasks` trees with per-subscription memoized caching to ensure UI performance remains constant even in lists with hundreds of nested nodes.

---

## 2. Independent Parent Time Tracking & Recursive Rollups

### The Problem in Upstream
Upstream Super Productivity enforced a rigid constraint: the moment a parent task had at least one subtask, tracking time directly on the parent was blocked. The play button was hidden, and dispatches to `setCurrentTask` forcibly selected the first child subtask. This made it impossible to track high-level planning, meetings, or architectural review on parent tasks without inventing artificial "coordination" subtasks.

### Hyper Productivity's Dual-Layer Time Architecture
Hyper Productivity separates **direct time spent** from **aggregate time spent**:

1. **`ownTimeSpentOnDay`:** Captures milliseconds tracked directly on the parent task when it is active.
2. **`timeSpentOnDay`:** Combines `ownTimeSpentOnDay` plus all time logged across its child subtasks for that calendar day.
3. **Recursive Time Recalculation:**
   - `reCalcTimeSpentForParentIfParent`:
     ```ts
     const timeSpentOnDayParent = parentTask.ownTimeSpentOnDay
       ? { ...parentTask.ownTimeSpentOnDay }
       : {};
     // Iterates all direct subtasks and accumulates time spent
     ...
     if (parentTask.parentId) {
       // Recursively bubbles up to grandparent, great-grandparent, etc.
       stateAfterUpdate = reCalcTimeSpentForParentIfParent(parentTask.parentId, stateAfterUpdate);
     }
     ```
   - `reCalcTimeEstimateForParentIfParent`:
     Recursively sums remaining time estimates (`sumSubTaskTimeLeft`) up the ancestor chain.
4. **Independent `setCurrentTask`:**
   In `task.reducer.ts`, `setCurrentTask` directly targets the requested task ID without forcing redirection to subtask index 0:
   ```ts
   const taskToStartId = id; // Parent can be current!
   ```

---

## 3. Tree Navigation & UX Enhancements

Hyper Productivity introduces dedicated UI tools to make deep hierarchies manageable:

### Ancestor Breadcrumbs in Detail Panel
Opening the Task Detail Panel on any nested task triggers `selectSelectedTaskAncestors`. The top of the detail panel renders the complete breadcrumb trail:
```
Project Name › Epic Task › Feature Task › Current Subtask
```
Each ancestor item is clickable to immediately navigate up the hierarchy.

### Subtree Zoom ("Zoom into task")
Right-clicking any task in the list offers **"Zoom into task"**:
- Isolates the chosen task and its children as the root of the task view.
- Eliminates visual clutter when focusing on a specific sub-project.
- Displays a prominent header bar with an **"All tasks"** button to zoom back out.

### Level Promotion ("Move up one level")
Nested subtasks feature a **"Move up one level"** context menu item, allowing one-click outdenting to its parent's level without requiring manual drag-and-drop.

---

## 4. UI Creation Workflows

Hyper Productivity provides four convenient ways to create nested subtasks:

1. **Task Detail Panel:** Focus the task (`Space`) &rarr; open **Subtasks** &rarr; click **`+ Add sub-task`**.
2. **Context Menu:** Right-click any subtask &rarr; select **`Add sub-task`**.
3. **Keyboard Shortcut:** With any subtask highlighted, press **`A`** or **`Ctrl + Enter`** (`Cmd + Enter` on macOS).
4. **Drag and Drop:** Drag a task into any open subtask's drop area.


---

## 5. Effortless Reparenting ("Move as subtask to...")

Dragging tasks across long lists or on touchscreen devices often results in accidental drops or misaligned nesting. Hyper Productivity introduces **"Move as subtask to..."**:
- **Accessible Anywhere:** Available directly in the context menu for any task.
- **Searchable Selector:** An autocomplete dialog allows quick searching across all active tasks.
- **Cycle Prevention:** Uses strict ancestor walking (`canApplyConvertToSubTask`) to mathematically eliminate cyclical nesting.
- **Hierarchy Breadcrumbs:** Displays full parent paths (`Parent › Subtask`) for candidate parents in the selector, so you know exactly where the task will land.

---

## 6. Reusable Task Hierarchy Templates

Complex tasks frequently follow predictable blueprints (e.g., *Product Release Checklist*, *Bug Investigation*, *Client Onboarding*, *Sprint Retrospective*).
- **Save as Template:** Right-click any task (and its arbitrary depth of subtasks) &rarr; select **`Save as template`**.
- **Template Library:** Access the **Task Templates** drawer directly from the main sidebar or task context menus.
- **Deep Instantiation:** With one click, instantiate a complete task tree with notes, time estimates, and nested subtasks into your current project or as child tasks under an existing parent.

---

## 7. Planner 5-Day Work Week (Hide Weekends)

For professionals who operate on a Monday–Friday schedule, weekend columns consume valuable screen width:
- **Instant View Toggle:** A dedicated toggle button in the Planner header allows switching between **5-Day View** (Monday–Friday) and **7-Day View** (full week).
- **Persistent Preference:** Remembers your view mode locally without cloud or sync interference.

---

## 8. Direct-Access Trash Bin (Recently Deleted)

Accidental deletion of a high-level task with nested subtasks shouldn't cause permanent data loss:
- **1-Click Sidebar Access:** The **Recently Deleted** drawer is directly available from the navigation sidebar.
- **30-Day Retention:** Retains deleted tasks and complete subtrees for 30 days.
- **Full Hierarchy Restoration:** Restoring a parent task automatically restores its complete nested subtask tree and time tracking history.
