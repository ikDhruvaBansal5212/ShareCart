const express = require('express');
const {
  createReview,
  getUserReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  reportReview,
  getPendingReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createReview);
router.get('/user/:userId', getUserReviews);
router.get('/my', protect, getMyReviews);
router.get('/pending', protect, getPendingReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/report', protect, reportReview);

module.exports = router;
