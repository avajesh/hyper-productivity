import { inject, Injectable, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { nanoid } from 'nanoid';
import { TaskService } from '../task.service';
import { TaskWithSubTasks } from '../task.model';
import { addSubTask } from '../store/task.actions';
import { TaskTemplate, TaskTemplateNode } from './task-template.model';
import { LS } from '../../../core/persistence/storage-keys.const';

@Injectable({
  providedIn: 'root',
})
export class TaskTemplateService {
  private readonly _taskService = inject(TaskService);
  private readonly _store = inject(Store);

  private readonly _templates = signal<TaskTemplate[]>(this._loadTemplates());
  readonly templates = this._templates.asReadonly();

  private _loadTemplates(): TaskTemplate[] {
    try {
      const raw = localStorage.getItem(LS.TASK_TEMPLATES);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private _persist(templates: TaskTemplate[]): void {
    this._templates.set(templates);
    try {
      localStorage.setItem(LS.TASK_TEMPLATES, JSON.stringify(templates));
    } catch {
      // Best-effort local persistence
    }
  }

  createTemplateFromTask(
    title: string,
    description: string | undefined,
    task: TaskWithSubTasks,
  ): TaskTemplate {
    const rootTask = this._taskToTemplateNode(task);
    const newTemplate: TaskTemplate = {
      id: nanoid(),
      title: title.trim() || task.title,
      description: description?.trim() || undefined,
      createdAt: Date.now(),
      rootTask,
    };

    const updated = [newTemplate, ...this._templates()];
    this._persist(updated);
    return newTemplate;
  }

  deleteTemplate(id: string): void {
    const updated = this._templates().filter((t) => t.id !== id);
    this._persist(updated);
  }

  instantiateTemplate(
    template: TaskTemplate,
    parentId?: string,
    targetProjectId?: string,
  ): string {
    const rootNode = template.rootTask;
    let rootTaskId: string;

    if (parentId) {
      const subTaskObj = this._taskService.createNewTaskWithDefaults({
        title: rootNode.title,
        additional: {
          parentId,
          ...(targetProjectId ? { projectId: targetProjectId } : {}),
          ...(rootNode.notes ? { notes: rootNode.notes } : {}),
          ...(rootNode.timeEstimate ? { timeEstimate: rootNode.timeEstimate } : {}),
          ...(rootNode.priority !== undefined ? { priority: rootNode.priority } : {}),
        },
      });
      rootTaskId = subTaskObj.id;
      this._store.dispatch(
        addSubTask({
          task: subTaskObj,
          parentId,
        }),
      );
    } else {
      rootTaskId = this._taskService.add(
        rootNode.title,
        false,
        {
          ...(targetProjectId ? { projectId: targetProjectId } : {}),
          ...(rootNode.notes ? { notes: rootNode.notes } : {}),
          ...(rootNode.timeEstimate ? { timeEstimate: rootNode.timeEstimate } : {}),
          ...(rootNode.priority !== undefined ? { priority: rootNode.priority } : {}),
        },
        false,
      );
    }

    if (rootNode.subTasks?.length) {
      for (const child of rootNode.subTasks) {
        this._instantiateRecursive(child, rootTaskId, targetProjectId);
      }
    }

    return rootTaskId;
  }

  private _instantiateRecursive(
    node: TaskTemplateNode,
    parentId: string,
    projectId?: string,
  ): void {
    const subTaskObj = this._taskService.createNewTaskWithDefaults({
      title: node.title,
      additional: {
        parentId,
        ...(projectId ? { projectId } : {}),
        ...(node.notes ? { notes: node.notes } : {}),
        ...(node.timeEstimate ? { timeEstimate: node.timeEstimate } : {}),
        ...(node.priority !== undefined ? { priority: node.priority } : {}),
      },
    });
    this._store.dispatch(
      addSubTask({
        task: subTaskObj,
        parentId,
      }),
    );
    if (node.subTasks?.length) {
      for (const child of node.subTasks) {
        this._instantiateRecursive(child, subTaskObj.id, projectId);
      }
    }
  }

  private _taskToTemplateNode(task: TaskWithSubTasks): TaskTemplateNode {
    return {
      title: task.title,
      ...(task.notes ? { notes: task.notes } : {}),
      ...(task.timeEstimate ? { timeEstimate: task.timeEstimate } : {}),
      ...(task.priority !== undefined ? { priority: task.priority } : {}),
      subTasks: (task.subTasks || []).map((sub) =>
        this._taskToTemplateNode(sub as TaskWithSubTasks),
      ),
    };
  }
}
