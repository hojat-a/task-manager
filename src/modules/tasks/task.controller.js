const taskService = require('./task.service');
const ApiResponse = require('../../common/utils/response');
const asyncHandler = require('../../common/utils/async-handler');

exports.getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getAllTasks(req.user.id);
  return ApiResponse.success({ tasks, count: tasks.length }, 'Tasks retrieved successfully').send(res);
});

exports.createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user.id);
  return ApiResponse.success(task, 'Task created successfully', 201).send(res);
});

exports.getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user.id);
  return ApiResponse.success(task, 'Task retrieved successfully').send(res);
});

exports.updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body, req.user.id);
  return ApiResponse.success(task, 'Task updated successfully').send(res);
});

exports.deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user.id);
  return ApiResponse.success(null, 'Task deleted successfully').send(res);
});