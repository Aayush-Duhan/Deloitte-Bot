const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Get first user from the database
const getFirstUser = async () => {
  try {
    const user = await User.findOne({});
    if (user) {
      console.log('User ID:', user._id.toString());
      console.log('User Email:', user.email);
      console.log('User Company:', user.companyName);
    } else {
      console.log('No users found in the database');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

getFirstUser();
