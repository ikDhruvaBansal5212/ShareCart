const express = require('express');
const {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:cartId', protect, getMessages);
router.post('/', protect, sendMessage);
router.put('/:id', protect, editMessage);
router.delete('/:id', protect, deleteMessage);
router.get('/unread/:cartId', protect, getUnreadCount);

module.exports = router;
