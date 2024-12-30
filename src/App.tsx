import { useEffect, useState } from 'react';
import { TaskManager } from './components/TaskManager';
import { CalendarTask, OpenTask, TaskType } from './types/task';
import { loadTasks, saveTasks } from './utils/csvParser';

function App() {
  const [calendarTasks, setCalendarTasks] = useState<CalendarTask[]>([]);
  const [openTasks, setOpenTasks] = useState<OpenTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeTasks = async () => {
      try {
        const { calendarTasks: calendar, openTasks: open } = await loadTasks();
        setCalendarTasks(calendar);
        setOpenTasks(open);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeTasks();
  }, []);

  const handleTaskComplete = (taskId: string, type: TaskType) => {
    if (type === 'open') {
      const updatedTasks = openTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: task.status === 'completed' ? 'open' : 'completed' } 
          : task
      ) as OpenTask[];
      setOpenTasks(updatedTasks);
      saveTasks(calendarTasks, updatedTasks);
    } else {
      const updatedTasks = calendarTasks.map(task =>
        task.id === taskId
          ? { ...task, status: task.status === 'completed' ? 'open' : 'completed' }
          : task
      ) as CalendarTask[];
      setCalendarTasks(updatedTasks);
      saveTasks(updatedTasks, openTasks);
    }
  };

  const handleTaskReorder = (reorderedTasks: OpenTask[]) => {
    setOpenTasks(reorderedTasks);
    saveTasks(calendarTasks, reorderedTasks);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold text-gray-900">LENGOLF Operations Tasks</h1>
        </div>
      </header>

      <main className="py-6">
        <TaskManager
          calendarTasks={calendarTasks}
          openTasks={openTasks}
          onTaskComplete={handleTaskComplete}
          onTaskReorder={handleTaskReorder}
        />
      </main>
    </div>
  );
}

export default App;