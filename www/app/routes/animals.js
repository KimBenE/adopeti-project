// animals.js
const express = require('express');
const router = express.Router();
const db = require('../db'); 
const { notifyMatchingAdopters } = require('../services/notificationService');
const request = require('request');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


router.get('/search', async (req, res) => {
    const { associationId, animalType, gender, breed, age, residentialArea } = req.body;
  
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

    if (gender) {
      query += ' AND Gender = ?';
      queryParams.push(gender);
    }
  
    if (breed) {
      query += ' AND Breed = ?';
      queryParams.push(breed);
    }
  
    if (age) {
      query += ' AND Age <= ? AND Age >= ?';
      queryParams.push(age[1]);
      queryParams.push(age[0]);
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
  
  
router.post('/create', async (req, res) => {
  // Extract animal information from the request body
  let { associationId, animalType, gender, name, breed, age, medicalHistory, residentialArea, description, imagePaths, videoPaths } = req.body;
  imagePaths = imagePaths.map(fileName => `('${fileName}')`).join(',');
  videoPaths = videoPaths.map(fileName => `('${fileName}')`).join(',');

  // insert the new animal profile into the database
  const insertQuery = `
      INSERT INTO Animals (
          AssociationID, AnimalType, Gender, Name, Breed, Age, MedicalHistory, ResidentialArea, description, ImagePaths, VideoPaths
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const selectQuery = `SELECT AnimalID from animals order by CreatedAt desc limit 1`;

  try {
    // Execute the insert query
    const insertResult = await db.query(insertQuery, [associationId, animalType, gender, name, breed, age, medicalHistory, residentialArea,description, imagePaths, videoPaths]);
        
    // Execute the select query to get the last inserted AnimalID
    db.query(selectQuery, async function (err, result, fields) {
      console.log("Select Results:", result);

      if (result.length > 0) {
        const animalId = result[0].AnimalID;
        const newAnimal = {  name, animalType, gender, breed, age, residentialArea, description, imagePaths,  animalId};
  
        // After successfully adding the animal, check for matching adopter preferences
        await notifyMatchingAdopters(newAnimal);
  
        res.status(201).json({animalId: animalId }); 
      } else {
        throw new Error("No animal ID found in the select query results");
      }
    });

  } catch (err) {
    console.error('Error creating animal profile:', err);
    res.status(500).json({ error: 'Internal server error' });    
  }
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const fileType = file.fieldname; // 'image' or 'video'

    // Check if id exists
    if (req.params.id) {
      const id = req.params.id;

      // destination folder path
      const folderPath = `uploads/${fileType}/${id}`;

      // Create the folder if it doesn't exist
      fs.mkdirSync(folderPath, { recursive: true });

      // Pass the folder path
      cb(null, folderPath);
    } else {
      // Handle the case when id is missing in the request
      cb(new Error('Missing id field in the request'), null);
    }
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname); 
  }
});

// Initialize Multer middleware
const upload = multer({ storage: storage });

// Route to handle file uploads
router.post('/upload/:id', upload.fields([{ name: 'image', maxCount: 10 }, { name: 'video', maxCount: 10 }]), (req, res) => {
  // Files are uploaded and stored in the 'uploads/' folder
  console.log('Files uploaded successfully');
  res.send('Files uploaded successfully');
});

module.exports = router;
