const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection

// Define a route to handle user registration
router.post('/register', (req, res) => {
    const { username, password, type, fullName, familySituation, phone, emailAddress, age, residentialArea } = req.body;
  
    // Check if the username already exists in the database
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
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
        const insertQuery = 'INSERT INTO users ( username, password, type, fullName, familySituation, phone, emailAddress, age, residentialArea) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(insertQuery, [ username, password, type, fullName, familySituation, phone, emailAddress, age, residentialArea], (err, results) => {
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
        const isValid = await isValidCredentials(username, password);
        
        if (isValid) {
            // Authentication successful
            return res.status(200).json({ message: 'Login successful', role: 'user', ok: true });
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
    const { password, type, fullName, familySituation, phone, emailAddress, age, residentialArea } = req.body;

    // Prepare an array to hold SQL set 
    let setClauses = [];
    let queryParams = [];

    if (password !== undefined) {
        setClauses.push('password = ?');
        queryParams.push(password);
    }
    if (type !== undefined) {
        setClauses.push('type = ?');
        queryParams.push(type);
    }
    // Repeat for other fields
    if (fullName !== undefined) {
        setClauses.push('fullName = ?');
        queryParams.push(fullName);
    }
    if (familySituation !== undefined) {
        setClauses.push('familySituation = ?');
        queryParams.push(familySituation);
    }
    if (phone !== undefined) {
        setClauses.push('phone = ?');
        queryParams.push(phone);
    }
    if (emailAddress !== undefined) {
        setClauses.push('emailAddress = ?');
        queryParams.push(emailAddress);
    }
    if (age !== undefined) {
        setClauses.push('age = ?');
        queryParams.push(age);
    }
    if (residentialArea !== undefined) {
        setClauses.push('residentialArea = ?');
        queryParams.push(residentialArea);
    }

    if (setClauses.length === 0) {
        return res.status(400).json({ error: 'No update fields provided' });
    }

    // Join all set clauses using comma
    let setClauseString = setClauses.join(', ');

    // Add the username to the queryParams
    queryParams.push(username);

    // Construct the SQL query
    const updateQuery = `UPDATE users SET ${setClauseString} WHERE username = ?`;

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

// Route to update adopter preferences
router.post('/updatePreferences', (req, res) => {
    const { UserID, AnimalType, Gender, Breed, Age, ResidentialArea } = req.body;
    const { UserID, AnimalType, Gender, Breed, Age, ResidentialArea } = req.body;

    const updateQuery = `
        INSERT INTO AdopterPreferences (UserID, AnimalType, Gender, Breed, Age, ResidentialArea)
        VALUES (?, ?, ?, ?, ?, ?)
        INSERT INTO AdopterPreferences (UserID, AnimalType, Gender, Breed, Age, ResidentialArea)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        AnimalType = VALUES(AnimalType),
        Gender = VALUES(Gender),
        Gender = VALUES(Gender),
        Breed = VALUES(Breed),
        Age = VALUES(Age),
        ResidentialArea = VALUES(ResidentialArea)`;

    db.query(updateQuery, [UserID, AnimalType, Gender, Breed, JSON.stringify(Age), ResidentialArea], (err, results) => {
    db.query(updateQuery, [UserID, AnimalType, Gender, Breed, JSON.stringify(Age), ResidentialArea], (err, results) => {
        if (err) {
            console.error('Error executing database query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(200).json({ message: 'Adopter preferences updated successfully' });
    });
});

router.get('/:username', (req, res) => {
    const username = req.params.username;

    const query = `
        SELECT *
        FROM users
        WHERE Username = ?;
    `;

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error getting user details:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length > 0) {
            // Association details found
            const user = results[0];
            res.status(200).json({user});
        } else {
            // Association not found
            res.status(404).json({ error: 'User not found' });
        }
    });
});

router.get('/:username', (req, res) => {
    const username = req.params.username;

    const query = `
        SELECT *
        FROM users
        WHERE Username = ?;
    `;

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error getting user details:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length > 0) {
            // Association details found
            const user = results[0];
            res.status(200).json({user});
        } else {
            // Association not found
            res.status(404).json({ error: 'User not found' });
        }
    });
});

// Define a route to handle form submission
router.post('/submitForm', async (req, res) => {
    // Extract form data from the request body
    const { name, email, message } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Send email using the provided data
        await sendEmail('Contact Form Submission', `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
        `);

        // Respond with success message
        return res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error submitting form:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// function to validate user credentials
function isValidCredentials(username, password) {
    return new Promise((resolve, reject) => {
        const checkQuery = 'SELECT password FROM users WHERE username = ?';
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
