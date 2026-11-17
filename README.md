# Ex03 To-Do List using JavaScript
## Date:

## AIM
To create a To-do Application with all features using JavaScript.

## ALGORITHM
### STEP 1
Build the HTML structure (index.html).

### STEP 2
Style the App (style.css).

### STEP 3
Plan the features the To-Do App should have.

### STEP 4
Create a To-do application using Javascript.

### STEP 5
Add functionalities.

### STEP 6
Test the App.

### STEP 7
Open the HTML file in a browser to check layout and functionality.

### STEP 8
Fix styling issues and refine content placement.

### STEP 9
Deploy the website.

### STEP 10
Upload to GitHub Pages for free hosting.

### PROGRAM
## Index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Todo App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="container">
        <h1>My Tasks</h1>
        
        <form class="input-group" id="todo-form">
            <input type="text" id="todo-input" placeholder="What needs to be done?" autocomplete="off" required>
            <button type="submit" class="add-btn">Add</button>
        </form>

        <div class="filters">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="active">Active</button>
            <button class="filter-btn" data-filter="completed">Completed</button>
        </div>

        <ul id="todo-list"></ul>

        <div class="footer">
            <span id="task-count">0 items left</span>
            <button class="filter-btn" id="clear-completed" style="padding: 0;">Clear completed</button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```
## style.css
```
:root {
    --primary: #6366f1;
    --primary-hover: #4f46e5;
    --bg: #f8fafc;
    --card-bg: #ffffff;
    --text: #1e293b;
    --text-light: #64748b;
    --border: #e2e8f0;
    --danger: #ef4444;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

body {
    background-color: var(--bg);
    color: var(--text);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
}

.container {
    background: var(--card-bg);
    width: 100%;
    max-width: 480px;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}

h1 {
    font-size: 1.75rem;
    margin-bottom: 24px;
    font-weight: 700;
    color: var(--text);
}

.input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
}

input[type="text"] {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
}

input[type="text"]:focus {
    border-color: var(--primary);
}

button.add-btn {
    background-color: var(--primary);
    color: white;
    border: none;
    padding: 0 20px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

button.add-btn:hover {
    background-color: var(--primary-hover);
}

.filters {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
}

.filter-btn {
    background: transparent;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.875rem;
    color: var(--text-light);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
}

.filter-btn.active {
    background: var(--border);
    color: var(--text);
}

ul {
    list-style: none;
    max-height: 300px;
    overflow-y: auto;
}

li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    border-bottom: 1px solid var(--border);
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}

li:last-child {
    border-bottom: none;
}

.task-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    cursor: pointer;
}

input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--primary);
    cursor: pointer;
}

span.text {
    word-break: break-word;
    transition: color 0.2s, text-decoration 0.2s;
}

li.completed span.text {
    text-decoration: line-through;
    color: var(--text-light);
}

.delete-btn {
    background: none;
    border: none;
    color: var(--text-light);
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 1rem;
    transition: color 0.2s, background 0.2s;
}

.delete-btn:hover {
    color: var(--danger);
    background: rgba(239, 68, 68, 0.1);
}

.empty-state {
    text-align: center;
    color: var(--text-light);
    padding: 30px 0;
    font-size: 0.95rem;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    font-size: 0.875rem;
    color: var(--text-light);
}
```
## Script.js
```
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');
const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
const clearCompletedBtn = document.getElementById('clear-completed');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(todos));
    render();
}

function addTodo(e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    todos.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    input.value = '';
    saveAndRender();
}

function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveAndRender();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveAndRender();
}

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveAndRender();
}

function render() {
    list.innerHTML = '';

    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    if (filteredTodos.length === 0) {
        list.innerHTML = `<li class="empty-state">No tasks found</li>`;
    } else {
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            if (todo.completed) li.classList.add('completed');

            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="text">${escapeHtml(todo.text)}</span>
                </div>
                <button class="delete-btn">&times;</button>
            `;

            // Event listeners for item actions
            li.querySelector('input').addEventListener('click', () => toggleTodo(todo.id));
            li.querySelector('.task-content').addEventListener('click', (e) => {
                if(e.target.tagName !== 'INPUT') toggleTodo(todo.id);
            });
            li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id));

            list.appendChild(li);
        });
    }

    const activeCount = todos.filter(todo => !todo.completed).length;
    taskCount.textContent = `${activeCount} item${activeCount === 1 ? '' : 's'} left`;
}

function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Event listeners
form.addEventListener('submit', addTodo);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
    });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// Initial render
render();
```



## OUTPUT
<img width="1917" height="967" alt="Screenshot 2026-11-17 054854" src="https://github.com/user-attachments/assets/d9f69c21-7486-4aac-869e-5940224d342d" />




## RESULT
The program for creating To-do list using JavaScript is executed successfully.
