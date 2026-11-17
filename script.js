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