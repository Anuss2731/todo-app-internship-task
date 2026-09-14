# To-Do List API

A simple RESTful To-Do List API built with **Node.js** and **Express.js**.

This project was created as a take-home DevOps/Cloud internship challenge. The application provides basic task management functionality, runs with in-memory storage, can be containerized using Docker, and can be automatically built using GitHub Actions.

---

## Features

* Create a new task
* List all tasks
* Mark a task as completed
* Request validation
* In-memory task storage
* Simple frontend served by Express.js
* Docker support
* GitHub Actions workflow for Docker image builds

---

## Technology Used

* **Node.js** — JavaScript runtime used to run the backend application
* **Express.js** — Web framework used to create the HTTP server and REST API endpoints
* **JavaScript** — Programming language used to implement the application
* **Docker** — Used to containerize the application
* **GitHub Actions** — Used to automatically build the Docker image on every push
* **In-memory JavaScript array** — Used for task storage instead of a database

---

# Why Node.js?

Node.js allows JavaScript to run outside the browser and is commonly used for backend and API development.

In this project, Node.js is responsible for running the backend application.

The application starts with:

```bash
node server.js
```

Node.js runs the JavaScript code and starts the Express server on the configured port.

The port can be provided through the `PORT` environment variable:

```javascript
const PORT = process.env.PORT || 3000;
```

If `PORT` is not provided, the application uses port `3000`.

---

# Why Express.js?

Express.js is a lightweight web framework built on top of Node.js.

I used Express.js because it makes it simple to:

* Create an HTTP server
* Define API routes
* Handle HTTP requests
* Send HTTP responses
* Add middleware
* Serve static frontend files

Instead of handling HTTP requests manually with Node.js's lower-level HTTP APIs, Express provides a cleaner and simpler way to build REST APIs.

---

# How the Application Works

The basic flow of the application is:

```text
Client / Frontend
       |
       | HTTP Request
       v
Express.js Server
       |
       +----------------------+
       |                      |
       v                      v
API Routes              Static Frontend
       |
       +----------------------+
       |
       v
In-Memory Tasks Array
```

The backend is implemented using Node.js and Express.js.

Tasks are stored in a JavaScript array:

```javascript
let tasks = [];
```

Because this is in-memory storage, tasks are lost whenever the server is restarted.

A database was intentionally not used because the challenge allows in-memory storage.

---

# Express Middleware

The application uses the following middleware:

## JSON Middleware

```javascript
app.use(express.json());
```

`express.json()` parses incoming JSON request bodies.

For example, when a client sends:

```json
{
  "title": "Learn Docker"
}
```

the data becomes available through:

```javascript
req.body
```

This allows the POST endpoint to read the task title.

---

## Static File Middleware

The application also serves the frontend using:

