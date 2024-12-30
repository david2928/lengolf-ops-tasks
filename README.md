# LENGOLF Operations Task Manager

## Purpose
Task management system for LENGOLF operations with calendar and open tasks.

## Data Structure

### Calendar Tasks (calendar_tasks.csv)
```csv
Date,Title,Details,Status
2025-01-01,Salaries,Make Payments to Staff,open
2025-01-08,Prepare Staff Schedule,Prepare Staff Schedule and share via LINE to staff,open
```

### Open Tasks (open_tasks.csv)
```csv
Title,Details,Status
Tax Audit,Prepare documents and review tax filings,open
Sink Repair,Schedule and oversee repair,completed
```

## Project Structure
```
lengolf-ops-tasks/
├── src/
│   ├── components/              
│   │   ├── TaskManager.tsx     # Main container
│   │   ├── Calendar.tsx        # Calendar view
│   │   ├── OpenTasks.tsx       # Open tasks list
│   │   └── TaskModal.tsx       # Task details modal
│   ├── types/                  
│   │   └── task.ts            # Type definitions
│   ├── utils/                  
│   │   └── csvParser.ts       # CSV handling
│   ├── data/                   
│   │   ├── calendar_tasks.csv # Scheduled tasks
│   │   └── open_tasks.csv     # Ongoing tasks
│   ├── App.tsx                 
│   └── main.tsx               
├── tailwind.config.js          
├── package.json                
└── README.md                   
```

## Features
- Calendar view with monthly navigation and task completion tracking
- Drag-and-drop reordering for open tasks
- Task details modal with status management
- Visual distinction for completed tasks
- Persistence of task status and order

## Setup
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```