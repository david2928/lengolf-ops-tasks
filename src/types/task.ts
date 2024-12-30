export interface BaseTask {
  id: string;
  title: string;
  details: string;
  status: 'open' | 'completed';
  priority?: 'low' | 'normal' | 'high';
}

export interface CalendarTask extends BaseTask {
  date: string;
}

export interface OpenTask extends BaseTask {}

export type TaskType = 'calendar' | 'open';

export type TaskCompletionHandler = (taskId: string, type: TaskType) => void;
export type TaskEditHandler = (task: CalendarTask | OpenTask) => void;
export type TaskDeleteHandler = (taskId: string, type: TaskType) => void;
export type TaskReorderHandler = (tasks: OpenTask[]) => void;

export interface TaskModalState {
  isOpen: boolean;
  task: CalendarTask | OpenTask | null;
}

export type ModalControlHandler = (state: TaskModalState) => void;

// Utility function to ensure valid task status
export function ensureValidTaskStatus<T extends BaseTask>(tasks: T[]): T[] {
  return tasks.map(task => ({
    ...task,
    status: (task.status === 'completed' || task.status === 'open') 
      ? task.status 
      : 'open' as const
  }));
}

// Type guard to check if a task is a CalendarTask
export function isCalendarTask(task: BaseTask): task is CalendarTask {
  return 'date' in task;
}