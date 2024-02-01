// TwilioController.js
const TwilioService = require("../models/TwilioService");

class TwilioController {
  static async sendVerification(req, res) {
    const phonenumber = req.body.phonenumber;

    // Check if phoneNumber is present in the request body
    if (!phonenumber) {
      return res.status(400).json({ error: "Phone number is required in the request body." });
    }

    try {
      const status = await TwilioService.sendVerificationCode(phonenumber);
      res.json({ status });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async checkVerification(req, res) {
    const phonenumber = req.body.phonenumber;
    const otp = req.body.otp;
    // Check if both phoneNumber and otpCode are present in the request body
    if (!phonenumber || !otp) {
      return res.status(400).json({ error: "Both phone number and OTP code are required in the request body." });
    }
    try {
      const status = await TwilioService.checkVerificationCode(phonenumber, otp);
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
