const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Get user's orders (paginated with search)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.trim();
    const skip = (page - 1) * limit;

    let query = { userId: req.user.userId };

    // Add search conditions if search term exists
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
        { 'items.name': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .sort({ 'emailDetails.receivedAt': -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments(query);
    
    res.json({ 
      orders,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        hasMore: skip + orders.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order details
router.get('/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.orderId,
      userId: req.user.userId 
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/:orderId/status', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'rejected', 'confirmed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find and update order
    const order = await Order.findOne({ _id: orderId, userId: req.user.userId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // Create notification for status change
    const notification = new Notification({
      userId: req.user.userId,
      type: 'order',
      message: `Order ${order.orderId} status changed from ${oldStatus} to ${status}`,
      relatedOrder: order._id
    });
    await notification.save();

    res.json({ order, notification });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm order
router.post('/:orderId/confirm', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find and update order
    const order = await Order.findOne({ _id: orderId, userId: req.user.userId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order can only be confirmed when pending' });
    }

    order.status = 'confirmed';
    await order.save();

    // Update existing notification
    await Notification.findOneAndUpdate(
      { relatedOrder: order._id, type: 'confirmation_required' },
      { 
        $set: {
          type: 'order_confirmed',
          message: `Order ${order.orderId} has been confirmed and will be processed soon.`
        }
      }
    );

    res.json({ 
      success: true,
      message: 'Order confirmed successfully',
      order 
    });
  } catch (error) {
    console.error('Error confirming order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject order
router.post('/:orderId/reject', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find and update order
    const order = await Order.findOne({ _id: orderId, userId: req.user.userId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order can only be rejected when pending' });
    }

    order.status = 'rejected';
    await order.save();

    // Update existing notification
    await Notification.findOneAndUpdate(
      { relatedOrder: order._id, type: 'confirmation_required' },
      { 
        $set: {
          type: 'order_rejected',
          message: `Order ${order.orderId} has been rejected.`
        }
      }
    );

    res.json({ 
      success: true,
      message: 'Order rejected successfully',
      order 
    });
  } catch (error) {
    console.error('Error rejecting order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;