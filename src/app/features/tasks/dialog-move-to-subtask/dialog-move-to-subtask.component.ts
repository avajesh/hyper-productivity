import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Task, TaskWithSubTasks } from '../task.model';
import { selectTaskFeatureState } from '../store/task.selectors';
import { canApplyConvertToSubTask } from '../util/can-convert-task-to-sub-task';
import { TaskSharedActions } from '../../../root-store/meta/task-shared.actions';
import { SnackService } from '../../../core/snack/snack.service';
import { T } from '../../../t.const';
import { TranslatePipe } from '@ngx-translate/core';

export interface DialogMoveToSubtaskData {
  task: TaskWithSubTasks | Task;
}

export interface CandidateTaskItem {
  task: Task;
  breadcrumb: string;
}

@Component({
  selector: 'dialog-move-to-subtask',
  templateUrl: './dialog-move-to-subtask.component.html',
  styleUrl: './dialog-move-to-subtask.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatSuffix,
    MatInput,
    FormsModule,
    TranslatePipe,
  ],
})
export class DialogMoveToSubtaskComponent {
  readonly data: DialogMoveToSubtaskData = inject(MAT_DIALOG_DATA);
  private readonly _dialogRef = inject(MatDialogRef<DialogMoveToSubtaskComponent>);
  private readonly _store = inject(Store);
  private readonly _snackService = inject(SnackService);

  readonly T = T;
  readonly searchTxt = signal('');

  private readonly _taskState = this._store.selectSignal(selectTaskFeatureState);

  readonly candidateTasks = computed<CandidateTaskItem[]>(() => {
    const taskState = this._taskState();
    const currentTask = this.data.task;
    const query = this.searchTxt().trim().toLowerCase();

    const entities = taskState.entities;
    const ids = taskState.ids as string[];

    const results: CandidateTaskItem[] = [];

    const buildBreadcrumb = (t: Task): string => {
      const parts: string[] = [];
      let curr = t;
      while (curr.parentId && entities[curr.parentId]) {
        const parent = entities[curr.parentId]!;
        parts.unshift(parent.title);
        curr = parent;
      }
      return parts.join(' > ');
    };

    for (const id of ids) {
      const candidate = entities[id];
      if (!candidate || candidate.id === currentTask.id || candidate.isDone) {
        continue;
      }

      // Check if candidate is eligible to be the parent of currentTask
      if (!canApplyConvertToSubTask(currentTask, candidate, () => taskState)) {
        continue;
      }

      const breadcrumb = buildBreadcrumb(candidate);
      if (
        !query ||
        candidate.title.toLowerCase().includes(query) ||
        breadcrumb.toLowerCase().includes(query)
      ) {
        results.push({ task: candidate, breadcrumb });
      }
    }

    return results;
  });

  selectParent(candidate: Task): void {
    const currentTask = this.data.task;
    if (currentTask.dueWithTime || currentTask.reminderId) {
      this._store.dispatch(TaskSharedActions.unscheduleTask({ id: currentTask.id }));
    }

    this._store.dispatch(
      TaskSharedActions.convertToSubTask({
        taskId: currentTask.id,
        targetParentId: candidate.id,
        afterTaskId: null,
      }),
    );

    this._snackService.open({
      type: 'SUCCESS',
      msg: `Moved "${currentTask.title}" under "${candidate.title}"`,
      isSkipTranslate: true,
    });

    this._dialogRef.close(true);
  }

  close(): void {
    this._dialogRef.close(false);
  }
}
