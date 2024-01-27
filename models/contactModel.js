// contactModel.js

const mongoose = require('mongoose');

// Define the schema for the contact form
const contactSchema = new Schema({
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
const Contact = model('Contact', contactSchema);

export default Contact;
