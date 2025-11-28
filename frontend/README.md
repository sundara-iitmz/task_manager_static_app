# Task Manager Frontend

A React-based task management application using Vite, with support for both backend API and local storage.

## Features

- ✅ Create, read, update, and delete tasks
- ✅ Filter tasks (All, Active, Completed)
- ✅ Mark tasks as complete
- ✅ Edit tasks in-place
- ✅ Backend API integration (with fallback to localStorage)
- ✅ Real-time storage status indicator
- ✅ Responsive design

## Project Structure

```
src/
├── components/          # React components
│   ├── TaskApp.jsx     # Main app component
│   ├── TaskInput.jsx   # Task input form
│   ├── TaskFilters.jsx # Filter buttons
│   ├── TaskList.jsx    # Task list container
│   ├── TaskItem.jsx    # Individual task item
│   ├── TaskStats.jsx   # Statistics display
│   ├── StorageInfo.jsx # Storage status
│   └── Notification.jsx# Toast notifications
├── hooks/              # Custom React hooks
│   └── useTasks.js    # Task management logic
├── services/           # API integration
│   └── api.js         # API functions
├── styles/             # CSS stylesheets
│   └── index.css      # Main styles
└── main.jsx           # React entry point
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## API Configuration

The app connects to the backend API at `http://localhost:5000/api`

If the backend is unavailable, it automatically falls back to localStorage.

## Technologies

- React 19
- Vite 7
- Modern JavaScript (ES modules)
