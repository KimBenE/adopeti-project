// Import Mongoose
const mongoose = require('mongoose');

// Define the Animal Schema
const animalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  species: String,
  age: Number,
  healthStatus: {
    type: String,
    enum: ['healthy', 'injured', 'sick'],
  },
  behavioralTraits: [String],
  medicalHistory: String,
  images: [String],
  videos: [String],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (assuming you have a User model)
  },
});

// Create the Animal model
const Animal = mongoose.model('Animal', animalSchema);

// Export the Animal model for use in other parts of your application
module.exports = Animal;
