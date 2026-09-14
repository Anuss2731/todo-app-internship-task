const API_BASE = '/tasks';

const form = document.getElementById('add-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const emptyMsg = document.getElementById('empty');
const errorMsg = document.getElementById('error');
const countLabel = document.getElementById('count');

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.hidden = false;
}

function clearError() {
  errorMsg.hidden = true;
  errorMsg.textContent = '';
}

function updateCount(tasks) {
  const remaining = tasks.filter((t) => !t.done).length;
  countLabel.textContent = `${remaining} of ${tasks.length} left`;
}

function renderTasks(tasks) {
  list.innerHTML = '';
  emptyMsg.hidden = tasks.length !== 0;
  updateCount(tasks);

  for (const task of tasks) {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' task--done' : '');

    const box = document.createElement('button');
    box.type = 'button';
    box.className = 'task__box';
    box.setAttribute('aria-label', task.done ? 'Mark as not done' : 'Mark as done');
    box.disabled = task.done; // API only supports marking done, not undoing
    box.addEventListener('click', () => markDone(task.id));

    const title = document.createElement('span');
    title.className = 'task__title';
    title.textContent = task.title;

    li.append(box, title);
    list.append(li);
  }
}

async function loadTasks() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to load tasks');
    const tasks = await res.json();
    renderTasks(tasks);
  } catch (err) {
    showError('Could not load tasks. Is the server running?');
  }
}

async function addTask(title) {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to add task');
    }
    clearError();
    await loadTasks();
  } catch (err) {
    showError(err.message);
  }
}

async function markDone(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}/done`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to update task');
    clearError();
    await loadTasks();
  } catch (err) {
    showError(err.message);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  addTask(title);
  input.value = '';
});

loadTasks();