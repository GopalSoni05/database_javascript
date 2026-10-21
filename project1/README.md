# User Management System

## Project Description

This project is a web-based User Management System developed using HTML, CSS, JavaScript, Node.js, Express.js, and MySQL.

The application allows users to register accounts, sign in securely, and search user records using eight different database queries. User information is stored in a MySQL database, and passwords are hashed using bcrypt.

The project demonstrates database connectivity, SQL queries, user authentication, input validation, and communication between a frontend, backend, and relational database.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL / MariaDB
- **Local Web Server:** Apache (XAMPP) or Python HTTP Server
- **Database Administration:** phpMyAdmin
- **Development Environment:** Visual Studio Code
- **Version Control:** Git and GitHub

## Prerequisites

Install the following software before running the application:

1. XAMPP with Apache, MySQL/MariaDB, and phpMyAdmin, or another compatible MySQL setup
2. Node.js and npm
3. Visual Studio Code or another code editor
4. Git (optional for downloading, but required for Git operations)

The project can be run on Windows or macOS. Instructions for both operating systems are included below.

## Installation and Setup

### Step 1: Download the Project

Clone the repository using Git or download the project files from GitHub.

Repository:

`https://github.com/GopalSoni05/database_javascript`

Using Git:

```bash
git clone https://github.com/GopalSoni05/database_javascript.git
```

**Windows setup:**

The project can be placed inside the XAMPP `htdocs` directory:

```text
C:\xampp\htdocs\database_javascript\project1
```

This allows Apache to serve the frontend directly.

**macOS setup:**

The project can be cloned to the Desktop or another convenient directory:

```bash
cd ~/Desktop
git clone https://github.com/GopalSoni05/database_javascript.git
```

The resulting project directory is:

```text
~/Desktop/database_javascript/project1
```

When using the Python HTTP server described below, the project does not need to be inside the XAMPP `htdocs` directory.

### Step 2: Start the Database Server

**Windows:**

Open the XAMPP Control Panel and start:

- Apache
- MySQL

**macOS:**

Open the XAMPP application and start the MySQL database service and Apache web server.

If using an alternative MySQL installation, start the corresponding database service.

Open phpMyAdmin:

`http://localhost/phpmyadmin/`

phpMyAdmin is a browser-based database administration interface. Apache serves the phpMyAdmin interface, while MySQL/MariaDB stores and processes database records.

### Step 3: Configure the MySQL Database

Create a database named `web_app`.

In phpMyAdmin, open the SQL tab and execute:

```sql
CREATE DATABASE IF NOT EXISTS web_app;
```

Select `web_app`, then execute the following SQL to create the `Users` table:

```sql
CREATE TABLE IF NOT EXISTS Users (
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

The `Users` table contains eight columns:

| Column | Description |
|---|---|
| `username` | Unique user identifier and primary key |
| `password` | Stores the bcrypt password hash |
| `firstname` | User's first name |
| `lastname` | User's last name |
| `salary` | User's salary |
| `age` | User's age |
| `registerday` | Date the account was registered |
| `signintime` | Time of the most recent successful sign-in |

The `username` primary key prevents duplicate usernames.

The `registerday` column is assigned automatically during registration using the SQL function `CURDATE()`.

The `signintime` column initially contains `NULL`. It is updated when a user successfully signs in.

#### Create a MySQL Database Account

Create a MySQL database account and grant it the permissions required by the application.

For example:

```sql
CREATE USER 'project1_app'@'localhost'
IDENTIFIED BY 'YOUR_CHOSEN_PASSWORD';

