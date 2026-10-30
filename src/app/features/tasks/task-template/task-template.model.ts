import { TaskPriority } from '../task.model';

export interface TaskTemplateNode {
  title: string;
  notes?: string;
  timeEstimate?: number;
  priority?: TaskPriority | 'high' | 'medium' | 'low' | null;
  subTasks?: TaskTemplateNode[];
}

export interface TaskTemplate {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  rootTask: TaskTemplateNode;
}
