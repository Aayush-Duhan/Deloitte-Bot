const mongoose = require('mongoose');
const Order = require('../models/Order');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Generate random order ID
const generateOrderId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let result = 'ORD-';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  for (let i = 0; i < 2; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return result;
};

// Generate random date within last 7 days
const getRandomDate = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Sample company names
const companies = [
  'Tech Manufacturing Ltd.',
  'Industrial Solutions Co.',
  'Advanced Systems Ltd.',
  'Global Electronics Corp.',
  'Precision Parts Inc.',
  'Quality Mechanics Co.',
  'Smart Manufacturing Inc.',
  'Future Industries Ltd.',
  'Elite Engineering Corp.',
  'Modern Manufacturing Co.'
];

// Sample items
const items = [
  { name: 'Circuit Board A1', price: 150 },
  { name: 'Power Supply Unit', price: 200 },
  { name: 'LED Display Module', price: 300 },
  { name: 'Cooling System', price: 250 },
  { name: 'Memory Module', price: 180 },
  { name: 'Processing Unit', price: 450 },
  { name: 'Sensor Array', price: 120 },
  { name: 'Control Panel', price: 350 },
  { name: 'Battery Pack', price: 280 },
  { name: 'Network Module', price: 220 }
];

// Generate order with pending status
const generateOrder = (userId) => {
  const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
  const orderItems = [];
  let total = 0;

  for (let i = 0; i < numItems; i++) {
    const item = items[Math.floor(Math.random() * items.length)];
    const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
    orderItems.push({
      name: item.name,
      quantity: quantity,
      price: item.price,
      total: item.price * quantity
    });
    total += item.price * quantity;
  }

  const receivedDate = getRandomDate();

  return {
    userId: userId,
    orderId: generateOrderId(),
    companyName: companies[Math.floor(Math.random() * companies.length)],
    status: 'pending',
    items: orderItems,
    total: total,
    emailDetails: {
      receivedAt: receivedDate,
      subject: 'New Manufacturing Order',
      content: 'Order details attached'
    }
  };
};

// Seed orders
const seedOrders = async (userId) => {
  try {
    // Clear existing orders
    await Order.deleteMany({ userId: userId });

    // Generate 20 pending orders
    const orders = Array(20).fill().map(() => generateOrder(userId));
    
    // Insert orders
    const savedOrders = await Order.insertMany(orders);
    
    console.log('Successfully seeded orders:');
    console.log('Total orders:', savedOrders.length);
    console.log('Pending orders:', savedOrders.filter(o => o.status === 'pending').length);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding orders:', error);
    mongoose.connection.close();
  }
};

// Use the test user ID we created earlier
const USER_ID = '679f855aaeb4e51c22cf4403';  // Updated user ID

if (!USER_ID) {
  console.error('Please provide a valid USER_ID at the bottom of this script');
  process.exit(1);
}

seedOrders(USER_ID);
