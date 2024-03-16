const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const db = require('./app/db');
require('./dbInit');

// Serve static files from the 'uploads/' folder
app.use(express.static(path.join(__dirname, 'uploads')));

// Allow requests from localhost
const allowedOrigins = ['http://localhost', 'http://adopeti.xyz'];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

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

const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Server is running on port ${port}`);
});
