// Replace with the new remote server URL
const baseUrl = 'https://task-4-aninda.onrender.com'; // Your new base URL

// Show login form
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}

// Show register form
function showRegisterForm() {
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-name').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
}

// Register function
function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    fetch(`${baseUrl}/register`, {
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

    fetch(`${baseUrl}/login`, {
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

    fetch(`${baseUrl}/users`, {
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
            location.reload();
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

// Select all users checkboxes
function selectAll() {
    const checkboxes = document.querySelectorAll('.user-checkbox');
    const selectAllCheckbox = document.getElementById('select-all');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// Get selected user IDs
function getSelectedUsers() {
    const checkboxes = document.querySelectorAll('.user-checkbox:checked');
    let selectedUsers = [];
    checkboxes.forEach((checkbox) => {
        selectedUsers.push(checkbox.getAttribute('data-id'));
    });
    return selectedUsers;
}

// Block selected users
document.getElementById('block-btn').addEventListener('click', function() {
    let selectedUsers = getSelectedUsers();
    if (selectedUsers.length > 0) {
        fetch(`${baseUrl}/users/block`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            },
            body: JSON.stringify({ userIds: selectedUsers }),
        })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
            if (data.logout) {
                localStorage.removeItem('auth-token');
                document.getElementById('user-management-section').style.display = 'none';
                document.getElementById('auth-section').style.display = 'block';
                showLoginForm();
                location.reload();
            } else {
                fetchUsers();
            }
        })
        .catch((error) => {
            alert('Error blocking users');
            console.error(error);
        });
    } else {
        alert('No users selected');
    }
});

// Unblock selected users
document.getElementById('unblock-btn').addEventListener('click', function() {
    let selectedUsers = getSelectedUsers();
    if (selectedUsers.length > 0) {
        fetch(`${baseUrl}/users/unblock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            },
            body: JSON.stringify({ userIds: selectedUsers }),
        })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
            fetchUsers();
        })
        .catch((error) => {
            alert('Error unblocking users');
            console.error(error);
        });
    } else {
        alert('No users selected');
    }
});

// Delete selected users
document.getElementById('delete-btn').addEventListener('click', function() {
    let selectedUsers = getSelectedUsers();
    if (selectedUsers.length > 0) {
        fetch(`${baseUrl}/users/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            },
            body: JSON.stringify({ userIds: selectedUsers }),
        })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
            fetchUsers();
        })
        .catch((error) => {
            alert('Error deleting users');
            console.error(error);
        });
    } else {
        alert('No users selected');
    }
});

// Logout function
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('auth-token');
    document.getElementById('user-management-section').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
    showLoginForm();
    location.reload();
});
