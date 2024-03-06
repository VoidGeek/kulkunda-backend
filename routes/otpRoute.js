const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../controllers/otpController');

// Route to send OTP via SMS
router.post('/send-otp', sendOTP);

// Route to verify OTP
router.post('/verify-otp', verifyOTP);

module.exports = router;
