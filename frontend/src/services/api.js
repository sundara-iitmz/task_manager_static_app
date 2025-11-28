// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// ==================== API HELPER FUNCTIONS ====================

/**
 * Make API request with error handling
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `HTTP Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * GET all tasks from backend
 */
export async function fetchAllTasks() {
    try {
        const response = await apiRequest('/tasks');
        return response.tasks || [];
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        throw error;
    }
}

/**
 * GET single task by ID
 */
export async function fetchTask(taskId) {
    try {
        const response = await apiRequest(`/tasks/${taskId}`);
        return response.task;
    } catch (error) {
        console.error('Failed to fetch task:', error);
        throw error;
    }
}

/**
 * POST - Create new task
 */
export async function createTaskAPI(title, description = '') {
    try {
        const response = await apiRequest('/tasks', 'POST', {
            title: title,
            description: description,
            status: 'pending'
        });
        return response.task;
    } catch (error) {
        console.error('Failed to create task:', error);
        throw error;
    }
}

/**
 * PUT - Update task
 */
export async function updateTaskAPI(taskId, updates) {
    try {
        const response = await apiRequest(`/tasks/${taskId}`, 'PUT', updates);
        return response.task;
    } catch (error) {
        console.error('Failed to update task:', error);
        throw error;
    }
}

/**
 * DELETE - Delete task
 */
export async function deleteTaskAPI(taskId) {
    try {
        await apiRequest(`/tasks/${taskId}`, 'DELETE');
        return true;
    } catch (error) {
        console.error('Failed to delete task:', error);
        throw error;
    }
}

/**
 * Convert backend task format to frontend format
 */
export function convertBackendTask(backendTask) {
    return {
        id: backendTask.id,
        text: backendTask.title,
        description: backendTask.description || '',
        completed: backendTask.status === 'completed',
        status: backendTask.status,
        createdAt: backendTask.created_at,
        updatedAt: backendTask.updated_at
    };
}

/**
 * Check if backend is available
 */
export async function checkBackendAvailability() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        return response.ok;
    } catch (error) {
        console.warn('Backend not available:', error);
        return false;
    }
}
