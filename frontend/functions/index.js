const express = require('express');
const pool = require('./config/dbConfig.js')
const userRoutes = require('./routers/user.js');
const ticketRoutes = require('./routers/ticket.js');
const path = require('path')
const fs = require('fs')

const app = express();
const PORT = process.env.PORT || 3000;

const buildPath = path.resolve(__dirname, '../frontend/build');
app.use(express.static(buildPath));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database :(', err);
  } else {
    console.log('Connected to the database :)');
  }
});

app.listen(PORT, () => {
  console.log('server running on port', PORT)
});