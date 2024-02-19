// TwilioService.js
const dotenv = require("dotenv")
const path = require("path");

const envPath = path.resolve("server", "..", "config", "config.env");
dotenv.config({ path: envPath });

const accountSid = process.env.T_ACCOUNT_SID;
const authToken = process.env.T_AUTH_TOKEN;
const verifySid = process.env.T_VERIFY_SID;
const client = require("twilio")(accountSid, authToken);

class TwilioService {
  static async sendVerificationCode(phoneNumber) {
    try {
      const verification = await client.verify.v2.services(verifySid)
        .verifications.create({ to: phoneNumber, channel: "sms" });
      return verification.status;
    } catch (error) {
      console.error("Error sending verification code:", error);
      throw { status: 500, message: "Failed to send verification code. Please try again later." };
    }
  }

  static async checkVerificationCode(phoneNumber, otpCode) {
    try {
      const verificationCheck = await client.verify.v2.services(verifySid)
        .verificationChecks.create({ to: phoneNumber, code: otpCode });

      if (verificationCheck.status === "invalid") {
        throw { status: 400, message: "Invalid OTP code" };
      }

      return verificationCheck.status;
    } catch (error) {
      // Handle Twilio REST API 404 error specifically
      if (error.status === 404 && error.code === 20404) {
        console.error("Twilio resource not found. Check your Twilio service SID.");
        throw { status: 404, message: "Twilio resource not found. Check your Twilio service SID." };
      } else if (error.status === 400) {
        // Twilio returned a 400 status, indicating an invalid OTP
        console.error("Invalid OTP code provided.");
        throw { status: 400, message: "Invalid OTP code provided." };
      }

      console.error("Error checking verification code:", error);
      throw { status: 500, message: "Failed to check verification code. Please try again later." };
    }
  }
}

module.exports = TwilioService;
