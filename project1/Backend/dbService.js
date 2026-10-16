
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

let instance = null;

console.log("HOST: " + process.env.HOST);
console.log("DB USER: " + process.env.DB_USER);
console.log("DATABASE: " + process.env.DATABASE);
console.log("DB PORT: " + process.env.DB_PORT);

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection error:", err.message);
        return;
    }

    console.log("Database connected successfully!");
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : (instance = new DbService());
    }

    async executeQuery(query, parameters = []) {
        return new Promise((resolve, reject) => {
            connection.query(query, parameters, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    async getAllData() {
        return this.executeQuery("SELECT * FROM names;");
    }

    async insertNewName(name) {
        const dateAdded = new Date();

        const result = await this.executeQuery(
            "INSERT INTO names (name, date_added) VALUES (?, ?);",
            [name, dateAdded]
        );

        return {
            id: result.insertId,
            name: name,
            dateAdded: dateAdded
        };
    }

    async searchByName(name) {
        return this.executeQuery(
            "SELECT * FROM names WHERE name = ?;",
            [name]
        );
    }

    async deleteRowById(id) {
        const result = await this.executeQuery(
            "DELETE FROM names WHERE id = ?;",
            [id]
        );

        return result.affectedRows === 1;
    }

    async updateNameById(id, newName) {
        const result = await this.executeQuery(
            "UPDATE names SET name = ? WHERE id = ?;",
            [newName, id]
        );

        return result.affectedRows === 1;
    }

    async registerUser(
        username,
        hashedPassword,
        firstname,
        lastname,
        salary,
        age
    ) {
        const query = `
            INSERT INTO Users
            (
                username,
                password,
                firstname,
                lastname,
                salary,
                age,
                registerday,
                signintime
            )
            VALUES (?, ?, ?, ?, ?, ?, CURDATE(), NULL);
        `;

        return this.executeQuery(query, [
            username,
            hashedPassword,
            firstname,
            lastname,
            salary,
            age
        ]);
    }

    async getUserByUsername(username) {
        const results = await this.executeQuery(
            "SELECT username, password FROM Users WHERE username = ?;",
            [username]
        );

        return results[0] || null;
    }

    async updateSignInTime(username) {
        const result = await this.executeQuery(
            "UPDATE Users SET signintime = NOW() WHERE username = ?;",
            [username]
        );

        return result.affectedRows === 1;
    }

    async searchUsersByName(firstname, lastname) {
        let query = `
            SELECT username, firstname, lastname,
                   salary, age, registerday, signintime
            FROM Users
            WHERE 1 = 1
        `;

        const parameters = [];

        if (firstname) {
            query += " AND firstname LIKE ?";
            parameters.push("%" + firstname + "%");
        }

        if (lastname) {
            query += " AND lastname LIKE ?";
            parameters.push("%" + lastname + "%");
        }

        query += " ORDER BY lastname, firstname;";

        return this.executeQuery(query, parameters);
    }

    async searchUserById(username) {
        const query = `
            SELECT username, firstname, lastname,
                   salary, age, registerday, signintime
            FROM Users
            WHERE username = ?;
        `;

        return this.executeQuery(query, [username]);
    }

    async searchUsersBySalary(minSalary, maxSalary) {
        const query = `
            SELECT username, firstname, lastname,
                   salary, age, registerday, signintime
            FROM Users
            WHERE salary BETWEEN ? AND ?
            ORDER BY salary ASC;
        `;

        return this.executeQuery(query, [minSalary, maxSalary]);
    }

    async searchUsersByAge(minAge, maxAge) {
        const query = `
            SELECT username, firstname, lastname,
                   salary, age, registerday, signintime
            FROM Users
            WHERE age BETWEEN ? AND ?
            ORDER BY age ASC;
        `;

        return this.executeQuery(query, [minAge, maxAge]);
    }

    async searchUsersRegisteredAfter(username) {
        const query = `
            SELECT username, firstname, lastname,
                   salary, age, registerday, signintime
            FROM Users
            WHERE registerday > (
                SELECT registerday
                FROM Users
                WHERE username = ?
            )
            ORDER BY registerday ASC;
        `;

        return this.executeQuery(query, [username]);
    }

    async searchUsersNeverSignedIn() {
        const query = `
            SELECT username, firstname, lastname,
                   salary, age, registerday, signintime
            FROM Users
            WHERE signintime IS NULL
            ORDER BY username;
        `;

        return this.executeQuery(query);
    }

    async searchUsersSameRegistrationDay(username) {
        const query = `
            SELECT username, firstname, lastname,
                   salary, age, registerday, signintime
            FROM Users
            WHERE registerday = (
                SELECT registerday
                FROM Users
                WHERE username = ?
            )
            ORDER BY username;
        `;

        return this.executeQuery(query, [username]);
    }

    async searchUsersRegisteredToday() {
        const query = `
            SELECT username, firstname, lastname,
                   salary, age, registerday, signintime
            FROM Users
            WHERE registerday = CURDATE()
            ORDER BY username;
        `;

        return this.executeQuery(query);
    }

    async getAllUsers() {
        const query = `
            SELECT username, firstname, lastname,
                   salary, age, registerday, signintime
            FROM Users
            ORDER BY username;
        `;

        return this.executeQuery(query);
    }
}

module.exports = DbService;
