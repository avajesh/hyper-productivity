import { TestBed } from '@angular/core/testing';
import {
  DialogMoveToSubtaskComponent,
  DialogMoveToSubtaskData,
} from './dialog-move-to-subtask.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SnackService } from '../../../core/snack/snack.service';
import { selectTaskFeatureState } from '../store/task.selectors';
import { Task, TaskWithSubTasks } from '../task.model';
import { TaskSharedActions } from '../../../root-store/meta/task-shared.actions';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DialogMoveToSubtaskComponent', () => {
  let component: DialogMoveToSubtaskComponent;
  let store: MockStore;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DialogMoveToSubtaskComponent>>;
  let snackServiceSpy: jasmine.SpyObj<SnackService>;

  const currentTask: TaskWithSubTasks = {
    id: 'current_task',
    title: 'Current Task',
    isDone: false,
    subTaskIds: [],
    subTasks: [],
    tagIds: [],
    timeSpent: 0,
    timeSpentOnDay: {},
    created: Date.now(),
  } as unknown as TaskWithSubTasks;

  const mockParentTask: Task = {
    id: 'parent_candidate',
    title: 'Parent Candidate',
    isDone: false,
    subTaskIds: [],
    tagIds: [],
    timeSpent: 0,
    timeSpentOnDay: {},
    created: Date.now(),
  } as unknown as Task;

  const mockDoneTask: Task = {
    id: 'done_task',
    title: 'Done Task',
    isDone: true,
    subTaskIds: [],
    tagIds: [],
    timeSpent: 0,
    timeSpentOnDay: {},
    created: Date.now(),
  } as unknown as Task;

  const initialTaskState = {
    ids: ['current_task', 'parent_candidate', 'done_task'],
    entities: {
      current_task: currentTask,
      parent_candidate: mockParentTask,
      done_task: mockDoneTask,
    },
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    snackServiceSpy = jasmine.createSpyObj('SnackService', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        DialogMoveToSubtaskComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { task: currentTask } as DialogMoveToSubtaskData,
        },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: SnackService, useValue: snackServiceSpy },
        provideMockStore({
          selectors: [{ selector: selectTaskFeatureState, value: initialTaskState }],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    const fixture = TestBed.createComponent(DialogMoveToSubtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should filter candidate tasks excluding self and done tasks', () => {
    const candidates = component.candidateTasks();
    expect(candidates.length).toBe(1);
    expect(candidates[0].task.id).toBe('parent_candidate');
  });

  it('should dispatch convertToSubTask and close dialog on selectParent', () => {
    spyOn(store, 'dispatch');
    component.selectParent(mockParentTask);

    expect(store.dispatch).toHaveBeenCalledWith(
      TaskSharedActions.convertToSubTask({
        taskId: 'current_task',
        targetParentId: 'parent_candidate',
        afterTaskId: null,
      }),
    );
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    expect(snackServiceSpy.open).toHaveBeenCalled();
  });

  it('should filter by search query', () => {
    component.searchTxt.set('Nonexistent');
    expect(component.candidateTasks().length).toBe(0);

    component.searchTxt.set('Candidate');
    expect(component.candidateTasks().length).toBe(1);
  });
});
