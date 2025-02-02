const nodemailer = require('nodemailer');
const { createOAuth2Transporter } = require('./gmailService');

// Create SMTP transporter
const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

let oauth2Transporter = null;

const sendOTP = async (email, otp, useOAuth2 = false) => {
  try {
    const transporter = useOAuth2 ? oauth2Transporter : smtpTransporter;
    
    if (!transporter) {
      console.error('No email transporter available');
      return false;
    }

    await transporter.sendMail({
      from: `Manufacturing Bot <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Login OTP for Manufacturing Bot',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; text-align: center;">Your OTP Code</h1>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="font-size: 16px; color: #374151;">Use the following OTP to login to your account:</p>
            <h2 style="font-size: 32px; color: #1f2937; letter-spacing: 5px; margin: 20px 0;">${otp}</h2>
            <p style="color: #6b7280; font-size: 14px;">This OTP will expire in 10 minutes.</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
            If you didn't request this OTP, please ignore this email.
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Initialize OAuth2 transporter
const initializeOAuth2 = async (tokens) => {
  try {
    oauth2Transporter = await createOAuth2Transporter(tokens);
    return true;
  } catch (error) {
    console.error('OAuth2 initialization error:', error);
    return false;
  }
};

module.exports = { 
  sendOTP,
  initializeOAuth2
}; 