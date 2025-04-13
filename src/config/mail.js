const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;

try {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail user from .env
      pass: process.env.GMAIL_PASS, // Your Gmail app password from .env
    },
  });

  // Test the connection to the mail server
  transporter.verify((error, success) => {
    if (error) {
      console.error('Error connecting to the mail server:', error);
    } else {
      console.log('Mail server is ready to send messages.');
    }
  });
} catch (error) {
  console.error('Failed to create transporter:', error);
}

module.exports = transporter;
