const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/database.config');
const errorMiddleware = require('./middleware/error.middleware');

// Import modules
const authModule = require('./modules/auth/auth.module');
const taskModule = require('./modules/tasks/task.module');

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Connect to database (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Body parser
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Mount API routes
app.use('/api/auth', authModule.routes);
app.use('/api/tasks', taskModule.routes);

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handler middleware (should be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;