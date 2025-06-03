const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../../src/app');
const User = require('../../src/modules/users/user.model');
const Task = require('../../src/modules/tasks/task.model');
const authService = require('../../src/modules/auth/auth.service');

// Test database connection string
const TEST_MONGO_URI = 'mongodb://root:password@localhost:27018/task-manager-test?authSource=admin';

let token;
let userId;
let taskId;

// Connect to test database
beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret';
  process.env.JWT_EXPIRE = '1h';
  await mongoose.connect(TEST_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create a test user
  const user = await User.create({
    name: 'Task Test User',
    email: 'tasktest@example.com',
    password: await bcrypt.hash('password123', 10)
  });
  
  userId = user._id;
  
  // Generate token
  token = authService.generateAuthToken(userId);
});

// Clear tasks after each test
afterEach(async () => {
  await Task.deleteMany({});
});

// Disconnect and cleanup after all tests
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Tasks Endpoints', () => {
  describe('GET /api/tasks', () => {
    it('should get all tasks for a user', async () => {
      // Create some test tasks
      await Task.create([
        {
          title: 'Test Task 1',
          description: 'Test Description 1',
          status: 'pending',
          user: userId
        },
        {
          title: 'Test Task 2',
          description: 'Test Description 2',
          status: 'in-progress',
          user: userId
        }
      ]);

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.tasks).toHaveLength(2);
      expect(res.body.data.tasks[0]).toHaveProperty('title', 'Test Task 1');
      expect(res.body.data.tasks[1]).toHaveProperty('title', 'Test Task 2');
    });

    it('should require authentication', async () => {
      const res = await request(app).get('/api/tasks');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Task',
          description: 'New Task Description',
          status: 'pending'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'New Task');
      expect(res.body.data).toHaveProperty('user', userId.toString());
      
      // Save task ID for update and delete tests
      taskId = res.body.data._id;
    });

    it('should validate input data', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'AB', // too short
          status: 'invalid-status' // invalid status
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/tasks/:id', () => {
    beforeEach(async () => {
      // Create a test task
      const task = await Task.create({
        title: 'Get Single Task',
        description: 'Get Single Task Description',
        status: 'pending',
        user: userId
      });
      
      taskId = task._id;
    });

    it('should get a task by id', async () => {
      const res = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'Get Single Task');
      expect(res.body.data).toHaveProperty('description', 'Get Single Task Description');
    });

    it('should not get a non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should not allow access to another user\'s task', async () => {
      // Create another user
      const anotherUser = await User.create({
        name: 'Another User',
        email: 'another@example.com',
        password: await bcrypt.hash('password123', 10)
      });
      
      // Create a task for the new user
      const anotherTask = await Task.create({
        title: 'Another User Task',
        description: 'Another User Task Description',
        status: 'pending',
        user: anotherUser._id
      });
      
      const res = await request(app)
        .get(`/api/tasks/${anotherTask._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Not authorized');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    beforeEach(async () => {
      // Create a test task
      const task = await Task.create({
        title: 'Update Test Task',
        description: 'Update Test Description',
        status: 'pending',
        user: userId
      });
      
      taskId = task._id;
    });

    it('should update a task', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Task',
          status: 'in-progress'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'Updated Task');
      expect(res.body.data).toHaveProperty('status', 'in-progress');
      expect(res.body.data).toHaveProperty('description', 'Update Test Description'); // unchanged
    });

    it('should validate input data', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'invalid-status'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('errors');
    });

    it('should not update a non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Task'
        });
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should not allow updating another user\'s task', async () => {
      // Create another user
      const anotherUser = await User.create({
        name: 'Another User',
        email: 'another1@example.com',
        password: await bcrypt.hash('password123', 10)
      });
      
      // Create a task for the new user
      const anotherTask = await Task.create({
        title: 'Another User Task',
        description: 'Another User Task Description',
        status: 'pending',
        user: anotherUser._id
      });
      
      const res = await request(app)
        .put(`/api/tasks/${anotherTask._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Trying to Update'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Not authorized');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    beforeEach(async () => {
      // Create a test task
      const task = await Task.create({
        title: 'Delete Test Task',
        description: 'Delete Test Description',
        status: 'pending',
        user: userId
      });
      
      taskId = task._id;
    });

    it('should delete a task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      
      // Verify task is deleted
      const task = await Task.findById(taskId);
      expect(task).toBeNull();
    });

    it('should not delete a non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should not allow deleting another user\'s task', async () => {
      // Create another user
      const anotherUser = await User.create({
        name: 'Another User',
        email: 'another2@example.com',
        password: await bcrypt.hash('password123', 10)
      });
      
      // Create a task for the new user
      const anotherTask = await Task.create({
        title: 'Another User Task',
        description: 'Another User Task Description',
        status: 'pending',
        user: anotherUser._id
      });
      
      const res = await request(app)
        .delete(`/api/tasks/${anotherTask._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Not authorized to access this task');
      
      // Verify task is not deleted
      const task = await Task.findById(anotherTask._id);
      expect(task).not.toBeNull();
    });
  });
});