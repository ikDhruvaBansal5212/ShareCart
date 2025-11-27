const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['blinkit', 'zepto', 'swiggy', 'bigbasket']
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    splitAmount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentId: {
      type: String,
      default: null
    },
    razorpayOrderId: {
      type: String,
      default: null
    },
    razorpayPaymentId: {
      type: String,
      default: null
    },
    razorpaySignature: {
      type: String,
      default: null
    },
    paidAt: {
      type: Date,
      default: null
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryCharge: {
    type: Number,
    required: true
  },
  platformOrderId: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'payment_pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  deliveryLocation: {
    address: String,
    city: String,
    pincode: String,
    coordinates: [Number]
  },
  orderPlacedAt: {
    type: Date,
    default: null
  },
  estimatedDeliveryTime: {
    type: Date,
    default: null
  },
  actualDeliveryTime: {
    type: Date,
    default: null
  },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Generate unique order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.orderNumber = `SC${timestamp}${random}`;
  }
  next();
});

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ cart: 1 });
orderSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Order', orderSchema);