GRANT SELECT, INSERT, UPDATE
ON web_app.*
TO 'project1_app'@'localhost';
```

Replace `YOUR_CHOSEN_PASSWORD` with a password chosen for the local database account.

The permissions serve the following purposes:

- `SELECT`: Retrieve and search database records.
- `INSERT`: Create new user records.
- `UPDATE`: Update user sign-in timestamps.

The application can also be configured to use a different existing MySQL account. For example, the original development setup used an account named `john` with privileges on `web_app`.

The MySQL account name is independent of the user accounts registered through the website. A MySQL database account named `john` is not automatically the same as an application user with username `john`.

If a database account already exists, verify its permissions rather than attempting to create it again.

For example:

```sql
SHOW GRANTS FOR 'project1_app'@'localhost';
```

### Step 4: Configure Environment Variables

Inside the `Backend` folder, create a file named `.env` containing:

```env
PORT=5050
DB_USER=project1_app
PASSWORD=YOUR_CHOSEN_PASSWORD
DATABASE=web_app
DB_PORT=3306
HOST=localhost
```

Replace the example database username and password with the credentials configured on your local MySQL server.

If a different MySQL account is used, update `DB_USER` and `PASSWORD` accordingly.

The backend reads these environment variables using the `dotenv` package.

The database connection is established in `dbService.js`, using the MySQL Node.js package.

The `.env` file contains machine-specific database credentials and should not be committed to GitHub. It must be excluded through `.gitignore`.

### Step 5: Install Backend Dependencies

Open a terminal in Visual Studio Code or another terminal application.

**Windows:**

Navigate to the backend directory:

```powershell
cd C:\xampp\htdocs\database_javascript\project1\Backend
```

**macOS:**

Navigate to the backend directory:

```bash
cd ~/Desktop/database_javascript/project1/Backend
```

Install the required dependencies:

```bash
npm install
```

This installs the Node.js packages defined in `package.json`.

The project's main backend dependencies include:

- `express`: Creates the backend HTTP server and API routes.
- `mysql`: Connects Node.js to the MySQL database and executes SQL.
- `bcrypt`: Hashes and verifies user passwords.
- `cors`: Allows frontend requests to reach the backend.
- `dotenv`: Loads environment variables from `.env`.
- `nodemon`: Automatically restarts the backend when JavaScript files change.

The `node_modules` folder is generated by npm and should not be committed to the repository.

## Compiling the Project

The application uses JavaScript, which does not require a separate compilation process.

The frontend runs directly in a web browser, while the backend executes using Node.js.

After installing the dependencies and configuring the database, the application is ready to run.

## Running the Application

### Step 1: Start the Backend

Open a terminal in the `Backend` directory and run:

```bash
npm start
```

The command starts the backend using `nodemon app.js`.

The Express backend runs at:

`http://localhost:5050`

Successful startup should produce messages similar to:

```text
Backend server running on port 5050
Database connected successfully!
```

Keep this terminal running while using the application.

The backend listens for requests from the frontend, validates user input, performs registration and sign-in operations, and executes SQL queries through `dbService.js`.

### Step 2: Open the Frontend

There are two supported local approaches.

#### Option A: Windows with Apache/XAMPP

Make sure Apache and MySQL are running in XAMPP.

If the repository is located inside XAMPP's `htdocs` directory, open:

`http://localhost/database_javascript/project1/Frontend/index.html`

The User Management System should appear.

#### Option B: macOS with Python HTTP Server

A Python HTTP server can serve the frontend without moving the project into XAMPP's `htdocs` directory.

Open a second terminal window or tab.

Navigate to the frontend directory:

```bash
cd ~/Desktop/database_javascript/project1/Frontend
```

Start a local HTTP server:

```bash
python3 -m http.server 8000
```

Open the frontend in a browser:

`http://localhost:8000/index.html`

The backend should remain running on port 5050.

The frontend HTTP server runs separately on port 8000.

The browser communicates with the Express backend through HTTP requests, and the backend communicates with MySQL.

Keep both terminal sessions running while using the application.

## Application Features

The project implements ten required features: registration, sign-in, and eight database searches.

### 1. User Registration

Users can create an account by entering their first name, last name, username, password, salary, and age.

The application validates the submitted data before inserting a record into the database.

Passwords must contain at least eight characters and are hashed using bcrypt before storage.

The application automatically records the registration date using `CURDATE()`.

New users initially have a `NULL` sign-in timestamp.

