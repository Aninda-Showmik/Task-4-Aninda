// Register function
function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    fetch('https://task-4-aninda.onrender.com/register', {  // Change here
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.error) {
            alert(data.error); // Display the error message
            showRegisterForm();
        } else {
            alert(data.message);
            showLoginForm();
        }
    })
    .catch((error) => {
        alert('Error registering user');
        console.error(error);
    });
}

// Login function
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('https://task-4-aninda.onrender.com/login', {  // Change here
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.token) {
            localStorage.setItem('auth-token', data.token);
            document.getElementById('auth-section').style.display = 'none';
            document.getElementById('user-management-section').style.display = 'block';
            fetchUsers();
        } else {
            alert(data.error);
            showLoginForm();
        }
    })
    .catch((error) => {
        alert('Error logging in');
        console.error(error);
    });
}

// Fetch users from server
function fetchUsers() {
    let token = localStorage.getItem('auth-token');
    if (!token) {
        alert('No token found, please log in.');
        showLoginForm();
        return;
    }

    fetch('https://task-4-aninda.onrender.com/users', {  // Change here
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    .then((response) => {
        if (response.status === 403) {
            localStorage.removeItem('auth-token');
            alert('Your account has been blocked. Please log in again.');
            showLoginForm();
            location.reload(true);
            return null;
        }
        return response.json();
    })
    .then((data) => {
        if (!data) return;

        if (data.error) {
            console.error(data.error);
            return;
        }

        let tableBody = document.getElementById('user-table-body');
        tableBody.innerHTML = '';

        data.forEach((user) => {
            tableBody.innerHTML += `
                <tr>
                    <td><input type="checkbox" class="user-checkbox" data-id="${user.id}"></td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.last_login}</td>
                    <td>${user.status}</td>
                </tr>
            `;
        });
    })
    .catch((error) => {
        console.error('Error fetching users:', error);
    });
}
