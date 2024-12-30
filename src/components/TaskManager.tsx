import React, { useState, useEffect } from 'react';
import { Calendar } from './Calendar';
import { OpenTasks } from './OpenTasks';
import { TaskModal } from './TaskModal';
import { CalendarTask, OpenTask, TaskModalState, TaskType } from '../types/task';

interface TaskManagerProps {
  calendarTasks: CalendarTask[];
  openTasks: OpenTask[];
  onTaskComplete: (taskId: string, type: TaskType) => void;
  onTaskReorder?: (tasks: OpenTask[]) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  calendarTasks,
  openTasks,
  onTaskComplete,
  onTaskReorder
}) => {
  const [modalState, setModalState] = useState<TaskModalState>({
    isOpen: false,
    task: null
  });

  const [taskOrder, setTaskOrder] = useState<OpenTask[]>(openTasks);

  useEffect(() => {
    setTaskOrder(openTasks);
  }, [openTasks]);

  const handleReorder = (reorderedTasks: OpenTask[]) => {
    setTaskOrder(reorderedTasks);
    onTaskReorder?.(reorderedTasks);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Calendar 
        tasks={calendarTasks}
        onTaskComplete={onTaskComplete}
        onModalControl={setModalState}
      />
      
      <OpenTasks 
        tasks={taskOrder}
        onTaskComplete={onTaskComplete}
        onModalControl={setModalState}
        onReorder={handleReorder}
      />
      
      <TaskModal 
        modalState={modalState}
        onClose={() => setModalState({ isOpen: false, task: null })}
        onComplete={onTaskComplete}
      />
    </div>
  );
};