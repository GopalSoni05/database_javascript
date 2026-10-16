
const API_URL = 'http://localhost:5050';

async function apiRequest(path, options = {}) {
    const response = await fetch(API_URL + path, options);
    const data = await response.json();

    if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Request failed.');
    }

    return data;
}

function showMessage(elementId, message, success) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = success ? 'message success' : 'message error';
}

function clearMessage(elementId) {
    const element = document.getElementById(elementId);
    element.textContent = '';
    element.className = 'message';
}

function getInputValue(id) {
    return document.getElementById(id).value.trim();
}

function formatDate(value, dateOnly = false) {
    if (!value) {
        return 'Never';
    }

    if (dateOnly) {
        const dateString = String(value).slice(0, 10);
        const parts = dateString.split('-');

        if (parts.length === 3) {
            return `${parts[1]}/${parts[2]}/${parts[0]}`;
        }
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString();
}

function formatSalary(value) {
    if (value === null || value === undefined || value === '') {
        return 'N/A';
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(Number(value));
}

function createCell(row, value) {
    const cell = row.insertCell();
    cell.textContent = value === null || value === undefined
        ? ''
        : String(value);

    return cell;
}

function displayUsers(users, title) {
    const tbody = document.querySelector('#users-table tbody');
    tbody.replaceChildren();

    document.getElementById('results-title').textContent = title;
    document.getElementById('results-count').textContent =
        `${users.length} user(s) found`;

    if (users.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 7;
        cell.className = 'empty-state';
        cell.textContent = 'No matching users found.';
        return;
    }

    users.forEach(user => {
        const row = tbody.insertRow();

        createCell(row, user.username);
        createCell(row, user.firstname);
        createCell(row, user.lastname);
        createCell(row, formatSalary(user.salary));
        createCell(row, user.age ?? 'N/A');
        createCell(row, formatDate(user.registerday, true));
        createCell(row, formatDate(user.signintime));
    });
}

async function searchUsers(path, title) {
    clearMessage('search-message');

    try {
        const result = await apiRequest(path);
        displayUsers(result.data, title);
    } catch (error) {
        showMessage('search-message', error.message, false);
    }
}

document.getElementById('register-form').addEventListener('submit', async event => {
    event.preventDefault();
    clearMessage('register-message');

    const username = getInputValue('register-username');
    const password = document.getElementById('register-password').value;
    const firstname = getInputValue('register-firstname');
    const lastname = getInputValue('register-lastname');
    const salary = getInputValue('register-salary');
    const age = getInputValue('register-age');

    try {
        const result = await apiRequest('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                firstname,
                lastname,
                salary,
                age
            })
        });

        showMessage('register-message', result.message, true);
        document.getElementById('register-form').reset();
        await searchUsers('/users', 'All Registered Users');

    } catch (error) {
        showMessage('register-message', error.message, false);
    }
});

document.getElementById('signin-form').addEventListener('submit', async event => {
    event.preventDefault();
    clearMessage('signin-message');

    const username = getInputValue('signin-username');
    const password = document.getElementById('signin-password').value;

    try {
        const result = await apiRequest('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        showMessage('signin-message', result.message, true);
        document.getElementById('signin-form').reset();
        await searchUsers('/users', 'All Registered Users');

    } catch (error) {
        showMessage('signin-message', error.message, false);
    }
});

document.getElementById('view-all-users-btn').addEventListener('click', () => {
    searchUsers('/users', 'All Registered Users');
});

document.getElementById('search-name-btn').addEventListener('click', () => {
    const firstname = getInputValue('search-firstname');
    const lastname = getInputValue('search-lastname');

    if (!firstname && !lastname) {
        showMessage(
            'search-message',
            'Please enter a first name or last name.',
            false
        );
        return;
    }

    const params = new URLSearchParams();

    if (firstname) {
        params.set('firstname', firstname);
    }

    if (lastname) {
        params.set('lastname', lastname);
    }

    searchUsers(
        '/users/search/name?' + params.toString(),
        'Search by Name'
    );
});

document.getElementById('search-userid-btn').addEventListener('click', () => {
    const username = getInputValue('search-userid');

    if (!username) {
        showMessage('search-message', 'Please enter a username.', false);
        return;
    }

    searchUsers(
        '/users/search/id/' + encodeURIComponent(username),
        'Search by User ID'
    );
});

document.getElementById('search-salary-btn').addEventListener('click', () => {
    const min = getInputValue('salary-min');
    const max = getInputValue('salary-max');

    if (
        min === '' ||
        max === '' ||
        Number(min) < 0 ||
        Number(max) < Number(min)
    ) {
        showMessage(
            'search-message',
            'Please enter a valid minimum and maximum salary.',
            false
        );
        return;
    }

    const params = new URLSearchParams({ min, max });

    searchUsers(
        '/users/search/salary?' + params.toString(),
        'Search by Salary Range'
    );
});

document.getElementById('search-age-btn').addEventListener('click', () => {
    const min = getInputValue('age-min');
    const max = getInputValue('age-max');

    if (
        min === '' ||
        max === '' ||
        !Number.isInteger(Number(min)) ||
        !Number.isInteger(Number(max)) ||
        Number(min) < 0 ||
        Number(max) > 150 ||
        Number(max) < Number(min)
    ) {
        showMessage(
            'search-message',
            'Please enter a valid minimum and maximum age.',
            false
        );
        return;
    }

    const params = new URLSearchParams({ min, max });

    searchUsers(
        '/users/search/age?' + params.toString(),
        'Search by Age Range'
    );
});

document.getElementById('search-after-john-btn').addEventListener('click', () => {
    searchUsers(
        '/users/search/registered-after/john',
        'Users Registered After John'
    );
});

document.getElementById('search-never-signed-btn').addEventListener('click', () => {
    searchUsers(
        '/users/search/never-signed-in',
        'Users Who Never Signed In'
    );
});

document.getElementById('search-same-day-btn').addEventListener('click', () => {
    searchUsers(
        '/users/search/same-day/john',
        'Users Registered on the Same Day as John'
    );
});

document.getElementById('search-today-btn').addEventListener('click', () => {
    searchUsers(
        '/users/search/today',
        'Users Registered Today'
    );
});

document.addEventListener('DOMContentLoaded', () => {
    searchUsers('/users', 'All Registered Users');
});
