import React from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { OpenTask, TaskCompletionHandler, ModalControlHandler, TaskReorderHandler } from '../types/task';

interface OpenTasksProps {
  tasks: OpenTask[];
  onTaskComplete: TaskCompletionHandler;
  onModalControl: ModalControlHandler;
  onReorder: TaskReorderHandler;
}

export const OpenTasks: React.FC<OpenTasksProps> = ({ tasks, onTaskComplete, onModalControl, onReorder }) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);
    onReorder(newTasks);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Open Tasks</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="OPEN_TASKS">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {tasks.map((task, index) => (
                <Draggable draggableId={task.id} index={index} key={task.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
                      className={`p-4 rounded-lg ${task.status === 'completed' ? 'bg-gray-50' : 'bg-white'} 
                               border hover:border-blue-300 cursor-pointer transition-colors`}
                      onClick={() => onModalControl({ isOpen: true, task })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                          <h3 className={`font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : ''}`}>
                            {task.title}
                          </h3>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskComplete(task.id, 'open');
                          }}
                          className={`px-3 py-1 text-sm rounded ${
                            task.status === 'completed'
                              ? 'bg-gray-500 hover:bg-gray-600'
                              : 'bg-blue-500 hover:bg-blue-600'
                          } text-white`}
                        >
                          {task.status === 'completed' ? 'Reopen' : 'Complete'}
                        </button>
                      </div>
                      <p className={`mt-2 text-sm ${task.status === 'completed' ? 'text-gray-500' : 'text-gray-600'}`}>
                        {task.details}
                      </p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};