const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendOTP } = require('../utils/emailService');
const jwt = require('jsonwebtoken');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register and send OTP
router.post('/register', async (req, res) => {
  try {
    const { companyName, purchasingEmail, password } = req.body;

    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email: purchasingEmail });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'User already exists and is verified' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingUser && !existingUser.isVerified) {
      // Update existing unverified user
      existingUser.companyName = companyName;
      existingUser.password = hashedPassword;
      existingUser.otp = {
        code: otp,
        expiresAt: otpExpiry
      };
      await existingUser.save();
    } else {
      // Create new user
      const user = new User({
        email: purchasingEmail,
        password: hashedPassword,
        companyName,
        purchasingEmail,
        otp: {
          code: otp,
          expiresAt: otpExpiry
        }
      });
      await user.save();
    }

    // Send OTP via email
    const emailSent = await sendOTP(purchasingEmail, otp);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP' });
    }

    res.status(201).json({ 
      message: 'Registration successful. Please verify OTP.',
      email: purchasingEmail // Send back email for OTP verification
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      // Generate new OTP for unverified users
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      
      user.otp = {
        code: otp,
        expiresAt: otpExpiry
      };
      await user.save();

      await sendOTP(email, otp);
      return res.status(403).json({ 
        message: 'Account not verified. New OTP sent.',
        requiresVerification: true 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        companyName: user.companyName,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        email: user.email,
        companyName: user.companyName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is valid and not expired
    if (!user.otp || user.otp.code !== otp || user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark user as verified and update login time
    user.isVerified = true;
    user.lastLogin = new Date();
    user.otp = undefined;
    await user.save();

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        companyName: user.companyName,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        email: user.email,
        companyName: user.companyName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update company details
router.post('/update-company', async (req, res) => {
  try {
    const { email, companyDetails } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.companyDetails = {
      ...user.companyDetails,
      ...companyDetails
    };
    await user.save();

    res.json({ 
      message: 'Company details updated successfully',
      companyDetails: user.companyDetails
    });
  } catch (error) {
    console.error('Update company details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 