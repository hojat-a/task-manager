const Task = require('./task.model');
const HttpException = require('../../common/exceptions/http.exception');

class TaskService {
  async getAllTasks(userId) {
    return await Task.find({ user: userId });
  }
  
  async createTask(taskData, userId) {
    taskData.user = userId;
    return await Task.create(taskData);
  }
  
  async getTaskById(taskId, userId) {
    const task = await Task.findById(taskId);
    
    if (!task) {
      throw new HttpException('Task not found', 404);
    }
    
    // Check ownership
    if (task.user.toString() !== userId) {
      throw new HttpException('Not authorized to access this task', 401);
    }
    
    return task;
  }
  
  async updateTask(taskId, taskData, userId) {
    let task = await this.getTaskById(taskId, userId);
    
    task = await Task.findByIdAndUpdate(taskId, taskData, {
      new: true,
      runValidators: true
    });
    
    return task;
  }
  
  async deleteTask(taskId, userId) {
    const task = await this.getTaskById(taskId, userId);
    await Task.findByIdAndDelete(taskId);
    return true;
  }
}

module.exports = new TaskService();