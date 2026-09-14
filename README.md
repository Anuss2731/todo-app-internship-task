# To-Do List API

A simple to-do list REST API built with Node.js and Express, with a minimal
frontend to interact with it. Task data is stored in memory (no database) —
data resets whenever the server restarts.

## Tech stack

- **Backend:** Node.js, Express
- **Frontend:** Plain HTML/CSS/JS, served as static files by the same Express app
- **Containerization:** Docker (multi-stage build)
- **CI:** GitHub Actions (builds the Docker image on every push)

## Running it locally (without Docker)

Requires [Node.js](https://nodejs.org/) 20 or later.

```bash
npm install
npm start
```

The server starts on **http://localhost:3000**. Open that URL in a browser
for the to-do list UI, or hit the API directly (see below).

## Running it with Docker

```bash
docker build -t todo-api .
docker run -p 3000:3000 todo-api
```

Then open **http://localhost:3000** the same as above.

The Dockerfile uses a multi-stage build: a `deps` stage installs production
dependencies, and a separate `runner` stage copies only the built
`node_modules` and app files into a fresh image, running as a non-root user.

## API Endpoints

All endpoints are relative to `http://localhost:3000`.

### `GET /tasks`

Lists all tasks.

**Response `200`**
```json
[
  { "id": 1, "title": "Buy groceries", "done": false, "createdAt": "2026-09-14T08:02:19.360Z" }
]
```

### `POST /tasks`

Adds a new task.

**Request body**
```json
{ "title": "Buy groceries" }
```

**Response `201`** — the created task.
```json
{ "id": 1, "title": "Buy groceries", "done": false, "createdAt": "2026-09-14T08:02:19.360Z" }
```

**Response `400`** — if `title` is missing or empty.
```json
{ "error": "Task \"title\" is required and must be a non-empty string." }
```

### `PATCH /tasks/:id/done`

Marks a task as done. `:id` is the numeric task id.

**Response `200`** — the updated task.
```json
{ "id": 1, "title": "Buy groceries", "done": true, "createdAt": "2026-09-14T08:02:19.360Z" }
```

**Response `404`** — if no task with that id exists.
```json
{ "error": "No task found with id 1." }
```

## Project structure

```
todo-api/
├── .github/workflows/docker-build.yml   # CI: builds the Docker image on every push
├── public/                              # Frontend (served statically by Express)
│   ├── index.html
│   ├── style.css
│   └── app.js
├── server.js                            # Express app + all routes
├── package.json
├── Dockerfile                           # Multi-stage build
└── .gitignore
```

## Reflection

**What was the trickiest part of this for you?**

_(Your answer here.)_

**Why did you make the choices you did?**

_(Your answer here — e.g. why in-memory storage, why this project structure,
why a plain HTML/JS frontend instead of a framework, why multi-stage Docker,
etc.)_

**If you had another day, what would you improve or do differently?**

_(Your answer here.)_