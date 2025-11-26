// Task Manager Application
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('taskForm'); // New: Get the form element
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTasksSpan = document.getElementById('totalTasks'); // New: For stats updates
const completedTasksSpan = document.getElementById('completedTasks'); // New: For stats updates
const clearCompletedBtn = document.getElementById('clearCompletedBtn'); // New: Clear button

// --- Initialization and Event Listeners ---

// Initialize app
function init() {
    renderTasks();
    updateStats();

    // Event Listener for the Form Submission (Handles both button click and Enter key)
    taskForm.addEventListener('submit', handleFormSubmit);

    // Event Listener for Filter Buttons (Uses event delegation on the container if possible, but fine for small list)
    filterBtns.forEach(button => {
        button.addEventListener('click', handleFilterChange);
    });

    // Event Listener for Clear Completed Button
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
}

// Handler for form submission
function handleFormSubmit(event) {
    event.preventDefault(); // Prevents the default form submit behavior (page reload)
    addTask();
}

// Handler for filter button clicks
function handleFilterChange(event) {
    // Remove 'active' class from all buttons
    filterBtns.forEach(btn => btn.classList.remove('active'));

    // Set the new filter and add 'active' class to the clicked button
    const newFilter = event.target.dataset.status; // Access data-status attribute
    currentFilter = newFilter;
    event.target.classList.add('active');

    renderTasks(); // Re-render the tasks with the new filter
}

// --- Core Task Functions ---

// Add new task
function addTask() {
    const text = taskInput.value.trim();
    
    // The 'required' attribute in HTML already handles the empty check, but a JS check is good fallback.
    if (text === '') {
        // Since we are using event.preventDefault(), we don't need an alert here.
        // The HTML5 validation pop-up will usually handle this.
        return; 
    }
    
    const task = {
        id: Date.now(), // Use Date.now() for unique ID
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    saveTasks();
    taskInput.value = ''; // Clear the input after adding
    renderTasks();
    updateStats();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks based on current filter
function renderTasks() {
    let filteredTasks = tasks;
    
    // Filter logic based on currentFilter ('all', 'active', 'completed')
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    taskList.innerHTML = ''; // Clear existing list items
    
    // Check if there are no tasks for the current filter
    if (filteredTasks.length === 0) {
        const message = document.createElement('p');
        message.className = 'no-tasks-message';
        message.textContent = `No ${currentFilter} tasks to show.`;
        taskList.appendChild(message);
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.taskId = task.id; // Add data attribute for easier DOM manipulation later

        li.innerHTML = `
            <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
            <label for="task-${task.id}" class="task-text">${task.text}</label>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        
        // Add event listener directly to the checkbox for better performance than inline JS
        const checkbox = li.querySelector(`#task-${task.id}`);
        checkbox.addEventListener('change', () => toggleTask(task.id));
        
        taskList.appendChild(li);
    });
}

// Toggle task completion
function toggleTask(id) {
    // Use map to create a new array, which is often safer than modifying objects in place
    tasks = tasks.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
    );

    saveTasks();
    renderTasks();
    updateStats();
}

// Delete task
function deleteTask(id) {
    // Show a confirmation dialog before deleting
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

// Update the task statistics in the footer
function updateStats() {
    const totalCount = tasks.length;
    const completedCount = tasks.filter(task => task.completed).length;

    // Update the DOM elements
    totalTasksSpan.textContent = totalCount;
    completedTasksSpan.textContent = completedCount;
}

// New Function: Clear all completed tasks
function clearCompletedTasks() {
    if (tasks.filter(t => t.completed).length === 0) {
        alert('There are no completed tasks to clear.');
        return;
    }

    if (!confirm('Are you sure you want to clear all completed tasks?')) {
        return;
    }
    
    // Filter out tasks that are NOT completed
    tasks = tasks.filter(t => !t.completed);
    
    saveTasks();
    renderTasks();
    updateStats();
}

// New Function: Edit task (initial structure)
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newText = prompt('Edit your task:', task.text);

    if (newText !== null && newText.trim() !== '' && newText.trim() !== task.text) {
        tasks = tasks.map(t => 
            t.id === id ? { ...t, text: newText.trim() } : t
        );
        saveTasks();
        renderTasks();
    }
}

// Run the initialization function when the script loads
init();