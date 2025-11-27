// Task Manager Application
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize app
function init() {
    renderTasks();
    updateStats();
}

// Add new task
function addTask() { // Remvoved debugger that was freezing the site repeatedly
    const text = taskInput.value.trim();
    const category = document.getElementById("categoryInput").value.trim();

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        category: category || "General",
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    taskInput.value = '';
    renderTasks();
    updateStats();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks based on current filter
//Editted the Render task function.
function renderTasks(list = tasks) {
    let finalList = list;

    // Apply Active/Completed Filters
    if (currentFilter === 'active') {
        finalList = finalList.filter(task => !task.completed);
    } 
    else if (currentFilter === 'completed') {
        finalList = finalList.filter(task => task.completed);
    }

    taskList.innerHTML = '';

    finalList.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">

            <span class="${task.completed ? 'completed' : ''}">
                ${task.text}  <small style="opacity:0.7">( ${task.category} )</small>
            </span>

            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;

        taskList.appendChild(li);
    });
}


//Added functionality to the dummy buttons like Active, Completed, etc..
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {

        // Getting filter type (all, active, completed)
        currentFilter = btn.dataset.filter;

        // Removing active highlight from old button
        filterBtns.forEach(b => b.classList.remove('active'));

        // Adding highlight to clicked button
        btn.classList.add('active');

        renderTasks();
    });
});


// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    updateStats();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}