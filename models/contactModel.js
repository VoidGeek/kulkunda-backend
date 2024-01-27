// contactModel.js

<<<<<<< HEAD
const mongoose=require("mongoose")
=======
const mongoose = require('mongoose');
>>>>>>> 5b1b7dd766cad3e298068fdafda3e8a93ea1d827

// Define the schema for the contact form
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now, expires: 2592000 },
});

// Create a model using the schema
const Contact = mongoose.model('Contact', contactSchema);

module.exports=Contact;
