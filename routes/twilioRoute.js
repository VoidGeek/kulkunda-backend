const express = require('express');
const router = express.Router();
const TwilioController = require('../controllers/twilioController');

router.post("/send-verification", TwilioController.sendVerification);
router.post("/check-verification", TwilioController.checkVerification);

module.exports = router;