const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const OTP = require('../models/otpModel');

require('dotenv').config();

// Function to send OTP via SMS
async function sendOTP(req, res) {
    const phoneNumber = req.body.phoneNumber;
    const otpCode = generateOTP();

    // Define parameters for the SMS message
    const params = {
        Message: `Your OTP code is: ${otpCode}`,
        PhoneNumber: phoneNumber,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': 'String'
            }
        }
    };

    // Create an SNS client with the specified configuration
    const sns = new SNSClient({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        }
    });

    try {
        // Send the SMS message using the SNS client
        await sendSMSMessage(sns, params);

        // Save OTP to database or cache for verification later
        const otp = new OTP(phoneNumber, otpCode);
        // Save the OTP to database or cache, for example using Mongoose for MongoDB
        // const savedOTP = await otp.save(); 

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
}

// Function to verify OTP
async function verifyOTP(req, res) {
    const { phoneNumber, code } = req.body;
    // Fetch OTP from the database or cache
    // For example, using Mongoose to find the OTP from MongoDB
    // const otp = await OTP.findOne({ phoneNumber: phoneNumber }).exec();

    // For demonstration, directly comparing code
    if (otp && otp.code === code) {
        res.status(200).json({ message: "OTP verified successfully" });
    } else {
        res.status(400).json({ message: "Invalid OTP" });
    }
}

// Function to generate OTP
function generateOTP() {
    return Math.random().toString().substring(2, 8);
}

// Function to send SMS message using AWS SNS
async function sendSMSMessage(sns, params) {
    const command = new PublishCommand(params);
    await sns.send(command);
}

module.exports = { sendOTP, verifyOTP };
