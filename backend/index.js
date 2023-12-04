const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./dbConfig')

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '');
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

app.listen(8080, () => {
    console.log('server running on port 8080')
})