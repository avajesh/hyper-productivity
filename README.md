<div align="center">
  <img alt="Hyper Productivity Logo" src="docs/screens/banner.png" width="800" />
</div>

<div style="height:20px;"></div>

<p align="center">
  <strong>
    The ultimate local-first, distraction-free task manager and time tracker for personal deep work—supercharged with infinite nested subtasks, recursive time tracking, and zero cloud lock-in.
  </strong>
</p>

<p align="center">
  🌐 <a href="https://hyper-productivity.techeia.com"><strong>Open Live Web App</strong></a> &nbsp;|&nbsp; 
  📱 <a href="https://github.com/avajesh/hyper-productivity/releases/tag/v19.3.1-hyper"><strong>Download Android APK</strong></a> &nbsp;|&nbsp; 
  💻 <a href="https://github.com/avajesh/hyper-productivity/releases"><strong>Download Windows / Desktop Apps</strong></a>
</p>

<p align="center">
  <a href="https://lbesson.mit-license.org"><img alt="MIT license" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square"/></a>
  &nbsp;
  <a href="https://github.com/avajesh/hyper-productivity/releases"><img alt="GitHub release" src="https://img.shields.io/github/v/release/avajesh/hyper-productivity?color=teal&style=flat-square"/></a>
  &nbsp;
  <a href="https://github.com/avajesh/hyper-productivity/discussions"><img alt="GitHub Discussions" src="https://img.shields.io/badge/Community-Discussions-blue?style=flat-square&logo=github"/></a>
</p>

---

## 🚀 Welcome to Hyper Productivity!

