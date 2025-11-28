import { useState, useEffect } from 'react';
import {
    fetchAllTasks,
    createTaskAPI,
    updateTaskAPI,
    deleteTaskAPI,
    convertBackendTask,
    checkBackendAvailability
} from '../services/api';

export function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [backendAvailable, setBackendAvailable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize tasks on mount
    useEffect(() => {
        initializeTasks();
    }, []);

    const initializeTasks = async () => {
        try {
            const available = await checkBackendAvailability();
            setBackendAvailable(available);

            if (available) {
                console.log('✓ Backend connected');
                const fetchedTasks = await fetchAllTasks();
                setTasks(fetchedTasks.map(convertBackendTask));
            } else {
                console.warn('⚠️ Backend not available, using localStorage');
                const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
                setTasks(storedTasks);
            }
            setError(null);
        } catch (err) {
            console.error('Failed to initialize tasks:', err);
            const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
            setTasks(storedTasks);
        } finally {
            setLoading(false);
        }
    };

    const saveTasks = (updatedTasks) => {
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        sessionStorage.setItem('tasks', JSON.stringify(updatedTasks));
        localStorage.setItem('lastSaved', new Date().toISOString());
        sessionStorage.setItem('lastSaved', new Date().toISOString());
    };

    const addTask = async (text) => {
        if (!text.trim()) {
            throw new Error('Please enter a task!');
        }

        try {
            if (backendAvailable) {
                const backendTask = await createTaskAPI(text);
                const newTask = convertBackendTask(backendTask);
                setTasks([...tasks, newTask]);
                return newTask;
            } else {
                const newTask = {
                    id: Date.now(),
                    text: text,
                    description: '',
                    completed: false,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                };
                const updatedTasks = [...tasks, newTask];
                setTasks(updatedTasks);
                saveTasks(updatedTasks);
                return newTask;
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const toggleTask = async (id) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const updatedTasks = tasks.map(t =>
            t.id === id
                ? { ...t, completed: !t.completed, status: !t.completed ? 'completed' : 'pending' }
                : t
        );

        try {
            if (backendAvailable) {
                await updateTaskAPI(id, { status: updatedTasks.find(t => t.id === id).status });
            } else {
                saveTasks(updatedTasks);
            }
            setTasks(updatedTasks);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateTask = async (id, newText) => {
        if (!newText.trim()) {
            throw new Error('Please enter a task!');
        }

        const updatedTasks = tasks.map(t =>
            t.id === id ? { ...t, text: newText } : t
        );

        try {
            if (backendAvailable) {
                await updateTaskAPI(id, { title: newText });
            } else {
                saveTasks(updatedTasks);
            }
            setTasks(updatedTasks);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteTask = async (id) => {
        try {
            if (backendAvailable) {
                await deleteTaskAPI(id);
            }
            const updatedTasks = tasks.filter(t => t.id !== id);
            if (!backendAvailable) {
                saveTasks(updatedTasks);
            }
            setTasks(updatedTasks);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        tasks,
        loading,
        error,
        backendAvailable,
        addTask,
        toggleTask,
        updateTask,
        deleteTask
    };
}
