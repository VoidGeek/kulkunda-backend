const express = require('express');
const app = express();
const cors = require('cors');
const { parse } = require('cookie');  // Import parse from next-cookies
const userrouter = require('./routes/userrouter.js');
const contactRoutes = require('./routes/contactRoute');
const sevaRoutes = require('./routes/sevaRoute');
const sevalistRoutes = require('./routes/sevalistroute');
const newsupdateRoutes = require('./routes/newsupdatesroute');
const galleryRoutes = require('./routes/galleryRoute');
const twilioRoutes = require('./routes/twilioRoute.js');

app.use(express.json());

const corsOptions = {
  origin: 'http://seva.basavanamoolatemple.in', // Replace with your actual allowed origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // Use cors middleware with options

app.use('/api/user', userrouter);
app.use('/api/contact', contactRoutes);
app.use('/api/seva', sevaRoutes);
app.use('/api/sevalist', sevalistRoutes);
app.use('/api/newsupdate', newsupdateRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/otp', twilioRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({ success: false, statusCode, message });
});

module.exports = app;
