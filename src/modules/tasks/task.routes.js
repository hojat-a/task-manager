const express = require('express');
const { getAllTasks, createTask, getTaskById, updateTask, deleteTask } = require('./task.controller');
const { protect } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validation.middleware');
const createTaskDto = require('./dto/create-task.dto');
const updateTaskDto = require('./dto/update-task.dto');

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getAllTasks)
  .post(validate(createTaskDto), createTask);

router
  .route('/:id')
  .get(getTaskById)
  .put(validate(updateTaskDto), updateTask)
  .delete(deleteTask);

module.exports = router;