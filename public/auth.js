document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'dashboard.html';
    }

    // Set up Bootstrap tabs
    const tabElements = document.querySelectorAll('#auth-tabs a');
    tabElements.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.add('active');
            const target = document.querySelector(this.getAttribute('href'));
            
            // Hide all tab panes
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            
            // Show the target tab pane
            target.classList.add('show', 'active');
            
            // Remove active class from other tabs
            tabElements.forEach(t => {
                if (t !== this) {
                    t.classList.remove('active');
                }
            });
        });
    });

    // Handle login form submission
    const loginForm = document.getElementById('login-form-element');
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const alertBox = document.getElementById('login-alert');
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Store token and user info in localStorage
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            alertBox.textContent = error.message;
            alertBox.classList.remove('d-none');
        }
    });

    // Handle signup form submission
    const signupForm = document.getElementById('signup-form-element');
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const alertBox = document.getElementById('signup-alert');
        
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }
            
            // Store token and user info in localStorage
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            alertBox.textContent = error.message;
            alertBox.classList.remove('d-none');
        }
    });
});