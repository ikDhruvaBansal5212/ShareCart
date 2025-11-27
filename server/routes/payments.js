const express = require('express');
const {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  getMyOrders,
  refundPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/status/:cartId', protect, getPaymentStatus);
router.get('/orders', protect, getMyOrders);
router.post('/refund', protect, refundPayment);

module.exports = router;
