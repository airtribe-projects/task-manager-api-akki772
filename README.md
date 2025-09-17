# Task Manager API

A RESTful API for managing tasks built with Node.js and Express.js. This API provides full CRUD operations for task management with comprehensive error handling and input validation.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete tasks
- **Input Validation**: Comprehensive validation for all task fields
- **Error Handling**: Proper HTTP status codes and error messages
- **In-Memory Storage**: Data persists during server runtime
- **Health Check**: Built-in health monitoring endpoint
- **RESTful Design**: Follows REST conventions

## Prerequisites

- Node.js (version 18 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Start the server:
```bash
node app.js
```

The server will start on port 3000. You'll see output like:
```
Server is listening on port 3000
Health check: http://localhost:3000/health
API endpoints:
  GET    /tasks     - Get all tasks
  GET    /tasks/:id - Get specific task
  POST   /tasks     - Create new task
  PUT    /tasks/:id - Update task
  DELETE /tasks/:id - Delete task
```

## API Endpoints

### Health Check
- **GET** `/health` - Check API status and get basic information

### Tasks

#### Get All Tasks
- **GET** `/tasks`
- **Response**: Array of all tasks
- **Status Codes**: 200 (Success), 500 (Server Error)

#### Get Specific Task
- **GET** `/tasks/:id`
- **Parameters**: `id` (integer) - Task ID
- **Response**: Task object
- **Status Codes**: 200 (Success), 400 (Invalid ID), 404 (Not Found), 500 (Server Error)

#### Create New Task
- **POST** `/tasks`
- **Body**: JSON object with task details
  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "completed": false
  }
  ```
- **Response**: Created task object with assigned ID
- **Status Codes**: 201 (Created), 400 (Validation Error), 500 (Server Error)

#### Update Task
- **PUT** `/tasks/:id`
- **Parameters**: `id` (integer) - Task ID
- **Body**: JSON object with updated task details
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description",
    "completed": true
  }
  ```
- **Response**: Updated task object
- **Status Codes**: 200 (Success), 400 (Validation Error), 404 (Not Found), 500 (Server Error)

#### Delete Task
- **DELETE** `/tasks/:id`
- **Parameters**: `id` (integer) - Task ID
- **Response**: Deleted task object
- **Status Codes**: 200 (Success), 400 (Invalid ID), 404 (Not Found), 500 (Server Error)

## Data Model

Each task has the following structure:

```json
{
  "id": 1,
  "title": "Task Title",
  "description": "Task Description",
  "completed": false
}
```

### Field Descriptions

- **id**: Unique identifier (auto-generated integer)
- **title**: Task title (required, non-empty string)
- **description**: Task description (required, non-empty string)
- **completed**: Completion status (boolean, defaults to false)

## Validation Rules

- **title**: Required, must be a non-empty string
- **description**: Required, must be a non-empty string
- **completed**: Optional, must be a boolean value
- **id**: Must be a positive integer for GET, PUT, DELETE operations

## Error Responses

All error responses follow this format:
```json
{
  "error": "Error message",
  "details": ["Additional validation details"] // Only for validation errors
}
```

### Common Error Scenarios

- **400 Bad Request**: Invalid input data or malformed request
- **404 Not Found**: Task with specified ID doesn't exist
- **500 Internal Server Error**: Server-side error

## Testing

Run the test suite:
```bash
npm test
```

The test suite includes:
- All CRUD operations
- Input validation
- Error handling
- Edge cases

## Example Usage

### Using curl

```bash
# Get all tasks
curl http://localhost:3000/tasks

# Get specific task
curl http://localhost:3000/tasks/1

# Create new task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task description","completed":false}'

# Update task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Task","description":"Updated description","completed":true}'

# Delete task
curl -X DELETE http://localhost:3000/tasks/1
```

### Using PowerShell (Windows)

```powershell
# Get all tasks
Invoke-WebRequest -Uri http://localhost:3000/tasks -Method GET

# Create new task
Invoke-WebRequest -Uri http://localhost:3000/tasks -Method POST -Body '{"title":"New Task","description":"Task description","completed":false}' -ContentType "application/json"
```

## Project Structure

```
task-manager-api/
├── app.js              # Main application file
├── package.json        # Project dependencies and scripts
├── task.json          # Initial data file
├── test/
│   └── server.test.js  # Test suite
└── README.md          # This file
```

## Development Notes

- The API uses in-memory storage, so data is lost when the server restarts
- Initial data is loaded from `task.json` on startup
- All routes include comprehensive error handling
- Input validation ensures data integrity
- The API follows RESTful conventions

## License

ISC License
