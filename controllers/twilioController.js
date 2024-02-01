// TwilioController.js
const TwilioService = require("../models/TwilioService");

class TwilioController {
  static async sendVerification(req, res) {
    const phoneNumber = req.body.phoneNumber;

    // Check if phoneNumber is present in the request body
    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is required in the request body." });
    }

    try {
      const status = await TwilioService.sendVerificationCode(phoneNumber);
      res.json({ status });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async checkVerification(req, res) {
    const phoneNumber = req.body.phoneNumber;
    const otpCode = req.body.otpCode;

    // Check if both phoneNumber and otpCode are present in the request body
    if (!phoneNumber || !otpCode) {
      return res.status(400).json({ error: "Both phone number and OTP code are required in the request body." });
    }

    try {
      const status = await TwilioService.checkVerificationCode(phoneNumber, otpCode);

      // Check if the OTP is invalid
      if (status === "invalid") {
        return res.status(400).json({ error: "Invalid OTP code." });
      }

      res.json({ status });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = TwilioController;