```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

The `public` directory contains the frontend files such as:

```text
public/
├── index.html
├── style.css
└── app.js
```

This allows the same Express application to serve both the frontend and backend API.

---

# API Endpoints

The application provides three main API endpoints.

## 1. Create a Task

### Endpoint

```http
POST /tasks
```

### Request Body

```json
{
  "title": "Buy groceries"
}
```

### Example Response

```json
{
  "id": 1,
  "title": "Buy groceries",
  "done": false,
  "createdAt": "2026-09-14T08:00:00.000Z"
}
```

### What happens?

The API:

1. Receives the POST request.
2. Reads `title` from `req.body`.
3. Validates that the title exists and is a non-empty string.
4. Creates a new task object.
5. Assigns a unique ID.
6. Sets `done` to `false`.
7. Adds the task to the in-memory array.
8. Returns the created task with HTTP status `201 Created`.

---

## 2. List All Tasks

### Endpoint

```http
GET /tasks
```

### Example Response

```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "done": false,
    "createdAt": "2026-09-14T08:00:00.000Z"
  }
]
```

### What happens?

The API reads the current `tasks` array and returns it as JSON.

The default successful HTTP status is:

```text
200 OK
```

---

## 3. Mark a Task as Done

### Endpoint

```http
PATCH /tasks/:id/done
```

For example:

```http
PATCH /tasks/1/done
```

### What happens?

The API:

1. Gets the task ID from the URL.
2. Converts the ID from a string to a number.
3. Searches for the task in the in-memory array.
4. Returns `404 Not Found` if the task does not exist.
5. Changes the task's `done` property to `true`.
6. Returns the updated task.

Example:

Before:

```json
{
  "id": 1,
  "title": "Buy groceries",
  "done": false
}
```

After:

```json
{
  "id": 1,
  "title": "Buy groceries",
  "done": true
}
```

---

# API Testing Using cURL

The API can be tested from a terminal using `curl`.

## Create a Task

```bash
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy groceries"}'
```

This sends a `POST` request to create a new task.

---

## List Tasks

```bash
curl http://localhost:3000/tasks
```

This sends a `GET` request and returns all tasks.

---

## Mark Task as Done

```bash
curl -X PATCH http://localhost:3000/tasks/1/done
```

This sends a `PATCH` request and marks task `1` as completed.

---

### Why are these cURL commands included?

These commands are used for **API testing**.

They allow the API endpoints to be tested directly from the command line without requiring a frontend.

The same API could also be tested using tools such as Postman, Insomnia, or a frontend application.

The cURL examples demonstrate how a client sends HTTP requests to the Express.js API.

---

# HTTP Methods Used

This project uses three HTTP methods:

| Method | Endpoint          | Purpose                                |
| ------ | ----------------- | -------------------------------------- |
| POST   | `/tasks`          | Create a new task                      |
| GET    | `/tasks`          | Retrieve all tasks                     |
| PATCH  | `/tasks/:id/done` | Update a task and mark it as completed |

### POST

Used when creating a new resource.

```text
POST /tasks
```

### GET

Used when retrieving existing resources.

```text
GET /tasks
```

### PATCH

Used when partially modifying an existing resource.

```text
PATCH /tasks/1/done
```

---

# API Request Flow

For example, when creating a task:

```text
cURL / Frontend
       |
       | POST /tasks
       | JSON body
       v
Express.js
       |
       v
express.json()
       |
       v
POST /tasks route
       |
       v
Validate title
       |
       v
Create task object
       |
       v
tasks.push(task)
       |
       v
HTTP 201 Response
       |
       v
Client
```

---

# Validation

The API validates the task title before creating a task.

The title must:

* Exist
* Be a string
* Not be empty
* Not contain only whitespace

Invalid example:

```json
{
  "title": ""
}
```

The API returns:

```text
400 Bad Request
```

with an error message.

---

# Error Handling

The API handles common errors.

## Invalid task data

```text
400 Bad Request
```

Used when the task title is missing or invalid.

## Task not found

```text
404 Not Found
```

Used when trying to update a task that does not exist.

## Unknown route

```text
404 Not Found
```

Used when a request is made to an endpoint that is not defined.

---

# Project Structure

```text
todo-api/
│
├── server.js
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
├── README.md
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
└── .github/
    └── workflows/
        └── docker-build.yml
```

---

# Running the Application Locally

## 1. Install dependencies

```bash
npm install
```

## 2. Start the application

```bash
npm start
```

Or:

```bash
node server.js
```

The API will be available at:

```text
http://localhost:3000
```

---

# Testing the API

After starting the server, use the following commands.

### Create task

```bash
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy groceries"}'
```

### List tasks

```bash
curl http://localhost:3000/tasks
```

### Complete task

```bash
curl -X PATCH http://localhost:3000/tasks/1/done
```

---

# Docker

The application includes a Dockerfile so it can run inside a container.

The basic Docker workflow is:

```text
Source Code
     |
     v
Dockerfile
     |
     v
Docker Image
     |
     v
Docker Container
     |
     v
To-Do API
```

Build the image:

```bash
docker build -t todo-api .
```

Run the container:

```bash
docker run -p 3000:3000 todo-api
```

The application can then be accessed at:

```text
http://localhost:3000
```

---

# GitHub Actions

The project also contains a GitHub Actions workflow.

The workflow is triggered on every push to the repository.

The basic CI flow is:

```text
git push
    |
    v
GitHub Repository
    |
    v
GitHub Actions
    |
    v
Checkout Source Code
    |
    v
Build Docker Image
    |
    v
