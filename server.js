const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory storage — resets every time the server restarts.
let tasks = [];
let nextId = 1;

// Simple root route so hitting "/" doesn't 404
app.get('/', (req, res) => {
  res.json({
    message: 'To-Do List API is running',
    endpoints: {
      'GET /tasks': 'List all tasks',
      'POST /tasks': 'Add a new task (body: { "title": "string" })',
      'PATCH /tasks/:id/done': 'Mark a task as done',
    },
  });
});

// 1. Add a task
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Task "title" is required and must be a non-empty string.' });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json(task);
});

// 2. List all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// 3. Mark a task as done
app.patch('/tasks/:id/done', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `No task found with id ${id}.` });
  }

  task.done = true;
  res.json(task);
});

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.listen(PORT, () => {
  console.log(`To-Do List API listening on http://localhost:${PORT}`);
});