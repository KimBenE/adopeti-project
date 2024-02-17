const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./app/db');
require('./dbInit');

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.urlencoded({
    extended: false
 }));
 
app.use(bodyParser.json());

// Import route modules
const usersRoutes = require('./app/routes/users.js');
const animalsRoutes = require('./app/routes/animals.js');
const associationsRoutes = require('./app/routes/associations.js');

// Mount routes 
app.use('/users', usersRoutes);
app.use('/animals', animalsRoutes);
app.use('/associations', associationsRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});