const express = require('express');
const router = express.Router();
const pool = require('../dbConfig');
const { OAuth2Client } = require('google-auth-library');
const auth = require('../middleware/auth')

router.post('/googlelogin', async (request, response) => {
    const { token, client_id } = request.body;
    const client = new OAuth2Client();
    try {
        const ticket = await client.verifyIdToken({
        idToken: token,
        audience: client_id
    })
    const payload = ticket.getPayload();
    const name = payload['given_name'];
    const userId = payload['sub'];
    const emailVerified = payload['email_verified'];
        response.send({ name, username: userId, emailVerified, error: undefined });
    } catch (error) {
        response.send({ name : undefined, username: undefined, emailVerified: false, error: error });
    }
});

router.post('/signup', async (request, response) => {
    try {
        const { name, username, password, userRole } = request.body;

        if(!name || !username || !password) {
            return response.send({ message: "Could not read empty", error: true });
        }
        const userResult = await pool.query('select * from users where username = $1',[username]);
            if (userResult.rowCount) {
                response.send({ message: "Use different username", error: true });
            } else {
                try {
                    const result = await pool.query('insert into users (name, username, password, userrole) values ($1, $2, $3, $4)', [name, username, password, userRole]);
                    if (result.rowCount) {
                        response.status(201).send({ message: "User added successfully", error: false});
                    }
                } catch (error) {
                    response.send({ message: "Error Adding User", error: true});
                }
            }
    } catch (error) {
        response.send({ message: "Something went wrong", error: true });
    }
});

router.post('/login', async (request, response) => {
    try {
        const { username, password } = request.body;

        const userResult = await pool.query('select * from users where username = $1 and password = $2',[username, password]);
        if (userResult.rowCount) {
            const date = new Date();
            const token = Buffer.from(date.toISOString()+username).toString('base64');
            try {
                const result = await pool.query('update users set token = $1 where username = $2', [token, username]);
                if (result.rowCount) {
                    var fullName = userResult.rows[0].name;
                    var name = fullName;
                    const spaceIndex = fullName.indexOf(' ');
                    if (spaceIndex !== -1) {
                        name = fullName.substring(0, spaceIndex);
                    }
                    response.send({message: "Login Success", name, error: false, token, role: userResult.rows[0].userrole});
                }
            } catch (error) {
                response.send({ message: "Could not log you in", name: undefined, error: true});
            }
        } else {
            response.send({message: "Invalid Credentials", name: undefined, error: true});
        }
    } catch (error) {
        response.send({message: "Something went wrong", name: undefined, error: true});
    }
});

router.post('/logout', auth, async (request, response) => {
    try {
        const userid = (request.user.id);
        const result = await pool.query('update users set token = $1 where id = $2', ['', userid]);

        if (result.rowCount) {
            response.send({ message: "Logout successful", error: false });
        } else {
            response.send({ message: "No user found with the provided token", error: true });
        }
    } catch (error) {
        console.error(error);
        response.send({ message: "Authorization failed", error: true });
    }
});

router.post('/service', auth, async (request, response) => {
    try {
        const { service } = request.body;
        const id = request.user.id;
            try {
                const result = await pool.query('insert into providers(userid, service) values ($1, $2)', [id, service]);
                if (result.rowCount) {
                    response.send({message: "Service added", error: false});
                }
            } catch (error) {
                response.send({message: "Could not add service", error: true});
            }
    } catch (error) {
        console.error(error);
        response.send({message: "User not authorised", error: true});
    }
});

router.get('/services', async (request, response) => {
    try {
        const result = await pool.query('select distinct(service) from providers');
        if (result.rowCount) {
            response.send({ message: "Successful", error: false, list: result.rows });
        }
    } catch (error) {
        response.send({ message: "Something went wrong getting details", error: true });
    }
});

router.get('/providers', async (request, response) => {
    try {
        const service = request.query.service.toLowerCase();
        const userResult = await pool.query('select * from providers where service = $1', [service]);
            if (userResult.rowCount) {
                const alluserids = userResult.rows.map(row => row.userid);
                const userIdList = alluserids.join(',');
                const result = await pool.query(`select * from users where id IN (${userIdList})`);
                if (result.rowCount) {
                    response.send(result.rows);
                }
            }
    } catch (error) {
        response.send(error);
    }
});

module.exports = router
