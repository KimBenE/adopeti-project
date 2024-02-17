// animals.js
const express = require('express');
const router = express.Router();
const db = require('../db'); 
const { notifyMatchingAdopters } = require('../services/notificationService');

// Define a route to handle animal search
router.get('/search', (req, res) => {
  // Extract query parameters
  const { associationId, animalType, breed, age, residentialArea } = req.query;

  // Start constructing the query
  let query = 'SELECT * FROM animals WHERE 1=1';
  let queryParams = [];

  // Dynamically append filters to the query if they are provided
  if (associationId) {
      query += ' AND AssociationID = ?';
      queryParams.push(associationId);
  }

  if (animalType) {
      query += ' AND AnimalType = ?';
      queryParams.push(animalType);
  }

  if (breed) {
      query += ' AND Breed = ?';
      queryParams.push(breed);
  }

  if (age) {
      query += ' AND Age = ?';
      queryParams.push(age);
  }

  if (residentialArea) {
      query += ' AND ResidentialArea = ?';
      queryParams.push(residentialArea);
  }

  query += ' AND Status = "available"';

  // Execute the query with the filters
  db.query(query, queryParams, (err, results) => {
      if (err) {
          console.error('Error executing database query:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      // Return the search results
      res.json(results);
  });
});

// Define a route to handle                                                   
router.post('/create', async (req, res) => {
  // Extract animal information from the request body
  const { associationId, animalType, name, breed, age, medicalHistory, residentialArea, imagePaths, videoPaths } = req.body;

  // Construct the SQL query to insert the new animal profile into the database
  const insertQuery = `
      INSERT INTO Animals (
          AssociationID, AnimalType, Name, Breed, Age, MedicalHistory, ResidentialArea, ImagePaths, VideoPaths
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  // Execute the query
  try {
    const result = await db.query(insertQuery, [associationId, animalType, name, breed, age, medicalHistory, residentialArea, imagePaths, videoPaths]);
    const newAnimal = {  name, animalType, breed, age, residentialArea };
  
    // After successfully adding the animal, check for matching adopter preferences
    await notifyMatchingAdopters(newAnimal);

    res.status(201).json({ message: 'Animal profile created successfully', animalId: result.insertId }); 
  } catch (err) {
    console.error('Error creating animal profile:', err);
    res.status(500).json({ error: 'Internal server error' });    
  }
 
});


module.exports = router;