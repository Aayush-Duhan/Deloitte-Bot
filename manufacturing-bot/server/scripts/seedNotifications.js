const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const Order = require('../models/Order');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Get notification message based on order status
const getNotificationMessage = (order) => {
  return {
    message: `Your order ${order.orderId} has been received. Please review and confirm the order details for ${order.items.length} items worth $${order.total}.`,
    type: 'confirmation_required'
  };
};

// Generate random date within last 7 days
const getRandomDate = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate notification for an order
const generateNotification = (userId, order) => {
  const notification = getNotificationMessage(order);
  return {
    userId: userId,
    type: notification.type,
    message: notification.message,
    read: false, // All notifications start as unread
    relatedOrder: order._id,
    createdAt: order.emailDetails.receivedAt // Match the order's received date
  };
};

// Seed notifications
const seedNotifications = async (userId) => {
  try {
    // Clear existing notifications
    await Notification.deleteMany({ userId: userId });

    // Get all orders for this user
    const orders = await Order.find({ userId: userId, status: 'pending' });
    
    if (orders.length === 0) {
      console.log('No pending orders found. Please run seedOrders.js first.');
      mongoose.connection.close();
      return;
    }

    // Generate one notification per order
    const notifications = orders.map(order => generateNotification(userId, order));

    // Insert notifications
    const savedNotifications = await Notification.insertMany(notifications);
    
    console.log('Successfully seeded notifications:');
    console.log('Total notifications:', savedNotifications.length);
    console.log('Unread notifications:', savedNotifications.filter(n => !n.read).length);
    console.log('Notifications requiring confirmation:', savedNotifications.filter(n => n.type === 'confirmation_required').length);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding notifications:', error);
    mongoose.connection.close();
  }
};

// Use the test user ID we created earlier
const USER_ID = '679f9604be05f6620a98fe1a';

if (!USER_ID) {
  console.error('Please provide a valid USER_ID at the bottom of this script');
  process.exit(1);
}

seedNotifications(USER_ID);
