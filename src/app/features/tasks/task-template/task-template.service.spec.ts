import { TestBed } from '@angular/core/testing';
import { TaskTemplateService } from './task-template.service';
import { TaskService } from '../task.service';
import { Store } from '@ngrx/store';
import { TaskWithSubTasks } from '../task.model';
import { LS } from '../../../core/persistence/storage-keys.const';
import { addSubTask } from '../store/task.actions';

describe('TaskTemplateService', () => {
  let service: TaskTemplateService;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let storeMock: jasmine.SpyObj<Store>;

  const mockTaskHierarchy: TaskWithSubTasks = {
    id: 't1',
    title: 'Deploy App',
    notes: 'Important release notes',
    timeEstimate: 3600000,
    subTaskIds: ['s1'],
    subTasks: [
      {
        id: 's1',
        title: 'Run Tests',
        notes: 'Integration specs',
        subTaskIds: ['ss1'],
        subTasks: [
          {
            id: 'ss1',
            title: 'E2E Suite',
            subTaskIds: [],
            subTasks: [],
          } as unknown as TaskWithSubTasks,
        ],
      } as unknown as TaskWithSubTasks,
    ],
  } as unknown as TaskWithSubTasks;

  beforeEach(() => {
    localStorage.removeItem(LS.TASK_TEMPLATES);

    taskServiceMock = jasmine.createSpyObj('TaskService', [
      'add',
      'createNewTaskWithDefaults',
    ]);
    storeMock = jasmine.createSpyObj('Store', ['dispatch']);

    taskServiceMock.add.and.returnValue('new_root_id');
    taskServiceMock.createNewTaskWithDefaults.and.callFake((args) => ({
      id: 'sub_' + Math.random().toString(36).substring(7),
      title: args.title,
      subTaskIds: [],
      tagIds: [],
      timeSpent: 0,
      timeSpentOnDay: {},
      created: Date.now(),
      isDone: false,
    }));

    TestBed.configureTestingModule({
      providers: [
        TaskTemplateService,
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Store, useValue: storeMock },
      ],
    });

    service = TestBed.inject(TaskTemplateService);
  });

  afterEach(() => {
    localStorage.removeItem(LS.TASK_TEMPLATES);
  });

  it('should create and persist a template from a task hierarchy', () => {
    const template = service.createTemplateFromTask(
      'Deploy Workflow',
      'Release checklist',
      mockTaskHierarchy,
    );

    expect(template.title).toBe('Deploy Workflow');
    expect(template.description).toBe('Release checklist');
    expect(template.rootTask.title).toBe('Deploy App');
    expect(template.rootTask.notes).toBe('Important release notes');
    expect(template.rootTask.subTasks?.length).toBe(1);
    expect(template.rootTask.subTasks?.[0].title).toBe('Run Tests');
    expect(template.rootTask.subTasks?.[0].subTasks?.length).toBe(1);
    expect(template.rootTask.subTasks?.[0].subTasks?.[0].title).toBe('E2E Suite');

    expect(service.templates().length).toBe(1);
  });

  it('should delete a template by id', () => {
    const template = service.createTemplateFromTask('Test', undefined, mockTaskHierarchy);
    expect(service.templates().length).toBe(1);

    service.deleteTemplate(template.id);
    expect(service.templates().length).toBe(0);
  });

  it('should recursively instantiate a template into new tasks', () => {
    const template = service.createTemplateFromTask(
      'Deploy Workflow',
      undefined,
      mockTaskHierarchy,
    );
    const rootId = service.instantiateTemplate(template);

    expect(rootId).toBe('new_root_id');
    expect(taskServiceMock.add).toHaveBeenCalledWith(
      'Deploy App',
      false,
      jasmine.objectContaining({ notes: 'Important release notes' }),
      false,
    );

    // Should dispatch addSubTask for the two nested levels (s1 and ss1)
    expect(storeMock.dispatch).toHaveBeenCalledTimes(2);
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: addSubTask.type,
        parentId: 'new_root_id',
      }),
    );
  });
});
