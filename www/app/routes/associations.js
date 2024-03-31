const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection

// Define a route to handle user registration
router.post('/register', (req, res) => {
    const { username, password, association_name, address, phone, emailAddress,residentialArea, surveyLink } = req.body;
  
    // Check if the username already exists in the database
    const checkQuery = 'SELECT * FROM associations WHERE username = ?';
    db.query(checkQuery, [username], (err, results) => {
      if (err) {
        console.error('Error executing database query:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.length > 0) {
        // Username already exists 
        return res.status(409).json({ error: 'Username already exists' });
      } else {
        // Username is available; insert the new user into the database
        const insertQuery = 'INSERT INTO associations ( username, password, name, address, phone, emailAddress,area, surveyLink) VALUES (?, ?, ?, ?, ?, ?,?, ?)';
        db.query(insertQuery, [  username, password, association_name, address, phone, emailAddress,residentialArea, surveyLink], (err, results) => {
          if (err) {
            console.error('Error executing database query:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }
  
          // User registration successful
          return res.status(201).json({ message: 'User registered successfully' });
        });
      }
    });
  });


// Define a route to handle user login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Await the Promise from isValidCredentials
        const isValid = await isValidCredentials(username, password);
        
        if (isValid) {
            // Authentication successful
            return res.status(200).json({ message: 'Login successful', role: 'association', ok: true });
        } else {                                                                    
            // Authentication failed
            return res.status(401).json({ error: 'Invalid credentials', ok: false });
        }
    } catch (error) {
        // Handle errors like database errors
        return res.status(500).json({ error, ok: false });
    }
});

// Define a route to handle user update
router.patch('/update/:username', (req, res) => {
    const { username } = req.params;
    const { password, association_name, address, phone, emailAddress, surveyLink } = req.body;

    // Prepare an array to hold SQL set 
    let setClauses = [];
    let queryParams = [];

    if (password !== undefined) {
        setClauses.push('password = ?');
        queryParams.push(password);
    }
    // Repeat for other fields
    if (association_name !== undefined) {
        setClauses.push('association_name = ?');
        queryParams.push(association_name);
    }
    if (address !== undefined) {
        setClauses.push('address = ?');
        queryParams.push(address);
    }
    if (phone !== undefined) {
        setClauses.push('phone = ?');
        queryParams.push(phone);
    }
    if (emailAddress !== undefined) {
        setClauses.push('emailAddress = ?');
        queryParams.push(emailAddress);
    }
    if (surveyLink !== undefined) {
        setClauses.push('surveyLink = ?');
        queryParams.push(surveyLink);
    }

    if (setClauses.length === 0) {
        return res.status(400).json({ error: 'No update fields provided' });
    }

    // Join all set clauses using comma
    let setClauseString = setClauses.join(', ');

    // Add the username to the queryParams
    queryParams.push(username);

    // Construct the SQL query
    const updateQuery = `UPDATE associations SET ${setClauseString} WHERE username = ?`;

    // Execute the query
    db.query(updateQuery, queryParams, (err, results) => {
        if (err) {
            console.error('Error executing database query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if any row is affected
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        } else {
            // User update successful
            return res.status(200).json({ message: 'User updated successfully' });
        }
    });
}); 

router.get('/:username', (req, res) => {
    const username = req.params.username;

    const query = `
        SELECT *
        FROM associations
        WHERE Username = ?;
    `;

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error getting association details:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length > 0) {
            // Association details found
            const association = results[0];
            res.status(200).json(association);
        } else {
            // Association not found
            res.status(404).json({ error: 'Association not found' });
        }
    });
});


// function to validate user credentials
function isValidCredentials(username, password) {
    return new Promise((resolve, reject) => {
        const checkQuery = 'SELECT password FROM associations WHERE username = ?';
        db.query(checkQuery, [username], (err, results) => {
            if (err) {
                console.error('Error executing database query:', err);
                return reject('Internal server error');
            }

            if (results.length == 0) {
                return resolve(false);
            }

            let db_password = results[0].password;
            resolve(password === db_password);
        });
    });
}

module.exports = router;
