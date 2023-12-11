const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./dbConfig')
const { OAuth2Client } = require('google-auth-library')

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to the database :(', err);
    } else {
      console.log('Connected to the database :)');
    }
});

app.post('/googlelogin', async (request, response) => {
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

app.post('/signup', (request, response) => {
    const { name, username, password, userRole } = request.body;

    if(!name || !username || !password) {
        return response.send({ message: "Could not read empty", error: true });
    }
    pool.query('select * from users where username = $1',[username], (err,result) => {
        if (err) {
            response.send({ message: "Something went wrong", error: true });
        } else if (result.rowCount) {
            response.send({ message: "Use different username", error: true });
        } else {
            pool.query('insert into users (name, username, password, userrole) values ($1, $2, $3, $4)', [name, username, password, userRole], (err2, result2) => {
                if (err2) {
                    response.send({ message: "Error Adding User", error: true});
                } else {
                    response.status(201).send({ message: "User added successfully", error: false});
                }
            });
        }
    });
});

app.post('/login', (request, response) => {
    const { username, password } = request.body;

    pool.query('select * from users where username = $1 and password = $2',[username, password], (err, result) => {
        if (err) {
            response.send({message: "Something went wrong", name: undefined, error: true});
        } else if (result.rowCount) {
            const date = new Date();
            const token = Buffer.from(date.toISOString()+username).toString('base64');
            pool.query('update users set token = $1 where username = $2', [token, username], (err2, result2) => {
                if (err2) {
                    response.send({ message: "Could not log you in", name: undefined, error: true});
                } else {
                    var fullName = result.rows[0].name;
                    var name = fullName;
                    const spaceIndex = fullName.indexOf(' ');
                    if (spaceIndex !== -1) {
                        name = fullName.substring(0, spaceIndex);
                    }
                    response.send({message: "Login Success", name, error: false, token, role: result.rows[0].userrole});
                }
            });
        } else {
            response.send({message: "Invalid Credentials", name: undefined, error: true});
        }
    });
});

app.post('/service', (request, response) => {
    const { service, token } = request.body;
    pool.query('select * from users where token = $1', [token], (err, result) => {
        if (err) {
            response.send({message: "Something went wrong", error: true});
            console.error(err);
        } else if (result.rowCount) {
            const id = result.rows[0].id;
            pool.query('insert into providers(userid, service) values ($1, $2)', [id, service], (err2, result2) => {
                if (err2) {
                    response.send({message: "Something went wrong", error: true});
                    console.error(err2);
                } else {
                    response.send({message: "Successful", error: false});
                }
            });
        }
    });
});

app.post('/ticket', (request, response) => {
    const {service, token, assigneeid, assigneename, reportername} = request.body;
    pool.query('select * from users where token = $1', [token], (err, result) => {
        if (err) {
            console.error(err);
            response.send({message: "User not found", error: true});
        } else if (result.rowCount) {
            const reporterid = result.rows[0].id;
            const date = (new Date()).toISOString();
            pool.query('insert into ticket(reporterid, reportername, assigneeid, assigneename, description, createdat) values($1, $2, $3, $4, $5, $6)', [reporterid, reportername, assigneeid, assigneename, service, date], (err2, result2) => {
                if (err2) {
                    console.error(err2)
                    response.send({message: "Could not create ticket", error: true});
                } else {
                    response.send({message: "Ticket details submitted", error: false});
                }
            });
        }
    });
});

app.get('/services', (request, response) => {
    pool.query('select distinct(service) from providers', (err, result) => {
        if (err) {
            response.send({ message: "Something went wrong getting details", error: true });
        } else if (result.rowCount) {
            response.send({ message: "Successful", error: false, list: result.rows });
        } else {
            response.send({message: "No services", error: false });
        }
    });
});

app.get('/providers', (request, response) => {
    const service = request.query.service.toLowerCase();
    pool.query('select * from providers where service = $1', [service], (err, result) => {
        if (err) {
            response.send(err);
        } else if (result.rowCount) {
            const alluserids = result.rows.map(row => row.userid);
            const userIdList = alluserids.join(',');
            pool.query(`select * from users where id IN (${userIdList})`, (err2, result2) => {
                if (err2) {
                    response.send(err2);
                } else {
                    response.send(result2.rows);
                }
            });
        }
    });
});

app.get('/tickets', (request, response) => {
    const { token } = request.query;
    pool.query('select id, userrole from users where token = $1', [token], (err, result) => {
        if (err) {
            console.error(err);
            response.send({ message: "User not authorised", error: true });
        } else if (result.rowCount) {
            const searchid = result.rows[0].id;
            const userrole = result.rows[0].userrole;
            if (userrole === 'Client') {
                pool.query('select * from ticket where reporterid = $1', [searchid], (err2, result2) => {
                    if (err2) {
                        console.error(err2);
                        response.send({ message: "Could not retreive tickets details", error: true });
                    } else {
                        response.send({ message: "Successful", error: false, list: result2.rows });
                    }
                });
            } else {
                pool.query('select * from ticket where assigneeid = $1', [searchid], (err2, result2) => {
                    if (err2) {
                        console.error(err2);
                        response.send({ message: "Could not retreive tickets details", error: true });
                    } else {
                        response.send({ message: "Successful", error: false, list: result2.rows });
                    }
                });
            }
        }
    });
});

app.delete('/tickets', (request, response) => {
    const { token } = request.query;
    pool.query('select id from users where token = $1', [token], (err, result) => {
        if (err) {
            console.error(err);
            response.send({message: "user not authorised", error: true});
        } else if (result.rowCount) {
            const reporterid = result.rows[0].id;
            pool.query('delete from ticket where reporterid = $1', [reporterid], (err2, result2) => {
                if (err2) {
                    console.error(err2);
                    response.send({message: "Could not delete all tickets", error: true});
                } else {
                    response.send({message: "Tickets deleted successfully", error: false});
                }
            })
        }
    })
})

app.post('/logout', (request, response) => {
    const { token } = request.query;
    pool.query('update users set token = $1 where id = (select id from users where token = $2)', ['', token], (err, result) => {
        if (err) {
            response.send({ message: "Authorization failed", error: true });
        } else {
            response.send({ message: "Logout successful", error: false});
        }
    })
})

app.listen(8080, () => {
    console.log('server running on port 8080')
});