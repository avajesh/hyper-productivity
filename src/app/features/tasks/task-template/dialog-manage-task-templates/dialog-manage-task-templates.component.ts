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
import { TaskTemplate, TaskTemplateNode } from '../task-template.model';
import { TaskTemplateService } from '../task-template.service';
import { SnackService } from '../../../../core/snack/snack.service';
import { T } from '../../../../t.const';
import { TranslatePipe } from '@ngx-translate/core';

export interface DialogManageTaskTemplatesData {
  targetParentId?: string;
  targetProjectId?: string;
}

@Component({
  selector: 'dialog-manage-task-templates',
  templateUrl: './dialog-manage-task-templates.component.html',
  styleUrl: './dialog-manage-task-templates.component.scss',
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
export class DialogManageTaskTemplatesComponent {
  readonly data: DialogManageTaskTemplatesData =
    inject(MAT_DIALOG_DATA, { optional: true }) || {};
  private readonly _dialogRef = inject(MatDialogRef<DialogManageTaskTemplatesComponent>);
  private readonly _templateService = inject(TaskTemplateService);
  private readonly _snackService = inject(SnackService);

  readonly T = T;
  readonly searchTxt = signal('');
  readonly templates = this._templateService.templates;

  readonly filteredTemplates = computed<TaskTemplate[]>(() => {
    const list = this.templates();
    const query = this.searchTxt().trim().toLowerCase();
    if (!query) return list;
    return list.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query)) ||
        t.rootTask.title.toLowerCase().includes(query),
    );
  });

  countSubTasks(node: TaskTemplateNode): number {
    let count = 0;
    if (node.subTasks) {
      count += node.subTasks.length;
      for (const child of node.subTasks) {
        count += this.countSubTasks(child);
      }
    }
    return count;
  }

  insertTemplate(template: TaskTemplate): void {
    this._templateService.instantiateTemplate(
      template,
      this.data.targetParentId,
      this.data.targetProjectId,
    );
    this._snackService.open({
      type: 'SUCCESS',
      msg: `Created tasks from template "${template.title}"`,
      isSkipTranslate: true,
    });
    this._dialogRef.close(true);
  }

  deleteTemplate(event: MouseEvent, template: TaskTemplate): void {
    event.stopPropagation();
    this._templateService.deleteTemplate(template.id);
    this._snackService.open({
      type: 'SUCCESS',
      msg: `Deleted template "${template.title}"`,
      isSkipTranslate: true,
    });
  }

  close(): void {
    this._dialogRef.close(false);
  }
}
