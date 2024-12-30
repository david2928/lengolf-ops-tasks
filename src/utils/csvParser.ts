import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { CalendarTask, OpenTask } from '../types/task';

const validateCSV = (data: any[], requiredFields: string[]) => {
  if (!data || data.length === 0) {
    throw new Error('CSV is empty');
  }
  
  const missingFields = requiredFields.filter(field => 
    !Object.keys(data[0]).includes(field)
  );
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

export const parseCalendarTasks = async (csvContent: string): Promise<CalendarTask[]> => {
  const { data } = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true
  });

  validateCSV(data, ['Title', 'Details', 'Date', 'Status']);

  return data.map((row: any) => ({
    id: uuidv4(),
    title: row.Title || '',
    details: row.Details || '',
    date: row.Date || '',
    status: row.Status?.toLowerCase() === 'completed' ? 'completed' : 'open'
  }));
};

export const parseOpenTasks = async (csvContent: string): Promise<OpenTask[]> => {
  const { data } = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true
  });

  validateCSV(data, ['Title', 'Details', 'Status']);

  return data.map((row: any) => ({
    id: uuidv4(),
    title: row.Title || '',
    details: row.Details || '',
    status: row.Status?.toLowerCase() === 'completed' ? 'completed' : 'open'
  }));
};

export const loadTasks = async () => {
  try {
    const [calendarResponse, openResponse] = await Promise.all([
      fetch('/data/calendar_tasks.csv')
        .then(res => {
          if (!res.ok) throw new Error(`Failed to load calendar tasks: ${res.status}`);
          return res.text();
        }),
      fetch('/data/open_tasks.csv')
        .then(res => {
          if (!res.ok) throw new Error(`Failed to load open tasks: ${res.status}`);
          return res.text();
        })
    ]);

    return {
      calendarTasks: await parseCalendarTasks(calendarResponse),
      openTasks: await parseOpenTasks(openResponse)
    };
  } catch (error) {
    console.error('Error loading tasks:', error);
    throw error;
  }
};

export const saveTasks = async (calendarTasks: CalendarTask[], openTasks: OpenTask[]) => {
  const calendarCsv = Papa.unparse({
    fields: ['Date', 'Title', 'Details', 'Status'],
    data: calendarTasks.map(task => ({
      Date: task.date,
      Title: task.title,
      Details: task.details,
      Status: task.status
    }))
  });

  const openCsv = Papa.unparse({
    fields: ['Title', 'Details', 'Status'],
    data: openTasks.map(task => ({
      Title: task.title,
      Details: task.details,
      Status: task.status
    }))
  });

  const downloadFile = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  try {
    downloadFile('calendar_tasks.csv', calendarCsv);
    downloadFile('open_tasks.csv', openCsv);
  } catch (error) {
    console.error('Failed to save tasks:', error);
    throw error;
  }
};