import { AppDataComplete } from '../../op-log/model/model-config';
import { Log } from '../../core/log';

export const isValidBackupData = (data: AppDataComplete): boolean => {
  if (!data || !data.task || !data.task.entities) return false;

  const tasks = data.task.entities;
  let isValid = true;
  let unresolvedCount = 0;

  // 1. Check project taskIds and backlogTaskIds
  if (data.project && data.project.entities && data.project.ids) {
    for (const projectId of data.project.ids as string[]) {
      const project = data.project.entities[projectId];
      if (project) {
        const allProjectTasks = [
          ...(project.taskIds || []),
          ...(project.backlogTaskIds || []),
        ];
        for (const taskId of allProjectTasks) {
          if (!tasks[taskId]) {
            unresolvedCount++;
            isValid = false;
          }
        }
      }
    }
  }

  // 2. Check tag taskIds
  if (data.tag && data.tag.entities && data.tag.ids) {
    for (const tagId of data.tag.ids as string[]) {
      const tag = data.tag.entities[tagId];
      if (tag && tag.taskIds) {
        for (const taskId of tag.taskIds) {
          if (!tasks[taskId]) {
            unresolvedCount++;
            isValid = false;
          }
        }
      }
    }
  }

  // 3. Check task subTaskIds
  if (data.task.ids) {
    for (const taskId of data.task.ids as string[]) {
      const task = data.task.entities[taskId];
      if (task && task.subTaskIds) {
        for (const subTaskId of task.subTaskIds) {
          if (!tasks[subTaskId]) {
            unresolvedCount++;
            isValid = false;
          }
        }
      }
    }
  }

  if (!isValid) {
    Log.error(
      `Backup validation failed: found ${unresolvedCount} unresolved task IDs referenced in projects, tags, or parents. Skipping backup.`,
    );
  }

  return isValid;
};
