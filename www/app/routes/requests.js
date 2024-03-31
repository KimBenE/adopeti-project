// animals.js
const express = require('express');
const router = express.Router();
const db = require('../db'); 
const { sendRequestAdoptionEmail, sendRequestGiveawayEmail } = require('../services/notificationService');

// Search for available animals
router.post('/adoption_requests', async (req, res) => {
    const { associationId, approvalStatus } = req.body;
    let query = `SELECT * FROM adoptionRequests WHERE ApprovalStatus='${approvalStatus}' AND AssociationID=${associationId}`;
  
    try {
        const requests = await new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error executing database query:', err);
                    reject(err);
                }
                resolve(results);
            });
        });

        // Send the requests back to the client
        res.json({ requests });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/giveaway_requests', async (req, res) => {
    const { approvalStatus } = req.body;
    let query = `SELECT * FROM giveuprequests WHERE ApprovalStatus='${approvalStatus}'`;
  
    try {
        const requests = await new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error executing database query:', err);
                    reject(err);
                }
                resolve(results);
            });
        });

        // Send the requests back to the client
        res.json({ requests });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/update-adoption-request/:requestId', (req, res) => {
    const { requestId } = req.params;
    const { approvalStatus, animalId, emailAddress, userId } = req.body;
    const surveyLink = 'http://adopeti.xyz/assets/html/sadna_Survey_to_Adopter.html';

    if (approvalStatus === null) {
        return res.status(400).json({ error: 'No update fields provided' });
    }

    // Add the username to the queryParams
    let queryParams = [];
    queryParams.push(requestId);

    // Construct the SQL queries
    const updateQuery = `UPDATE adoptionrequests SET ApprovalStatus='${approvalStatus}' WHERE requestID = ?`;
    const selectQuery = `SELECT * from animals WHERE AnimalID=${animalId}`;
    const statusUpdateQuery = `UPDATE animals SET Status='adopted' WHERE AnimalID = ${animalId}`;

    // Execute the update queries
    db.query(statusUpdateQuery, (err, results) => {
        if (err) {
            console.error('Error executing database query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    
        // Check if any row is affected
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: '' });
        } else {
            // Animal update successful
            db.query(updateQuery, queryParams, (err, results) => {
                if (err) {
                    console.error('Error executing database query:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
    
                // Check if any row is affected
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: '' });
                }

            });
        }
    });


    db.query(selectQuery, async function (err, result, fields) {
        if (err) {
            console.error('Error executing database query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        console.log("Select Results:", result);

        if (result.length > 0) {
            const animal = result[0];
            sendRequestAdoptionEmail(emailAddress, animal, userId, approvalStatus, surveyLink);
        }

        // Send the final response here
        return res.status(200).json({ message: 'Request updated successfully' });
    });
});

router.patch('/update-giveaway-request/:requestId', (req, res) => {
    const { requestId } = req.params;
    const { approvalStatus, associationId, animalType, gender, name, breed, age, medicalHistory, residentialArea, description, encodedImages, emailAddress, userId } = req.body;

    if (approvalStatus === null) {
        return res.status(400).json({ error: 'No update fields provided' });
    }

    if (approvalStatus === 'denied') {
        return res.status(200).json({ message: 'No changes' });
    }

    // Construct the SQL query
    const updateQuery = `UPDATE giveuprequests SET ApprovalStatus='${approvalStatus}' WHERE requestID = ${requestId} `;

    // Execute the query
    if (approvalStatus === 'approved') {
        db.query(updateQuery, (err, results) => {
            if (err) {
                console.error('Error executing database query:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            // Request update successful
            const animal = { associationId, animalType, gender, name, breed, age, medicalHistory, residentialArea, description, encodedImages };
            sendRequestGiveawayEmail(emailAddress, animal, userId, approvalStatus);
            return res.status(200).json({ message: 'Request updated successfully' });
        });
    }
});

module.exports = router;

  
