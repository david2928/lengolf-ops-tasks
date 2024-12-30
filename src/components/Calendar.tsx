import React, { useState } from 'react';
import { CalendarTask, TaskCompletionHandler, ModalControlHandler } from '../types/task';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, startOfWeek, addDays } from 'date-fns';

interface CalendarProps {
  tasks: CalendarTask[];
  onTaskComplete: TaskCompletionHandler;
  onModalControl: ModalControlHandler;
}

export const Calendar: React.FC<CalendarProps> = ({ tasks, onTaskComplete, onModalControl }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0)); // Start from January 2025
  
  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const startOfCalendar = startOfWeek(startDate);
  
  const days = [];
  let day = startOfCalendar;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getTasksForDay = (date: Date): CalendarTask[] => {
    return tasks.filter(task => isSameDay(parseISO(task.date), date));
  };

  const getTaskClass = (task: CalendarTask) => {
    const baseClasses = "text-xs p-1 rounded cursor-pointer w-full";
    return task.status === 'completed'
      ? `${baseClasses} bg-green-100 hover:bg-green-200`
      : `${baseClasses} bg-blue-100 hover:bg-blue-200`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          return (
            <div
              key={day.toString()}
              className={`min-h-[100px] border p-2 hover:bg-gray-50 ${isCurrentMonth ? '' : 'bg-gray-50'}`}
            >
              <div className={`text-sm mb-1 ${isCurrentMonth ? '' : 'text-gray-400'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {isCurrentMonth && dayTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onModalControl({ isOpen: true, task })}
                    className={getTaskClass(task)}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {tasks.length === 0 && <div>No tasks loaded</div>}
    </div>
  );
};