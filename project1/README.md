# User Management System

## Project Description

This project is a web-based User Management System developed using HTML, CSS, JavaScript, Node.js, Express.js, and MySQL.

The application allows users to register accounts, sign in securely, and search user records using eight different database queries. User information is stored in a MySQL database, and passwords are hashed using bcrypt.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL / MariaDB
- **Local Web Server:** Apache (XAMPP)
- **Database Administration:** phpMyAdmin
- **Development Environment:** Visual Studio Code

## Prerequisites

Install the following software before running the application:

1. XAMPP with Apache, MySQL, and phpMyAdmin
2. Node.js and npm
3. Visual Studio Code or another code editor
4. Git (optional, for cloning the repository)

## Installation and Setup

### Step 1: Download the Project

Clone the repository using Git or download the project files from GitHub.

Place the project inside the XAMPP `htdocs` directory:

`C:\xampp\htdocs\database_javascript\project1`

### Step 2: Start XAMPP

Open the XAMPP Control Panel and start:

- Apache
- MySQL

Open phpMyAdmin at:

`http://localhost/phpmyadmin/`

### Step 3: Configure the MySQL Database

Create a database named `web_app`.

Run the following SQL statement in phpMyAdmin to create the `Users` table:

```sql
CREATE TABLE Users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    salary DECIMAL(12,2),
    age INT,
    registerday DATE NOT NULL,
    signintime DATETIME NULL
);
```

Create the MySQL database user and grant the required privileges:

```sql
CREATE USER 'john'@'localhost' IDENTIFIED BY '1234';

GRANT ALL PRIVILEGES ON web_app.* TO 'john'@'localhost';
```

If the user already exists, verify the existing account and its privileges rather than creating it again.

### Step 4: Configure Environment Variables

Inside the `Backend` folder, create a file named `.env` containing:

```env
PORT=5050
DB_USER=john
PASSWORD=1234
DATABASE=web_app
DB_PORT=3306
HOST=localhost
```

These credentials are provided for the assignment's local development environment only. Use stronger credentials in other environments.

The `.env` file is excluded from GitHub using `.gitignore`.

### Step 5: Install Backend Dependencies

Open a terminal in Visual Studio Code.

Navigate to the backend directory:

```powershell
cd C:\xampp\htdocs\database_javascript\project1\Backend
```

Install the required dependencies:

```powershell
npm install
```

This installs the Node.js packages defined in `package.json`.

## Compiling the Project

The application uses JavaScript, which does not require a separate compilation process.

The frontend runs directly in a web browser, while the backend executes using Node.js.

After installing the dependencies, the application is ready to run.

## Running the Application

### Step 1: Start the Backend

Open a terminal in the `Backend` directory and run:

```powershell
npm start
```

The Express backend runs at:

`http://localhost:5050`

Keep this terminal running while using the application.

### Step 2: Open the Frontend

Make sure Apache and MySQL are running in XAMPP.

Open the following URL in a web browser:

`http://localhost/database_javascript/project1/Frontend/index.html`

The User Management System should appear.

## Application Features

### User Registration

Users can create an account by entering their first name, last name, username, password, salary, and age.

The application automatically records the registration date and stores the password as a bcrypt hash.

### User Sign-In

Registered users can sign in using their username and password.

After successful authentication, the database updates the user's most recent sign-in time.

### Database Search Functions

The application supports eight searches:

1. Search users by first name or last name.
2. Search users by user ID (username).
3. Search users within a specified salary range.
4. Search users within a specified age range.
5. Find users who registered after the user with ID `john`.
6. Find users who have never signed in.
7. Find users who registered on the same day as `john`.
8. Find users who registered today.

The application also provides a **View All Users** feature.

## Project Structure

```text
project1/
├── Backend/
│   ├── app.js
│   ├── dbService.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
├── Frontend/
│   ├── index.html
│   └── index.js
├── .gitignore
├── README.md
└── sql.txt
```

The `.env` file is created locally and is not committed to GitHub. The `sql.txt` file contains the SQL statements used in the project.

## Local Deployment

To deploy and run this application on another Windows computer:

1. Install Node.js and XAMPP.
2. Copy or clone the project into the XAMPP `htdocs` directory.
3. Start Apache and MySQL.
4. Create the `web_app` database and `Users` table.
5. Create the required MySQL database account and privileges.
6. Configure the backend `.env` file.
7. Run `npm install` inside the `Backend` directory.
8. Start the backend using `npm start`.
9. Open the frontend URL in a browser.

The application is configured for local deployment. Public deployment would require additional configuration and security measures.

## Troubleshooting

**Database connection errors:** Verify that MySQL is running, the `web_app` database exists, and the `.env` credentials match the MySQL account.

**Backend connection errors:** Verify that `npm start` is running and port 5050 is available.

**Frontend not loading:** Verify that Apache is running and the project is located inside the XAMPP `htdocs` directory.

**Missing Node.js modules:** Run `npm install` inside the `Backend` directory.

## Security

- Passwords are hashed using bcrypt.
- Database credentials are stored in `.env`.
- `.gitignore` excludes `.env` and `node_modules`.
- SQL queries use parameterized inputs to reduce SQL injection risks.

This application is intended for educational and local development purposes.