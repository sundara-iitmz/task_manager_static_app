import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskInput from './TaskInput';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import TaskStats from './TaskStats';
import StorageInfo from './StorageInfo';
import Notification from './Notification';
import '../styles/index.css';

export default function TaskApp() {
    const { tasks, loading, backendAvailable, addTask, toggleTask, updateTask, deleteTask } = useTasks();
    const [currentFilter, setCurrentFilter] = useState('all');
    const [editingId, setEditingId] = useState(null);
    const [notification, setNotification] = useState(null);

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleAddTask = async (text) => {
        try {
            await addTask(text);
            showNotification('Task created successfully', 'success');
        } catch (err) {
            showNotification(err.message, 'error');
        }
    };

    const handleToggleTask = async (id) => {
        try {
            await toggleTask(id);
        } catch (err) {
            showNotification(err.message, 'error');
        }
    };

    const handleUpdateTask = async (id, newText) => {
        try {
            await updateTask(id, newText);
            showNotification('Task updated', 'success');
            setEditingId(null);
        } catch (err) {
            showNotification(err.message, 'error');
        }
    };

    const handleDeleteTask = async (id) => {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(id);
                showNotification('Task deleted', 'success');
            } catch (err) {
                showNotification(err.message, 'error');
            }
        }
    };

    if (loading) {
        return <div className="container"><h1>Loading...</h1></div>;
    }

    return (
        <div className="container">
            <h1>My Task Manager</h1>

            <TaskInput onAddTask={handleAddTask} />
            <TaskFilters currentFilter={currentFilter} onFilterChange={setCurrentFilter} />

            <TaskList
                tasks={filteredTasks}
                editingId={editingId}
                onToggleTask={handleToggleTask}
                onEditTask={setEditingId}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onCancelEdit={() => setEditingId(null)}
            />

            <TaskStats tasks={tasks} />
            <StorageInfo backendAvailable={backendAvailable} taskCount={tasks.length} />

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                />
            )}
        </div>
    );
}