If a username already exists, registration is rejected because `username` is the primary key.

### 2. User Sign-In

Registered users can sign in using their username and password.

The backend retrieves the user's stored password hash and verifies the submitted password using `bcrypt.compare()`.

If authentication succeeds, the database updates the user's most recent sign-in time using `NOW()`.

Incorrect passwords are rejected without updating the sign-in timestamp.

### Database Search Functions

The application supports eight searches.

### 3. Search by First Name and/or Last Name

Users can search by first name, last name, or both.

The SQL query uses `LIKE` to support partial name matching.

The backend dynamically includes the relevant search conditions depending on which fields were entered.

### 4. Search by User ID

Users can search for a specific account using its username.

The application uses the `username` column as its user identifier.

The SQL query uses `WHERE username = ?` to retrieve the matching record.

### 5. Search by Salary Range

Users can specify a minimum and maximum salary.

The database retrieves users whose salaries fall within that range.

The query uses the SQL `BETWEEN` operator, which includes both the minimum and maximum values.

### 6. Search by Age Range

Users can specify a minimum and maximum age.

The database retrieves users whose ages fall within the requested range.

The query also uses the SQL `BETWEEN` operator.

### 7. Find Users Registered After John

The application finds users who registered after the user with ID `john`.

A nested SQL query retrieves John's registration date.

The outer query returns users whose registration dates are later than John's date.

### 8. Find Users Who Have Never Signed In

The application identifies accounts that have never successfully signed in.

It uses:

```sql
WHERE signintime IS NULL
```

A `NULL` sign-in timestamp indicates that no successful sign-in has been recorded.

### 9. Find Users Registered on the Same Day as John

The application finds users whose registration dates match John's registration date.

A nested query retrieves John's date, and the outer query compares other records against it.

Because the comparison uses equality, John's own account is also included in the results.

### 10. Find Users Registered Today

The application identifies users who registered on the current date.

The query compares `registerday` against the MySQL function `CURDATE()`.

This uses the database server's current date.

### Additional Feature: View All Users

The application also provides a **View All Users** feature.

This retrieves all user records and displays their public profile information without returning password hashes.

## SQL Statements

The `sql.txt` file documents the SQL used by the application.

It includes:

- Database and table creation statements.
- Example MySQL account permissions.
- User registration SQL.
- User sign-in queries.
- All eight required search queries.
- The additional View All Users query.
- Optional SQL statements for adjusting test data.

The application's SQL queries use parameter placeholders represented by question marks (`?`).

For example:

```sql
SELECT username, firstname, lastname,
       salary, age, registerday, signintime
FROM Users
WHERE username = ?;
```

The backend provides the parameter value separately when executing the query.

This helps prevent SQL injection by avoiding direct concatenation of user input into SQL commands.

**Important:** `sql.txt` is primarily documentation of the application's SQL statements. Queries containing `?` are intended to be executed through the Node.js MySQL driver. The entire file should not be executed directly in phpMyAdmin.

The optional test-data statements should only be run when intentionally modifying test accounts.

## Application Architecture

The project follows a frontend/backend/database architecture.

**Frontend (`index.html` and `index.js`)**

The frontend displays the user interface, collects input, sends HTTP requests, and displays responses from the backend.

**Backend (`app.js`)**

The Express backend defines the application's API routes.

It performs input validation, handles registration and sign-in requests, hashes and verifies passwords, and calls the database service for SQL operations.

**Database Service (`dbService.js`)**

The database service establishes the MySQL connection and executes parameterized SQL queries.

It separates the database operations from the HTTP request-handling logic.

**MySQL Database (`web_app`)**

The database stores user records in the `Users` table.

The overall communication flow is:

```text
Web Browser
    |
    v
Frontend (HTML / JavaScript)
    |
    | HTTP Requests
    v
Express Backend (app.js)
    |
    v
Database Service (dbService.js)
    |
    | SQL Queries
    v
MySQL Database (web_app)
    |
    v
Users Table
```

The query results are returned through the backend to the frontend for display.

