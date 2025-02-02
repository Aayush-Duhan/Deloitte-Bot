const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const createTestUser = async () => {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists with ID:', existingUser._id.toString());
      mongoose.connection.close();
      return;
    }

    // Create a new test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = new User({
      email: 'test@example.com',
      password: hashedPassword,
      companyName: 'Test Company',
      purchasingEmail: 'purchasing@example.com',
      role: 'admin',
      companyDetails: {
        address: '123 Test Street',
        phone: '555-0123',
        website: 'www.testcompany.com',
        industry: 'Manufacturing'
      },
      isVerified: true,
      isActive: true,
      lastLogin: new Date()
    });

    await user.save();
    console.log('Test user created successfully with ID:', user._id.toString());
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestUser();
