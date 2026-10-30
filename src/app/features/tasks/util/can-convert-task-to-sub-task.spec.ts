import { Task } from '../task.model';
import {
  canApplyConvertToSubTask,
  canConvertTaskToSubTask,
  canDropTaskIntoSubTaskList,
} from './can-convert-task-to-sub-task';

// An eligible top-level task: every guard field empty.
const eligible = (): Parameters<typeof canConvertTaskToSubTask>[0] => ({
  parentId: undefined,
  subTaskIds: [],
  repeatCfgId: undefined,
  issueId: undefined,
  issueProviderId: undefined,
  issueType: undefined,
  dueWithTime: undefined,
  reminderId: undefined,
  remindAt: undefined,
});

describe('canConvertTaskToSubTask', () => {
  it('accepts a plain top-level task with no blocking fields', () => {
    expect(canConvertTaskToSubTask(eligible())).toBe(true);
  });

  it('accepts a task that is already a subtask (allows infinite re-parenting via drag)', () => {
    expect(canConvertTaskToSubTask({ ...eligible(), parentId: 'p1' })).toBe(true);
  });

  it('accepts a task that already has subtasks (allows subtree re-parenting)', () => {
    expect(canConvertTaskToSubTask({ ...eligible(), subTaskIds: ['s1'] })).toBe(true);
  });

  it('rejects a repeating task', () => {
    expect(canConvertTaskToSubTask({ ...eligible(), repeatCfgId: 'r1' })).toBe(false);
  });

  it('rejects an issue-provider task', () => {
    expect(canConvertTaskToSubTask({ ...eligible(), issueId: 'i1' })).toBe(false);
    expect(canConvertTaskToSubTask({ ...eligible(), issueProviderId: 'ip1' })).toBe(
      false,
    );
    expect(
      canConvertTaskToSubTask({
        ...eligible(),
        issueType: 'JIRA' as Task['issueType'],
      }),
    ).toBe(false);
  });
});

describe('canDropTaskIntoSubTaskList', () => {
  // #11027: the drop unschedules first, so time and reminder don't block it.
  it('accepts a timed task with a reminder', () => {
    expect(
      canDropTaskIntoSubTaskList({ ...eligible(), dueWithTime: 1234, remindAt: 1234 }),
    ).toBe(true);
  });

  it('still rejects the other blocking fields', () => {
    expect(canDropTaskIntoSubTaskList({ ...eligible(), repeatCfgId: 'r1' })).toBe(false);
    expect(canDropTaskIntoSubTaskList({ ...eligible(), issueId: 'i1' })).toBe(false);
    expect(canDropTaskIntoSubTaskList({ ...eligible(), subTaskIds: ['s1'] })).toBe(false);
    // legacy reminder: unscheduleTask doesn't clear reminderId
    expect(canDropTaskIntoSubTaskList({ ...eligible(), reminderId: 'rem1' })).toBe(false);
  });
});

describe('canApplyConvertToSubTask', () => {
  const task = { ...eligible(), id: 't1' };
  const parent: Pick<Task, 'id' | 'parentId'> = { id: 'p1', parentId: undefined };

  it('accepts an eligible task onto a valid top-level parent', () => {
    expect(canApplyConvertToSubTask(task, parent)).toBe(true);
  });

  it('accepts an existing subtask being re-parented to another subtask (deep nesting)', () => {
    const subtask = { ...eligible(), id: 'child', parentId: 'p1' };
    const newParent: Pick<Task, 'id' | 'parentId'> = { id: 'p2', parentId: 'root' };
    expect(canApplyConvertToSubTask(subtask, newParent)).toBe(true);
  });

  it('rejects when the task is missing', () => {
    expect(canApplyConvertToSubTask(undefined, parent)).toBe(false);
  });

  it('rejects when the target parent is missing', () => {
    expect(canApplyConvertToSubTask(task, undefined)).toBe(false);
  });

  it('rejects self-nesting', () => {
    expect(
      canApplyConvertToSubTask(
        { ...task, id: 'same' },
        { id: 'same', parentId: undefined },
      ),
    ).toBe(false);
  });

  it('rejects direct cycle: task A → target B where B is a child of A', () => {
    // task 'a' has subtask 'b'; trying to put 'a' under 'b' would cycle
    const taskA = { ...eligible(), id: 'a' };
    const taskB: Pick<Task, 'id' | 'parentId'> = { id: 'b', parentId: 'a' };
    const getState = () => ({
      entities: { a: { id: 'a', parentId: undefined }, b: taskB } as Record<
        string,
        Pick<Task, 'id' | 'parentId'> | undefined
      >,
    });
    expect(canApplyConvertToSubTask(taskA, taskB, getState)).toBe(false);
  });

  it('rejects deep cycle: A → C where C → B → A', () => {
    const taskA = { ...eligible(), id: 'a' };
    const getState = () => ({
      entities: {
        a: { id: 'a', parentId: undefined },
        b: { id: 'b', parentId: 'a' },
        c: { id: 'c', parentId: 'b' },
      } as Record<string, Pick<Task, 'id' | 'parentId'> | undefined>,
    });
    const taskC: Pick<Task, 'id' | 'parentId'> = { id: 'c', parentId: 'b' };
    expect(canApplyConvertToSubTask(taskA, taskC, getState)).toBe(false);
  });

  it('allows valid non-cyclic deep nesting with getState', () => {
    const taskX = { ...eligible(), id: 'x' };
    const taskY: Pick<Task, 'id' | 'parentId'> = { id: 'y', parentId: 'root' };
    const getState = () => ({
      entities: {
        root: { id: 'root', parentId: undefined },
        y: taskY,
      } as Record<string, Pick<Task, 'id' | 'parentId'> | undefined>,
    });
    expect(canApplyConvertToSubTask(taskX, taskY, getState)).toBe(true);
  });
});

