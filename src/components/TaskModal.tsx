import React from 'react';
import { CalendarTask, OpenTask, TaskCompletionHandler, TaskModalState } from '../types/task';

interface TaskModalProps {
  modalState: TaskModalState;
  onClose: () => void;
  onComplete: TaskCompletionHandler;
}

export const TaskModal: React.FC<TaskModalProps> = ({ modalState, onClose, onComplete }) => {
  if (!modalState.isOpen || !modalState.task) return null;

  const task = modalState.task;
  const isCalendarTask = 'date' in task;

  const handleComplete = () => {
    onComplete(task.id, isCalendarTask ? 'calendar' : 'open');
    onClose();
  };

  const getStatusBadge = (status: 'open' | 'completed') => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    return status === 'completed'
      ? `${baseClasses} bg-green-100 text-green-800 border border-green-200`
      : `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
  };

  const getPriorityBadge = (priority?: 'low' | 'normal' | 'high') => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (priority) {
      case 'high': return `${baseClasses} bg-red-100 text-red-800`;
      case 'low': return `${baseClasses} bg-green-100 text-green-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
            <span className={getStatusBadge(task.status)}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {isCalendarTask && (
            <div>
              <span className="font-medium">Date: </span>
              <span>{(task as CalendarTask).date}</span>
            </div>
          )}

          {!isCalendarTask && task.priority && (
            <div>
              <span className="font-medium">Priority: </span>
              <span className={getPriorityBadge(
                (task as OpenTask).priority as 'low' | 'normal' | 'high'
              )}>
                {(task as OpenTask).priority}
              </span>
            </div>
          )}

          <div>
            <span className="font-medium">Details: </span>
            <p className="mt-1 text-gray-600">{task.details}</p>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Close
            </button>
            <button
              onClick={handleComplete}
              className={`px-4 py-2 ${
                task.status === 'completed'
                  ? 'bg-gray-500 hover:bg-gray-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white rounded`}
            >
              {task.status === 'completed' ? 'Reopen' : 'Complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};