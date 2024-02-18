// animals.js
const express = require('express');
const router = express.Router();
const db = require('../db'); 
const { notifyMatchingAdopters } = require('../services/notificationService');
const request = require('request');

router.get('/search', async (req, res) => {
    const { associationId, animalType, breed, age, residentialArea } = req.body;
  
    let query = 'SELECT * FROM animals WHERE 1=1';
    let queryParams = [];
  
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
  
    try {
      const animals = await new Promise((resolve, reject) => {
        db.query(query, queryParams, (err, results) => {
          if (err) {
            console.error('Error executing database query:', err);
            reject(err);
          }
          resolve(results);
        });
      });
  
      const searchResults = [];
      const promises = [];
  
      for (const animal of animals) {
        const animalType = animal.AnimalType || req.body.animalType;
        const breed = animal.Breed || req.body.breed;
  
        const promise = new Promise((resolve, reject) => {
          request.get({
            url: `https://api.api-ninjas.com/v1/${animalType}s?name=${encodeURIComponent(breed)}`,
            headers: {
              'X-Api-Key': 'itYKoba23rUcrZdeBmozvQ==7jeNQhY0On2LjzkY'
            },
          }, function(error, response, body) {
            if (error) reject(error);
            else if (response.statusCode !== 200) reject(`Error: ${response.statusCode}, ${body.toString('utf8')}`);
            else {
              const breedInfo = JSON.parse(body);
              const searchResult = { ...animal, breedInfo };
              searchResults.push(searchResult);
              resolve();
            }
          });
        });
  
        promises.push(promise);
      }
  
      // Wait for all API requests to complete
      await Promise.all(promises);
  
      res.json(searchResults);
  
    } catch (error) {
      console.error('Error during search:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
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