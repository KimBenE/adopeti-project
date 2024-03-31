const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

const db = require('./app/db');
require('./dbInit');

// Allow all clients to connect to our server
// app.use(cors());

// Allow requests from specific origin
const allowedOrigin = ['http://adopeti.xyz:3000', 'http://localhost'];
const corsOptions = {
  origin: allowedOrigin
};

// Use cors middleware with options
app.use(cors(corsOptions));

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import route modules
const usersRoutes = require('./app/routes/users.js');
const animalsRoutes = require('./app/routes/animals.js');
const associationsRoutes = require('./app/routes/associations.js');
const requestsRoutes = require('./app/routes/requests.js');

// Mount routes 
app.use('/users', usersRoutes);
app.use('/animals', animalsRoutes);
app.use('/associations', associationsRoutes);
app.use('/requests', requestsRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '.')));
app.use(express.static(path.join(__dirname, 'assets/html')));
app.use(express.static(path.join(__dirname, 'assets')));

// Start the server
app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