Build Successful / Failed
```

The purpose of this workflow is to make sure the Docker image can be built successfully whenever new code is pushed.

The workflow does not deploy the application.

---

# Reflection

## What was the trickiest part?

The trickiest part was making sure the API worked correctly with validation, dynamic task IDs, and Docker. I also wanted to keep the implementation simple because the challenge specifically allowed in-memory storage.

## Why did I choose Node.js and Express.js?

I chose Node.js because it provides a simple and efficient environment for building backend applications using JavaScript.

I chose Express.js because it provides a lightweight and straightforward way to create HTTP servers, define REST API routes, handle requests and responses, add middleware, and serve static frontend files.

For a small API like this, Express.js keeps the implementation simple without introducing unnecessary complexity.

## Why did I use in-memory storage?

The challenge explicitly states that a real database is not required and that in-memory storage is acceptable.

Therefore, I used a JavaScript array to store tasks:

```javascript
let tasks = [];
```

This keeps the application simple and focused on the API, Docker, and CI requirements.

The trade-off is that data is lost whenever the application restarts.

## What would I improve with another day?

With another day, I would consider:

* Adding automated API tests
* Adding persistent database storage
* Improving request validation
* Adding DELETE and update functionality
* Improving error handling
* Adding API documentation
* Improving the frontend
* Adding more comprehensive GitHub Actions checks
* Adding security and dependency scanning to the CI pipeline

---

# Summary

This project demonstrates a simple backend API using Node.js and Express.js together with basic DevOps practices.

The main workflow is:

```text
Node.js
   ↓
Express.js
   ↓
REST API
   ↓
Docker
   ↓
GitHub
   ↓
GitHub Actions
   ↓
Automated Docker Build
```

The application provides three core API operations:

```text
POST   /tasks
GET    /tasks
PATCH  /tasks/:id/done
```

The API can be tested directly using cURL commands or through the included frontend.

# API Testing Commands

The following `curl` commands can be used to test the API directly from the terminal.

### 1. Create a Task

```bash
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy groceries"}'
```

### 2. Get All Tasks

```bash
curl http://localhost:3000/tasks
```

### 3. Mark Task as Done

```bash
curl -X PATCH http://localhost:3000/tasks/1/done
```

These `curl` commands are used for **API testing**. They allow the API endpoints to be tested directly from the command line without using the frontend.

The same API endpoints can also be tested using tools such as Postman or Insomnia.

---

# Frontend

The frontend is served by the same Express.js application.

You can access the To-Do List frontend at:

**http://localhost:3000**

Open this URL in your browser after starting the application.




# Node.js Docker Application

This project is a Node.js application running inside a Docker container.

The Dockerfile uses a **multi-stage build** to create a smaller and cleaner production image.

---

## Dockerfile

```dockerfile
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

FROM node:20-alpine AS runner

WORKDIR /app

RUN addgroup -S nodegrp && adduser -S nodeusr -G nodegrp

COPY --from=deps /app/node_modules ./node_modules

COPY package.json ./

COPY server.js ./

COPY public ./public

USER nodeusr

EXPOSE 3000

CMD ["node", "server.js"]
```

---

# Dockerfile Explanation

## 1. Dependencies Stage

```dockerfile
FROM node:20-alpine AS deps
```

This starts the first stage using the **Node.js 20 Alpine Linux image**.

`Alpine` is a lightweight Linux distribution, so the final Docker image can be smaller.

`AS deps` gives this stage the name `deps`.

---

## 2. Set Working Directory

```dockerfile
WORKDIR /app
```

This creates and sets `/app` as the working directory inside the container.

All following commands will work from:

```text
/app
```

---

## 3. Copy Package Files

```dockerfile
COPY package.json package-lock.json ./
```

This copies:

* `package.json`
* `package-lock.json`

from the local project into `/app` inside the container.

These files contain the application's dependency information.

---

## 4. Install Production Dependencies

```dockerfile
RUN npm ci --omit=dev
```

This installs the dependencies required by the application.

`npm ci` is mainly used for clean and reproducible installations.

```text
--omit=dev
```

means development dependencies are not installed.

For example, packages such as testing or development tools will not be included in the production image.

This helps keep the image smaller.

---

# Runner Stage

```dockerfile
FROM node:20-alpine AS runner
```

This starts a new stage.

The first `deps` stage was mainly used to install dependencies.

The `runner` stage is the actual image that will run the application.

This is called a:

**Multi-stage Docker build**

**How to Run the Project**

Make sure Docker Desktop is running, then open PowerShell in the project directory.

Step 1 — Build the image
docker build -t todo-api .
Step 2 — Run the container
docker run -d -p 3000:3000 --name todo-api-container todo-api:latest
Step 3 — Open the application

Open this URL in your browser:

http://localhost:3000

That's it — the Todo API is now running inside a Docker container.