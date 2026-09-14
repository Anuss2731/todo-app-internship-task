const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve the frontend (public/index.html, style.css, app.js) at "/"
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage — resets every time the server restarts.
let tasks = [];
let nextId = 1;

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