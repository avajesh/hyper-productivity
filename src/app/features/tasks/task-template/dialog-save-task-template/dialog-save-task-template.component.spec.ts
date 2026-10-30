import { TestBed } from '@angular/core/testing';
import {
  DialogSaveTaskTemplateComponent,
  DialogSaveTaskTemplateData,
} from './dialog-save-task-template.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskTemplateService } from '../task-template.service';
import { SnackService } from '../../../../core/snack/snack.service';
import { TaskWithSubTasks } from '../../task.model';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DialogSaveTaskTemplateComponent', () => {
  let component: DialogSaveTaskTemplateComponent;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DialogSaveTaskTemplateComponent>>;
  let templateServiceSpy: jasmine.SpyObj<TaskTemplateService>;
  let snackServiceSpy: jasmine.SpyObj<SnackService>;

  const mockTask: TaskWithSubTasks = {
    id: 't_mock',
    title: 'Release Sprint',
    subTaskIds: [],
    subTasks: [],
    isDone: false,
    tagIds: [],
    timeSpent: 0,
    timeSpentOnDay: {},
    created: Date.now(),
  } as unknown as TaskWithSubTasks;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    templateServiceSpy = jasmine.createSpyObj('TaskTemplateService', [
      'createTemplateFromTask',
    ]);
    snackServiceSpy = jasmine.createSpyObj('SnackService', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        DialogSaveTaskTemplateComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { task: mockTask } as DialogSaveTaskTemplateData,
        },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: TaskTemplateService, useValue: templateServiceSpy },
        { provide: SnackService, useValue: snackServiceSpy },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(DialogSaveTaskTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize with task title', () => {
    expect(component.templateTitle()).toBe('Release Sprint');
  });

  it('should create template and close dialog on save', () => {
    component.templateTitle.set('Sprint Checklist');
    component.description.set('Standard sprint items');
    component.save();

    expect(templateServiceSpy.createTemplateFromTask).toHaveBeenCalledWith(
      'Sprint Checklist',
      'Standard sprint items',
      mockTask,
    );
    expect(snackServiceSpy.open).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
