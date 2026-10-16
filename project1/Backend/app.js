
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();
const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/register', async (request, response) => {
    try {
        const {
            username,
            password,
            firstname,
            lastname,
            salary,
            age
        } = request.body || {};

        if (
            typeof username !== 'string' ||
            typeof password !== 'string' ||
            typeof firstname !== 'string' ||
            typeof lastname !== 'string' ||
            !username.trim() ||
            !password ||
            !firstname.trim() ||
            !lastname.trim()
        ) {
            return response.status(400).json({
                success: false,
                message: "Username, password, first name, and last name are required."
            });
        }

        if (
            username.trim().length > 50 ||
            firstname.trim().length > 50 ||
            lastname.trim().length > 50 ||
            password.length < 8 ||
            Buffer.byteLength(password, 'utf8') > 72
        ) {
            return response.status(400).json({
                success: false,
                message: "Invalid field length or password length."
            });
        }

        const parsedSalary =
            salary === '' || salary == null
                ? null
                : Number(salary);

        const parsedAge =
            age === '' || age == null
                ? null
                : Number(age);

        if (
            (parsedSalary !== null &&
                (!Number.isFinite(parsedSalary) ||
                 parsedSalary < 0 ||
                 parsedSalary > 9999999999.99)) ||
            (parsedAge !== null &&
                (!Number.isInteger(parsedAge) ||
                 parsedAge < 0 ||
                 parsedAge > 150))
        ) {
            return response.status(400).json({
                success: false,
                message: "Please enter a valid salary and age."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const db = dbService.getDbServiceInstance();

        await db.registerUser(
            username.trim(),
            hashedPassword,
            firstname.trim(),
            lastname.trim(),
            parsedSalary,
            parsedAge
        );

        return response.status(201).json({
            success: true,
            message: "User registered successfully!"
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return response.status(409).json({
                success: false,
                message: "Username already exists."
            });
        }

        console.error("Registration error:", error);

        return response.status(500).json({
            success: false,
            message: "Registration failed."
        });
    }
});

app.post('/signin', async (request, response) => {
    try {
        const { username, password } = request.body || {};

        if (
            typeof username !== 'string' ||
            typeof password !== 'string' ||
            !username.trim() ||
            !password
        ) {
            return response.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }

        if (
            username.trim().length > 50 ||
            Buffer.byteLength(password, 'utf8') > 72
        ) {
            return response.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const db = dbService.getDbServiceInstance();
        const user = await db.getUserByUsername(username.trim());

        if (!user) {
            return response.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return response.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const updated = await db.updateSignInTime(user.username);

        if (!updated) {
            return response.status(500).json({
                success: false,
                message: "Could not update sign-in time."
            });
        }

        return response.json({
            success: true,
            message: "User signed in successfully!",
            username: user.username
        });

    } catch (error) {
        console.error("Sign-in error:", error);

        return response.status(500).json({
            success: false,
            message: "Sign-in failed."
        });
    }
});

async function handleSearch(response, searchFunction) {
    try {
        const data = await searchFunction();

        return response.json({
            success: true,
            count: data.length,
            data: data
        });

    } catch (error) {
        console.error("Search error:", error);

        return response.status(500).json({
            success: false,
            message: "Search failed."
        });
    }
}

function parseRange(min, max, type) {
    if (
        min === undefined ||
        max === undefined ||
        typeof min !== 'string' ||
        typeof max !== 'string' ||
        min.trim() === '' ||
        max.trim() === ''
    ) {
        return null;
    }

    const minimum = Number(min);
    const maximum = Number(max);

    if (
        !Number.isFinite(minimum) ||
        !Number.isFinite(maximum) ||
        minimum > maximum ||
        minimum < 0
    ) {
        return null;
    }

    if (type === 'age') {
        if (
            !Number.isInteger(minimum) ||
            !Number.isInteger(maximum) ||
            maximum > 150
        ) {
            return null;
        }
    }

    if (type === 'salary' && maximum > 9999999999.99) {
        return null;
    }

    return { minimum, maximum };
}

app.get('/users/search/name', async (request, response) => {
    const { firstname, lastname } = request.query;

    if (
        (typeof firstname !== 'string' || !firstname.trim()) &&
        (typeof lastname !== 'string' || !lastname.trim())
    ) {
        return response.status(400).json({
            success: false,
            message: "Enter a first name and/or last name."
        });
    }

    if (
        (firstname !== undefined &&
            (typeof firstname !== 'string' || firstname.length > 50)) ||
        (lastname !== undefined &&
            (typeof lastname !== 'string' || lastname.length > 50))
    ) {
        return response.status(400).json({
            success: false,
            message: "Invalid name parameters."
        });
    }

    const db = dbService.getDbServiceInstance();

    return handleSearch(response, () =>
        db.searchUsersByName(
            firstname ? firstname.trim() : '',
            lastname ? lastname.trim() : ''
        )
    );
});

app.get('/users/search/id/:username', async (request, response) => {
    const { username } = request.params;
    const db = dbService.getDbServiceInstance();

    return handleSearch(response, () =>
        db.searchUserById(username)
    );
});

app.get('/users/search/salary', async (request, response) => {
    const range = parseRange(
        request.query.min,
        request.query.max,
        'salary'
    );

    if (!range) {
        return response.status(400).json({
            success: false,
            message: "Enter a valid minimum and maximum salary."
        });
    }

    const db = dbService.getDbServiceInstance();

    return handleSearch(response, () =>
        db.searchUsersBySalary(range.minimum, range.maximum)
    );
});

app.get('/users/search/age', async (request, response) => {
    const range = parseRange(
        request.query.min,
        request.query.max,
        'age'
    );

    if (!range) {
        return response.status(400).json({
            success: false,
            message: "Enter a valid minimum and maximum age."
        });
    }

    const db = dbService.getDbServiceInstance();

    return handleSearch(response, () =>
        db.searchUsersByAge(range.minimum, range.maximum)
    );
});

app.get('/users/search/registered-after/:username',
    async (request, response) => {
        const { username } = request.params;
        const db = dbService.getDbServiceInstance();

        return handleSearch(response, () =>
            db.searchUsersRegisteredAfter(username)
        );
    }
);

app.get('/users/search/never-signed-in',
    async (request, response) => {
        const db = dbService.getDbServiceInstance();

        return handleSearch(response, () =>
            db.searchUsersNeverSignedIn()
        );
    }
);

app.get('/users/search/same-day/:username',
    async (request, response) => {
        const { username } = request.params;
        const db = dbService.getDbServiceInstance();

        return handleSearch(response, () =>
            db.searchUsersSameRegistrationDay(username)
        );
    }
);

app.get('/users/search/today',
    async (request, response) => {
        const db = dbService.getDbServiceInstance();

        return handleSearch(response, () =>
            db.searchUsersRegisteredToday()
        );
    }
);

app.get('/users', async (request, response) => {
    const db = dbService.getDbServiceInstance();

    return handleSearch(response, () =>
        db.getAllUsers()
    );
});

app.post('/insert', async (request, response) => {
    try {
        const { name } = request.body;
        const db = dbService.getDbServiceInstance();

        const data = await db.insertNewName(name);

        return response.json({ data: data });

    } catch (error) {
        console.error(error);

        return response.status(500).json({
            success: false,
            message: "Insert failed."
        });
    }
});

app.get('/getAll', async (request, response) => {
    try {
        const db = dbService.getDbServiceInstance();
        const data = await db.getAllData();

        return response.json({ data: data });

    } catch (error) {
        console.error(error);

        return response.status(500).json({
            success: false,
            message: "Failed to retrieve data."
        });
    }
});

app.get('/search/:name', async (request, response) => {
    try {
        const { name } = request.params;
        const db = dbService.getDbServiceInstance();

        const data = name === "all"
            ? await db.getAllData()
            : await db.searchByName(name);

        return response.json({ data: data });

    } catch (error) {
        console.error(error);

        return response.status(500).json({
            success: false,
            message: "Search failed."
        });
    }
});

app.patch('/update', async (request, response) => {
    try {
        const { id, name } = request.body;
        const db = dbService.getDbServiceInstance();

        const success = await db.updateNameById(id, name);

        return response.json({ success: success });

    } catch (error) {
        console.error(error);

        return response.status(500).json({
            success: false,
            message: "Update failed."
        });
    }
});

app.delete('/delete/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const db = dbService.getDbServiceInstance();

        const success = await db.deleteRowById(id);

        return response.json({ success: success });

    } catch (error) {
        console.error(error);

        return response.status(500).json({
            success: false,
            message: "Delete failed."
        });
    }
});

app.post('/debug', (request, response) => {
    console.log(request.body.debug);

    return response.json({ success: true });
});

app.get('/testdb', async (request, response) => {
    try {
        const db = dbService.getDbServiceInstance();
        const data = await db.getAllData();

        return response.json({ data: data });

    } catch (error) {
        console.error(error);

        return response.status(500).json({
            success: false,
            message: "Database test failed."
        });
    }
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
