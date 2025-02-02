const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'rejected', 'confirmed'],
    default: 'pending'
  },
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  total: {
    type: Number,
    required: true
  },
  emailDetails: {
    subject: String,
    receivedAt: Date,
    processedAt: Date
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema); 