**Hyper Productivity** is an evolution of the widely popular open-source project [Super Productivity](https://github.com/super-productivity/super-productivity). While Super Productivity pioneered local-first task tracking with integrations for developers, strict upstream architectural constraints held back some of the community’s most requested features for years.

**Hyper Productivity removes those barriers.** It delivers unlimited organizational hierarchy, independent parent time tracking, recursive time aggregation, and focused UX refinements—while preserving lightning-fast performance, offline-first reliability, and 100% data privacy.

---

## ⚡ What Makes Hyper Productivity Better?

| Feature | Original Super Productivity | Hyper Productivity |
|:---|:---:|:---:|
| **Subtask Nesting Depth** | ❌ **Strictly 1 flat level** (`!parentId`) | ✅ **Infinite Hierarchies** (`Task › Subtask › Sub-subtask › ...`) |
| **Parent Task Time Tracking** | ❌ **Blocked** (Play button hidden; clicks force-redirected to 1st child) | ✅ **Independent Tracking** (Track management, research, or review directly on parents) |
| **Time & Estimate Rollups** | ⚠️ Flat sum of direct subtasks only | ✅ **Recursive Aggregation** (Times and estimates bubble up the entire ancestor chain) |
| **Tree Breadcrumb Trail** | ❌ None | ✅ **Interactive Breadcrumbs** in Detail Panel (`Parent › Child › Grandchild`) |
| **Focus Subtree View** | ❌ None | ✅ **"Zoom Into Task"** mode to isolate any sub-project |
| **Level Reparenting** | ❌ Manual drag only | ✅ **"Move Up One Level"** outdent shortcut & cycle prevention |
| **Visual Focus Themes** | Standard Material palettes | ✅ Curated palettes like **Everforest** (emerald/teal) & **Zen** for eye comfort |
| **Privacy & Offline** | 100% Local-first | ✅ **100% Local-first, zero telemetry, offline-by-default** |

---

## 🌟 Key Features

### 1. 🌲 Infinite Task Hierarchies (Nested Subtasks)
Real-world engineering, research, and creative projects don't fit into a flat 2-level list. In Hyper Productivity, you can break down massive epics into subtasks, sub-sub-tasks, and sub-sub-sub-tasks to whatever depth matches your thinking.
* **Protected Against Cycles:** Built-in cycle detection guarantees you can never accidentally create circular parent-child loops when moving tasks.
* **Clean Tree Rendering:** Subtask lists render cleanly at all levels with collapsible toggles and progress indicators.

### 2. ⏱️ Independent Parent Time Tracking & Recursive Rollups
In upstream Super Productivity, adding a single subtask locked you out of tracking time directly on the parent task. You had to invent dummy tasks like *"General"* or *"Coordination"* just to log time spent managing or reviewing.
* **Direct Parent Tracking:** Click the **Play** button on any parent task at any time to track high-level planning, meetings, or code reviews. The parent tracks its own focused time (`ownTimeSpentOnDay`).
* **Recursive Rollups:** All time logged and time estimates on deeply nested children automatically aggregate up through all parent levels, giving you an accurate, real-time total of the entire branch.

### 3. 🧭 Seamless Tree Navigation
* **Ancestor Breadcrumbs:** Open the Task Detail Panel on any nested task to see its full hierarchy path (`Epic › Module › Task › Subtask`). Click any ancestor in the breadcrumb trail to jump immediately to that task.
* **Zoom Into Task:** Right-click any task and select **"Zoom into task"** to isolate that specific subtree and eliminate list clutter. A clean breadcrumb banner lets you return to the full list with one click.
* **Move Up One Level (Outdent):** Right-click any nested task and select **"Move up one level"** to quickly promote it up one rung of the hierarchy.

### 4. ⌨️ 4 Effortless Ways to Create Nested Subtasks
Creating deep subtasks is fast, intuitive, and keyboard-friendly:
1. **Detail Panel (Visual):** Select any task or subtask and press `Space` (or click it) &rarr; scroll to **Subtasks** in the side panel &rarr; click **`+ Add sub-task`**.
2. **Right-Click Context Menu:** Right-click any subtask &rarr; select **`Add sub-task`**. An inline input immediately appears nested directly below it.
3. **Keyboard Shortcut:** Highlight any subtask in the list and press **`A`** or **`Ctrl + Enter`** (`Cmd + Enter` on macOS).
4. **Drag & Drop:** Simply drag any task and drop it into another subtask's expanded children list.

### 5. 🔌 Powerful Integrations for Developers & Creators
Auto-import tasks and keep your workflow synchronized without opening a dozen browser tabs:
* **Jira:** Two-way sync, transitions, and automatic worklog submission.
* **GitHub & GitLab:** Search and import issues assigned to you or across repositories.
* **OpenProject & CalDAV / iCal:** Connect your project management milestones and calendar schedules.

### 6. 🛡️ 100% Local-First, Private & Free Forever
* **Your Data Stays on Your Device:** All tasks, time entries, and project notes are stored in local IndexedDB storage.
* **No Telemetry, No Accounts, No Paywalls:** No mandatory sign-ups, tracking scripts, or premium tiers.
* **Optional Encrypted Sync:** When you want your data across multiple devices, sync peer-to-peer using WebDAV, Google Drive, Dropbox, or your private SuperSync server.

---

## 📥 Downloads & Installation

Hyper Productivity is available across all major operating systems:

### 🌐 Web Application (Instant Access)
Run Hyper Productivity directly in any modern browser without installing anything:
👉 **[Open Live Web App (hyper-productivity.techeia.com)](https://hyper-productivity.techeia.com)**
*(Supports full PWA installation for desktop and mobile home screens!)*

### 🤖 Android
* **APK Direct Download:** [hyper-productivity-v19.3.1.apk](https://github.com/avajesh/hyper-productivity/releases/download/v19.3.1-hyper/hyper-productivity-v19.3.1.apk)
* Fully offline-capable mobile client with background sync.

### 🪟 Windows
* **Installer (NSIS Setup):** [HyperProductivity-Setup-v19.3.1.exe](https://github.com/avajesh/hyper-productivity/releases/download/v19.3.1-hyper/HyperProductivity-Setup-v19.3.1.exe) — *Recommended for Windows 10/11 with Start Menu shortcuts and update support.*
* **Portable Executable:** [hyper-productivity-v19.3.1-windows.exe](https://github.com/avajesh/hyper-productivity/releases/download/v19.3.1-hyper/hyper-productivity-v19.3.1-windows.exe) — *No installation needed. Run directly from USB or any directory.*

### 🍎 macOS & 🐧 Linux
* You can run via the Web App / PWA or build native binaries directly from source:
  ```bash
  # Linux AppImage / Deb
  npm run dist:linux
  
  # macOS DMG
  npm run dist:mac
  ```

---

## 🛠️ Local Development & Building from Source

Hyper Productivity is built on Angular, Electron, and Capacitor.

### Prerequisites
* Node.js `22.x` or `24.x`
* npm `10.x` or higher
* Java 21 JDK (required only for building Android APKs)

### Setup & Run
```bash
# 1. Clone the repository
git clone https://github.com/avajesh/hyper-productivity.git
cd hyper-productivity

# 2. Install dependencies
npm install

# 3. Start Frontend Development Server (Web)
npm run startFrontend

# 4. Start Electron Desktop Development
npm start
```

### Production Builds
```bash
# Build production web assets (dist/browser)
npm run build:web

# Build desktop packages
npm run dist
```

---

## 🤝 Community & Contributing

Hyper Productivity is an open-source community project. We welcome bug reports, feature suggestions, and code contributions!
* 💬 Discuss ideas and ask questions in [GitHub Discussions](https://github.com/avajesh/hyper-productivity/discussions).
* 🐛 Report issues or request improvements in [GitHub Issues](https://github.com/avajesh/hyper-productivity/issues).

---

## ⚖️ License

Hyper Productivity is licensed under the [MIT License](LICENSE).
Proudly maintained and supported by [Techeia](https://techeia.com).
