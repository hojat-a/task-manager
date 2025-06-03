# Task Manager API

A full-featured task management system with RESTful API, authentication, and a simple web interface.

---

## Technologies and Libraries

### Backend

- **Node.js** - JavaScript runtime  
- **Express.js** - Web framework  
- **MongoDB** - NoSQL database  
- **Mongoose** - MongoDB object modeling  
- **JWT** - JSON Web Token for authentication  
- **Bcrypt.js** - Password hashing  
- **Joi** - Data validation  
- **Jest** - Testing framework  
- **Supertest** - HTTP assertions for testing  

### Frontend

- **HTML5** - Structure  
- **CSS3** - Styling  
- **JavaScript** - Client-side logic  
- **Bootstrap 5** - CSS framework  
- **Bootstrap Icons** - Icon library  

---

## Features

- User authentication (signup/login) with JWT  
- Create, read, update, delete tasks  
- Task status management (pending, in-progress, done)  
- Input validation  
- Error handling  
- Responsive design  
- RESTful API  
- Kanban-style task board  

---

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user  
- `POST /api/auth/login` - Login and get JWT token  

### Tasks

- `GET /api/tasks` - Get all tasks for authenticated user  
- `POST /api/tasks` - Create a new task  
- `GET /api/tasks/:id` - Get a specific task by ID  
- `PUT /api/tasks/:id` - Update a specific task  
- `DELETE /api/tasks/:id` - Delete a specific task  

---

## Installation and Setup

### Prerequisites

- Node.js (v14+)
- Docker and Docker Compose (for MongoDB)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/hojat-a/task-manager.git
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**  
   Create a `.env` file in the root directory with the following content:
   ```env
   PORT=5000
   MONGO_URI=mongodb://root:password@localhost:27018/task-manager?authSource=admin
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

4. **Start MongoDB with Docker**
   ```bash
   docker-compose up -d mongodb
   ```
   This will start MongoDB on port `27018`.

5. **Start the application**

   - For development:
     ```bash
     npm run dev
     ```

   - For production:
     ```bash
     npm start
     ```

6. **Access the application**

   - Web interface: [http://localhost:5000](http://localhost:5000)
   - API: [http://localhost:5000/api](http://localhost:5000/api)

---

## Testing

- Run all tests using Jest:
  ```bash
  npm test
  ```

- Run specific test files:
  ```bash
  npm test -- test/auth/auth.test.js
  npm test -- test/tasks/task.test.js
  ```

---

## Using the API with Postman

1. Import the provided Postman collection:  
   `Task_Manager_API.postman_collection.json`

2. Import the environment file:  
   `Task_Manager_Environment.postman_environment.json`

3. Use the collection to test all API endpoints.

---

## Docker Support

To run the entire application (including the Node.js app) with Docker:

1. Uncomment the `app` service in `docker-compose.yml`
2. Run:
   ```bash
   docker-compose up -d
   ```

---

## Project Development

The project follows a modular architecture inspired by NestJS, with:

- Service-Controller pattern  
- Middleware for authentication and validation  
- DTO (Data Transfer Object) validation  
- Repository pattern for data access  
- Error handling middleware  
- Testing for all endpoints  

---

## License

MIT