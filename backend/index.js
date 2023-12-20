const express = require('express');
const pool = require('./config/dbConfig.js')
const userRoutes = require('./routers/user.js');
const ticketRoutes = require('./routers/ticket.js');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to the database :(', err);
    } else {
      console.log('Connected to the database :)');
    }
});

app.get('/', (request, response) => {
    response.send({message: "Welcome"});
})

app.listen(8080, () => {
    console.log('server running on port 8080')
});