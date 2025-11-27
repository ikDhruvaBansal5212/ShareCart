const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order for split payment
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { cartId } = req.body;

    const cart = await Cart.findById(cartId)
      .populate('creator')
      .populate('members.user');

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if user is a member of the cart
    const isMember = cart.members.some(
      member => member.user._id.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this cart'
      });
    }

    // Calculate split amount for this user
    const splitAmount = cart.calculateSplitAmount();

    // Create order in database first
    let order = await Order.findOne({ cart: cartId });

    if (!order) {
      order = await Order.create({
        cart: cartId,
        platform: cart.platform,
        members: cart.members.map(member => ({
          user: member.user._id,
          splitAmount: member.splitAmount
        })),
        totalAmount: cart.deliveryCharge,
        deliveryCharge: cart.deliveryCharge,
        deliveryLocation: cart.location,
        status: 'payment_pending'
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: splitAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: `${order.orderNumber}_${req.user.id}`,
      notes: {
        orderId: order._id.toString(),
        cartId: cartId,
        userId: req.user.id
      }
    });

    // Update order with Razorpay order ID for this member
    const memberIndex = order.members.findIndex(
      m => m.user.toString() === req.user.id
    );

    if (memberIndex !== -1) {
      order.members[memberIndex].razorpayOrderId = razorpayOrder.id;
      await order.save();
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: splitAmount,
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID,
        orderNumber: order.orderNumber
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update order
    const order = await Order.findOne({ cart: cartId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update member payment status
    const memberIndex = order.members.findIndex(
      m => m.user.toString() === req.user.id
    );

    if (memberIndex !== -1) {
      order.members[memberIndex].paymentStatus = 'paid';
      order.members[memberIndex].razorpayPaymentId = razorpay_payment_id;
      order.members[memberIndex].razorpaySignature = razorpay_signature;
      order.members[memberIndex].paidAt = new Date();
    }

    // Check if all members have paid
    const allPaid = order.members.every(m => m.paymentStatus === 'paid');

    if (allPaid) {
      order.status = 'confirmed';
      order.orderPlacedAt = new Date();

      // Update cart status
      await Cart.findByIdAndUpdate(cartId, { status: 'ordering' });

      // Update user stats
      const user = await User.findById(req.user.id);
      user.totalOrders += 1;
      user.totalSavings += order.deliveryCharge / order.members.length;
      await user.save();
    }

    await order.save();

    // Emit socket event
    if (global.io) {
      global.io.to(`cart_${cartId}`).emit('payment:completed', {
        userId: req.user.id,
        allPaid: allPaid,
        order: order
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        allPaid: allPaid,
        order: order
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payment status for a cart
// @route   GET /api/payments/status/:cartId
// @access  Private
exports.getPaymentStatus = async (req, res, next) => {
  try {
    const order = await Order.findOne({ cart: req.params.cartId })
      .populate('members.user', 'name avatar');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const paymentStatus = order.members.map(member => ({
      user: member.user,
      splitAmount: member.splitAmount,
      paymentStatus: member.paymentStatus,
      paidAt: member.paidAt
    }));

    const totalPaid = order.members.filter(m => m.paymentStatus === 'paid').length;
    const totalMembers = order.members.length;

    res.status(200).json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        totalPaid: totalPaid,
        totalMembers: totalMembers,
        allPaid: totalPaid === totalMembers,
        paymentStatus: paymentStatus,
        orderStatus: order.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's order history
// @route   GET /api/payments/orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      'members.user': req.user.id
    })
      .populate('cart')
      .populate('members.user', 'name avatar rating')
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map(order => {
      const myPayment = order.members.find(
        m => m.user._id.toString() === req.user.id
      );

      return {
        ...order.toObject(),
        myPayment: myPayment
      };
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: formattedOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Refund payment (admin or in case of cancellation)
// @route   POST /api/payments/refund
// @access  Private
exports.refundPayment = async (req, res, next) => {
  try {
    const { orderId, userId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const member = order.members.find(m => m.user.toString() === userId);

    if (!member || member.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment not found or already refunded'
      });
    }

    // Create refund in Razorpay
    const refund = await razorpay.payments.refund(member.razorpayPaymentId, {
      amount: member.splitAmount * 100,
      notes: {
        reason: 'Order cancelled',
        orderId: orderId
      }
    });

    // Update member status
    member.paymentStatus = 'refunded';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Refund initiated successfully',
      data: refund
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