## Project Structure

```text
database_javascript/
└── project1/
    ├── Backend/
    │   ├── app.js
    │   ├── dbService.js
    │   ├── package.json
    │   ├── package-lock.json
    │   └── .env
    ├── Frontend/
    │   ├── index.html
    │   └── index.js
    ├── README.md
    └── sql.txt
```

The `.env` file is created locally and should not be committed to GitHub.

The repository also uses `.gitignore` to exclude local configuration and installed dependencies.

The `sql.txt` file contains the SQL statements used in the project.

## Local Deployment

### Deploying on Another Windows Computer

1. Install Node.js and XAMPP.
2. Copy or clone the project into the XAMPP `htdocs` directory.
3. Start Apache and MySQL.
4. Create the `web_app` database and `Users` table.
5. Create the required MySQL database account and grant privileges.
6. Configure the backend `.env` file.
7. Run `npm install` inside the `Backend` directory.
8. Start the backend using `npm start`.
9. Open the frontend URL in a browser.

### Deploying on Another Mac

1. Install Node.js and a compatible MySQL/MariaDB environment, such as XAMPP.
2. Clone the repository to the Desktop or another directory.
3. Start MySQL and open phpMyAdmin.
4. Create the `web_app` database and `Users` table.
5. Create a MySQL database account with the required permissions.
6. Configure the backend `.env` file with the local credentials.
7. Run `npm install` inside `project1/Backend`.
8. Start the backend with `npm start`.
9. Open another terminal and run `python3 -m http.server 8000` inside `project1/Frontend`.
10. Open `http://localhost:8000/index.html` in a browser.

The application is configured for local deployment.

Public deployment would require additional configuration and security measures.

## Version Control with Git

Git is used to manage source-code changes and collaborate through GitHub.

The repository can be downloaded using:

```bash
git clone https://github.com/GopalSoni05/database_javascript.git
```

To retrieve remote updates without automatically merging them:

```bash
git fetch
```

To update the current branch with remote changes:

```bash
git pull
```

To review changed files:

```bash
git status
```

To stage changes:

```bash
git add project1/README.md project1/sql.txt
```

To create a commit:

```bash
git commit -m "Update project documentation and SQL statements"
```

To upload committed changes to GitHub:

```bash
git push
```

These commands should be run from the repository's root directory when using the paths shown above.

Before committing, verify that `.env` files, passwords, and `node_modules` are not included in the staged changes.

## Troubleshooting

**Database connection errors:** Verify that MySQL is running, that the `web_app` database exists, and that the `.env` credentials match an authorized MySQL account.

**Access denied by MySQL:** Verify the database username, password, host, and account privileges.

**Backend connection errors:** Verify that `npm start` is running and port 5050 is available.

**Frontend not loading on Windows:** Verify that Apache is running and that the project is located inside XAMPP's `htdocs` directory.

**Frontend not loading on macOS:** Verify that the Python HTTP server is running in the correct `Frontend` directory and that port 8000 is available.

**Frontend loads but requests fail:** Verify that the Express backend is running on port 5050 and that its database connection succeeded.

**Missing Node.js modules:** Run `npm install` inside the `Backend` directory.

**Duplicate username error:** Each account must have a unique username because `username` is the table's primary key.

**Unexpected date-search results:** Verify the registration dates stored in MySQL. Date-based searches depend on `registerday` and the database server's current date.

## Security

- Passwords are hashed using bcrypt before database insertion.
- Submitted passwords are verified against stored hashes rather than compared as plaintext.
- Database credentials are stored in a local `.env` file.
- `.env` and `node_modules` should be excluded from Git.
- SQL queries use parameterized inputs to reduce SQL injection risks.
- Search responses exclude password hashes.
- The backend validates required fields, input lengths, and numeric ranges.
- Duplicate usernames are rejected using the database primary-key constraint.
- The application database account can be restricted to the `SELECT`, `INSERT`, and `UPDATE` privileges needed by the required features.

This application is intended for educational and local development purposes.