import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TaskService } from './task.service';
import { TaskWithSubTasks } from './task.model';
import { addSubTask } from './store/task.actions';
import { PlannerActions } from '../planner/store/planner.actions';
import { isWontDoTask } from './util/is-wont-do-task';

@Injectable({
  providedIn: 'root',
})
export class TaskDuplicateService {
  private readonly _taskService = inject(TaskService);
  private readonly _store = inject(Store);

  duplicate(task: TaskWithSubTasks, targetParentId?: string): string | null {
    if (task.isDone) {
      return null;
    }

    const taskData = {
      isDone: false,
      projectId: task.projectId || undefined,
      tagIds: task.tagIds || [],
      ...(task.notes && { notes: task.notes }),
      ...(task.priority !== undefined && { priority: task.priority }),
    };
    const timeData = {
      ...(task.dueDay && { dueDay: task.dueDay }),
      ...(task.dueWithTime && { dueWithTime: task.dueWithTime }),
      ...(task.timeEstimate && { timeEstimate: task.timeEstimate }),
    };

    const actualParentId = targetParentId ?? task.parentId;
    let taskId: string;

    if (actualParentId) {
      const subTaskObj = this._taskService.createNewTaskWithDefaults({
        title: `${task.title} (copy)`,
        additional: {
          ...taskData,
          ...timeData,
          parentId: actualParentId,
        },
      });
      taskId = subTaskObj.id;
      this._store.dispatch(
        addSubTask({
          task: subTaskObj,
          parentId: actualParentId,
        }),
      );
      if (task.dueDay) {
        this._store.dispatch(
          PlannerActions.planTaskForDay({
            task: subTaskObj,
            day: task.dueDay,
          }),
        );
      }
    } else {
      taskId = this._taskService.add(
        `${task.title} (copy)`,
        false,
        { ...taskData, ...timeData },
        false,
      );
    }

    for (const subTask of task.subTasks) {
      this._duplicateRecursive(subTask as TaskWithSubTasks, taskId);
    }

    return taskId;
  }

  private _duplicateRecursive(task: TaskWithSubTasks, parentId: string): void {
    const subTaskObj = this._taskService.createNewTaskWithDefaults({
      title: task.title,
      additional: {
        parentId,
        isDone: task.isDone,
        ...(isWontDoTask(task) && {
          doneOn: task.doneOn,
          wontDoOn: task.wontDoOn,
        }),
        projectId: task.projectId || undefined,
        timeEstimate: task.timeEstimate,
        ...(task.dueDay && { dueDay: task.dueDay }),
        ...(task.dueWithTime && { dueWithTime: task.dueWithTime }),
        ...(task.notes && { notes: task.notes }),
        ...(task.priority !== undefined && { priority: task.priority }),
      },
    });
    this._store.dispatch(
      addSubTask({
        task: subTaskObj,
        parentId,
      }),
    );
    if (task.dueDay) {
      this._store.dispatch(
        PlannerActions.planTaskForDay({
          task: subTaskObj,
          day: task.dueDay,
        }),
      );
    }
    for (const subSubTask of task.subTasks) {
      this._duplicateRecursive(subSubTask as TaskWithSubTasks, subTaskObj.id);
    }
  }
}
