const Message = require('../models/Message');
const Cart = require('../models/Cart');

// @desc    Get messages for a cart
// @route   GET /api/messages/:cartId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { limit = 50, page = 1 } = req.query;

    // Check if user is a member of the cart
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const isMember = cart.members.some(
      member => member.user.toString() === req.user.id
    ) || cart.creator.toString() === req.user.id;

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this cart'
      });
    }

    // Get messages
    const messages = await Message.find({
      cart: cartId,
      isDeleted: false
    })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Mark messages as read
    await Message.updateMany(
      {
        cart: cartId,
        'readBy.user': { $ne: req.user.id }
      },
      {
        $push: {
          readBy: {
            user: req.user.id,
            readAt: new Date()
          }
        }
      }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages.reverse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { cartId, content, messageType, imageUrl, location } = req.body;

    // Check if user is a member of the cart
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const isMember = cart.members.some(
      member => member.user.toString() === req.user.id
    ) || cart.creator.toString() === req.user.id;

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this cart'
      });
    }

    // Create message
    const message = await Message.create({
      cart: cartId,
      sender: req.user.id,
      messageType: messageType || 'text',
      content: content,
      imageUrl: imageUrl,
      location: location,
      readBy: [{
        user: req.user.id,
        readAt: new Date()
      }]
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar');

    // Emit socket event
    if (global.io) {
      global.io.to(`cart_${cartId}`).emit('message:new', populatedMessage);
    }

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Edit a message
// @route   PUT /api/messages/:id
// @access  Private
exports.editMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this message'
      });
    }

    message.content = req.body.content;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar');

    // Emit socket event
    if (global.io) {
      global.io.to(`cart_${message.cart}`).emit('message:edited', populatedMessage);
    }

    res.status(200).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    message.isDeleted = true;
    await message.save();

    // Emit socket event
    if (global.io) {
      global.io.to(`cart_${message.cart}`).emit('message:deleted', {
        messageId: message._id
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread/:cartId
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Message.countDocuments({
      cart: req.params.cartId,
      'readBy.user': { $ne: req.user.id },
      isDeleted: false
    });

    res.status(200).json({
      success: true,
      count: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
