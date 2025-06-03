document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Get user info and update UI
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('user-name').textContent = `Welcome, ${user.name}`;

    // Handle logout
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    // Initialize Bootstrap modal
    const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
    
    // Load all tasks
    loadTasks();

    // Handle task form submission
    const taskForm = document.getElementById('task-form');
    taskForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const status = document.getElementById('task-status').value;
        
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, status })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create task');
            }
            
            // Clear form and reload tasks
            taskForm.reset();
            loadTasks();
            
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });

    // Handle task update
    document.getElementById('update-task-btn').addEventListener('click', async function() {
        const taskId = document.getElementById('edit-task-id').value;
        const title = document.getElementById('edit-task-title').value;
        const description = document.getElementById('edit-task-description').value;
        const status = document.getElementById('edit-task-status').value;
        
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, status })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update task');
            }
            
            // Close modal and reload tasks
            editTaskModal.hide();
            loadTasks();
            
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });

    // Function to load all tasks
    async function loadTasks() {
        try {
            const response = await fetch('/api/tasks', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to load tasks');
            }
            
            // Clear task containers
            document.getElementById('pending-tasks').innerHTML = '';
            document.getElementById('in-progress-tasks').innerHTML = '';
            document.getElementById('done-tasks').innerHTML = '';
            
            // Populate task containers
            data.data.tasks.forEach(task => {
                const taskCard = createTaskCard(task);
                
                if (task.status === 'pending') {
                    document.getElementById('pending-tasks').appendChild(taskCard);
                } else if (task.status === 'in-progress') {
                    document.getElementById('in-progress-tasks').appendChild(taskCard);
                } else if (task.status === 'done') {
                    document.getElementById('done-tasks').appendChild(taskCard);
                }
            });
            
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    // Function to create a task card
    function createTaskCard(task) {
        const card = document.createElement('div');
        card.className = `card task-card ${task.status}`;
        card.dataset.id = task._id;
        
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        
        const title = document.createElement('div');
        title.className = 'task-title';
        title.textContent = task.title;
        
        const description = document.createElement('div');
        description.className = 'task-description';
        description.textContent = task.description;
        
        const actions = document.createElement('div');
        actions.className = 'task-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-outline-primary';
        editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
        editBtn.addEventListener('click', () => openEditModal(task));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-outline-danger';
        deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteTask(task._id));
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        cardBody.appendChild(title);
        cardBody.appendChild(description);
        cardBody.appendChild(actions);
        
        card.appendChild(cardBody);
        
        return card;
    }

    // Function to open edit modal
    function openEditModal(task) {
        document.getElementById('edit-task-id').value = task._id;
        document.getElementById('edit-task-title').value = task.title;
        document.getElementById('edit-task-description').value = task.description;
        document.getElementById('edit-task-status').value = task.status;
        
        editTaskModal.show();
    }

    // Function to delete a task
    async function deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete task');
            }
            
            // Reload tasks
            loadTasks();
            
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
});