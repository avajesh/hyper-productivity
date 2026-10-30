import { Task } from '../task.model';

type ConvertibleTaskFields = Pick<
  Task,
  | 'parentId'
  | 'subTaskIds'
  | 'repeatCfgId'
  | 'issueId'
  | 'issueProviderId'
  | 'issueType'
  | 'dueWithTime'
  | 'reminderId'
  | 'remindAt'
>;

/**
 * Whether the task's own fields allow it to be nested as a subtask.
 * Does NOT check hierarchy — use canApplyConvertToSubTask for that.
 * Allows tasks that are already subtasks (parentId set) so they can be
 * drag-dropped to re-parent at any depth.
 */
export const canConvertTaskToSubTask = (task: ConvertibleTaskFields): boolean =>
  !task.repeatCfgId &&
  !task.issueId &&
  !task.issueProviderId &&
  !task.issueType;

/**
 * Whether a top-level task may be dropped into a subtask list. Looser than
 * `canConvertTaskToSubTask`: a time schedule or reminder does not block the
 * drop, because the drop dispatches `unscheduleTask` before `convertToSubTask`
 * (#11027). The reducer guard stays strict on purpose — released clients
 * (v18.9.0+) run the same guard on replay and would silently drop a
 * `convertToSubTask` for a still-scheduled task, diverging the task tree.
 */
export const canDropTaskIntoSubTaskList = (task: ConvertibleTaskFields): boolean =>
  canConvertTaskToSubTask({ ...task, dueWithTime: undefined, remindAt: undefined });

/**
 * Whether a `convertToSubTask` op may be applied to the given (already
 * looked-up) task and target parent. Used by BOTH the section and crud
 * meta-reducers so their guards stay in lock-step.
 * Rejects a missing target, self-nesting, and cyclical nesting.
 */
export const canApplyConvertToSubTask = (
  task: (ConvertibleTaskFields & Pick<Task, 'id'>) | undefined,
  targetParent: Pick<Task, 'id' | 'parentId'> | undefined,
  getState?: () => { entities: Record<string, Pick<Task, 'id' | 'parentId'> | undefined> },
): boolean => {
  if (!task || !targetParent || task.id === targetParent.id) {
    return false;
  }
  if (!canConvertTaskToSubTask(task)) {
    return false;
  }
  // Cycle detection: walk the target parent's ancestor chain.
  // If task.id appears anywhere in that chain, allowing the operation
  // would create a cycle (A → B → ... → A) that would stack-overflow
  // mapSubTasksToTask. We need getState to resolve ancestor IDs.
  if (getState) {
    const entities = getState().entities;
    let current: Pick<Task, 'id' | 'parentId'> | undefined = targetParent;
    const visited = new Set<string>();
    while (current?.parentId) {
      if (visited.has(current.parentId)) break; // safety — broken chain
      if (current.parentId === task.id) return false; // cycle detected
      visited.add(current.parentId);
      current = entities[current.parentId];
    }
  }
  return true;
};

