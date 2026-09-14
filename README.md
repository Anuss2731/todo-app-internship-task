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

The trickiest part was getting the application running correctly inside Docker and making sure the API was accessible through the expected port. I also had to understand how the Docker container, Node.js application, and port mapping work together. Setting up the GitHub Actions workflow was another useful challenge because I had to make sure the Docker image could be built automatically on every push.

**Why did you make the choices you did?**

I used Node.js with Express because it is lightweight and well suited for building a simple REST API. I used in-memory storage because the task did not require a database, and it keeps the project simple and focused on the API and DevOps requirements.

I used Docker so the application can run in a consistent environment without requiring Node.js to be installed directly on the host machine. I also used GitHub Actions to automatically build the Docker image whenever changes are pushed to the repository.

For the project structure, I kept it simple because the application only has a few endpoints. I wanted the code to be easy to understand and maintain rather than adding unnecessary complexity.

**If you had another day, what would you improve or do differently?**
If I had another day, I would add automated API tests and include them in the GitHub Actions workflow before building the Docker image. I would also add a proper database such as PostgreSQL or MongoDB instead of in-memory storage.

I would improve the CI/CD pipeline by adding Docker image tagging and pushing the image to GitHub Container Registry. I would also add better error handling, API validation, health checks, and possibly deploy the application to an Azure service.