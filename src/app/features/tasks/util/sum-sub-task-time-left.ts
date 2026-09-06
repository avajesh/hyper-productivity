import { Task } from '../task.model';

/**
 * The work still outstanding across sub tasks: a done sub task contributes nothing,
 * and one that has run over its estimate is clamped at 0 rather than going negative.
 *
 * This is the value a parent task's `timeEstimate` holds. It is shared with the task
 * row so what is rendered cannot drift from what the reducer writes.
 *
 * IMPORTANT: For subtasks that themselves have children, their `timeEstimate` is
 * already the remaining time-left (set by a prior `reCalcTimeEstimateForParentIfParent`
 * call). We must NOT subtract `timeSpent` again — that would double-count spent time
 * at every ancestor level, collapsing grandparent estimates to zero.
 */
export const sumSubTaskTimeLeft = (subTasks: Task[]): number =>
  subTasks?.length
    ? subTasks.reduce((acc, subTask) => {
        if (subTask.isDone) return acc;
        // If this subtask has its own children, its timeEstimate is already
        // the "time remaining" figure — do not subtract timeSpent a second time.
        const timeLeft = subTask.subTaskIds?.length
          ? subTask.timeEstimate
          : Math.max(0, subTask.timeEstimate - subTask.timeSpent);
        return acc + timeLeft;
      }, 0)
    : 0;
