const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data storage
let tasks = [];
let nextId = 1;

// Load initial data from task.json
const loadInitialData = () => {
  try {
    const dataPath = path.join(__dirname, 'task.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    const jsonData = JSON.parse(data);
    tasks = jsonData.tasks || [];
    // Set nextId to be one more than the highest existing ID
    nextId = Math.max(...tasks.map(task => task.id), 0) + 1;
  } catch (error) {
    console.error('Error loading initial data:', error);
    tasks = [];
    nextId = 1;
  }
};

// Initialize data
loadInitialData();

// Validation helper functions
const validateTask = (task) => {
  const errors = [];
  
  if (!task.title || typeof task.title !== 'string' || task.title.trim() === '') {
    errors.push('Title is required and must be a non-empty string');
  }
  
  if (!task.description || typeof task.description !== 'string' || task.description.trim() === '') {
    errors.push('Description is required and must be a non-empty string');
  }
  
  if (task.completed !== undefined && typeof task.completed !== 'boolean') {
    errors.push('Completed must be a boolean value');
  }
  
  return errors;
};

const validateId = (id) => {
  const numId = parseInt(id);
  return !isNaN(numId) && numId > 0;
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
};

// Routes

// GET /tasks - Get all tasks
app.get('/tasks', (req, res) => {
  try {
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});

// GET /tasks/:id - Get a specific task
app.get('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!validateId(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const taskId = parseInt(id);
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve task' });
  }
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  try {
    const { title, description, completed = false } = req.body;
    
    // Validate required fields
    const validationErrors = validateTask({ title, description, completed });
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }
    
    // Create new task
    const newTask = {
      id: nextId++,
      title: title.trim(),
      description: description.trim(),
      completed: Boolean(completed)
    };
    
    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /tasks/:id - Update a specific task
app.put('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    if (!validateId(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const taskId = parseInt(id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Validate the update data
    const updateData = { title, description, completed };
    const validationErrors = validateTask(updateData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }
    
    // Update the task
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title.trim(),
      description: description.trim(),
      completed: Boolean(completed)
    };
    
    res.status(200).json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /tasks/:id - Delete a specific task
app.delete('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!validateId(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const taskId = parseInt(id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Remove the task
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.status(200).json(deletedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Task Manager API is running',
    totalTasks: tasks.length
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on port ${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`API endpoints:`);
    console.log(`  GET    /tasks     - Get all tasks`);
    console.log(`  GET    /tasks/:id - Get specific task`);
    console.log(`  POST   /tasks     - Create new task`);
    console.log(`  PUT    /tasks/:id - Update task`);
    console.log(`  DELETE /tasks/:id - Delete task`);
});

module.exports = app;