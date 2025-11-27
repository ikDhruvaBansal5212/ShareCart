const express = require('express');
const {
  getCarts,
  getCart,
  createCart,
  joinCart,
  leaveCart,
  updateCart,
  deleteCart,
  getMyCarts
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getCarts)
  .post(protect, createCart);

router.get('/my/all', protect, getMyCarts);

router.route('/:id')
  .get(protect, getCart)
  .put(protect, updateCart)
  .delete(protect, deleteCart);

router.post('/:id/join', protect, joinCart);
router.post('/:id/leave', protect, leaveCart);

module.exports = router;
