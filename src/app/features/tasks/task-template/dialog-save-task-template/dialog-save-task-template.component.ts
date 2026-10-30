import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TaskWithSubTasks } from '../../task.model';
import { TaskTemplateService } from '../task-template.service';
import { SnackService } from '../../../../core/snack/snack.service';
import { T } from '../../../../t.const';
import { TranslatePipe } from '@ngx-translate/core';

export interface DialogSaveTaskTemplateData {
  task: TaskWithSubTasks;
}

@Component({
  selector: 'dialog-save-task-template',
  templateUrl: './dialog-save-task-template.component.html',
  styleUrl: './dialog-save-task-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    TranslatePipe,
  ],
})
export class DialogSaveTaskTemplateComponent {
  readonly data: DialogSaveTaskTemplateData = inject(MAT_DIALOG_DATA);
  private readonly _dialogRef = inject(MatDialogRef<DialogSaveTaskTemplateComponent>);
  private readonly _templateService = inject(TaskTemplateService);
  private readonly _snackService = inject(SnackService);

  readonly T = T;
  readonly templateTitle = signal(this.data.task.title);
  readonly description = signal('');

  save(): void {
    const title = this.templateTitle().trim() || this.data.task.title;
    this._templateService.createTemplateFromTask(
      title,
      this.description(),
      this.data.task,
    );
    this._snackService.open({
      type: 'SUCCESS',
      msg: `Saved template "${title}"`,
      isSkipTranslate: true,
    });
    this._dialogRef.close(true);
  }

  close(): void {
    this._dialogRef.close(false);
  }
}
