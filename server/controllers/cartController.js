const Cart = require('../models/Cart');
const User = require('../models/User');
const axios = require('axios');

// Helper function to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// @desc    Get all active carts near user
// @route   GET /api/carts
// @access  Private
exports.getCarts = async (req, res, next) => {
  try {
    const { platform, maxDistance, city } = req.query;
    const userLocation = req.user.location.coordinates;

    // Build query
    let query = {
      status: { $in: ['active', 'full'] },
      isPublic: true,
      expiresAt: { $gt: new Date() },
      creator: { $ne: req.user.id }
    };

    // Filter by platform
    if (platform) {
      query.platform = platform.toLowerCase();
    }

    // Filter by city
    if (city) {
      query['location.city'] = city;
    }

    // Get carts
    let carts = await Cart.find(query)
      .populate('creator', 'name avatar rating phone')
      .populate('members.user', 'name avatar rating')
      .sort({ createdAt: -1 })
      .limit(50);

    // Calculate distance and filter
    carts = carts.map(cart => {
      const distance = calculateDistance(
        userLocation[1], userLocation[0],
        cart.location.coordinates[1], cart.location.coordinates[0]
      );
      return {
        ...cart.toObject(),
        distance: Math.round(distance * 10) / 10
      };
    });

    // Filter by maxDistance
    if (maxDistance) {
      carts = carts.filter(cart => cart.distance <= parseFloat(maxDistance));
    } else {
      carts = carts.filter(cart => cart.distance <= cart.maxDistance);
    }

    // Sort by distance
    carts.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      count: carts.length,
      data: carts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single cart
// @route   GET /api/carts/:id
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.id)
      .populate('creator', 'name avatar rating phone email')
      .populate('members.user', 'name avatar rating phone email');

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Calculate distance from user
    const userLocation = req.user.location.coordinates;
    const distance = calculateDistance(
      userLocation[1], userLocation[0],
      cart.location.coordinates[1], cart.location.coordinates[0]
    );

    res.status(200).json({
      success: true,
      data: {
        ...cart.toObject(),
        distance: Math.round(distance * 10) / 10
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new cart
// @route   POST /api/carts
// @access  Private
exports.createCart = async (req, res, next) => {
  try {
    // Add user as creator
    req.body.creator = req.user.id;
    
    // Add creator as first member
    req.body.members = [{
      user: req.user.id,
      splitAmount: req.body.deliveryCharge
    }];

    const cart = await Cart.create(req.body);

    const populatedCart = await Cart.findById(cart._id)
      .populate('creator', 'name avatar rating phone')
      .populate('members.user', 'name avatar rating');

    // Emit socket event (will be handled by socket.io)
    if (global.io) {
      global.io.emit('cart:created', populatedCart);
    }

    res.status(201).json({
      success: true,
      data: populatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Join a cart
// @route   POST /api/carts/:id/join
// @access  Private
exports.joinCart = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if cart is expired
    if (cart.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This cart has expired'
      });
    }

    // Check if cart is active
    if (!['active', 'full'].includes(cart.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot join this cart'
      });
    }

    // Check distance
    const userLocation = req.user.location.coordinates;
    const distance = calculateDistance(
      userLocation[1], userLocation[0],
      cart.location.coordinates[1], cart.location.coordinates[0]
    );

    if (distance > cart.maxDistance) {
      return res.status(400).json({
        success: false,
        message: `You are ${distance.toFixed(1)}km away. Maximum allowed distance is ${cart.maxDistance}km`
      });
    }

    // Add member
    await cart.addMember(req.user.id);

    const updatedCart = await Cart.findById(cart._id)
      .populate('creator', 'name avatar rating phone')
      .populate('members.user', 'name avatar rating');

    // Emit socket event
    if (global.io) {
      global.io.to(`cart_${cart._id}`).emit('cart:member_joined', {
        cart: updatedCart,
        user: req.user
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Leave a cart
// @route   POST /api/carts/:id/leave
// @access  Private
exports.leaveCart = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if user is creator
    if (cart.creator.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Creator cannot leave the cart. Please delete the cart instead.'
      });
    }

    // Check if order is already placed
    if (['ordering', 'ordered', 'delivered'].includes(cart.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot leave cart after order is placed'
      });
    }

    // Remove member
    await cart.removeMember(req.user.id);

    const updatedCart = await Cart.findById(cart._id)
      .populate('creator', 'name avatar rating phone')
      .populate('members.user', 'name avatar rating');

    // Emit socket event
    if (global.io) {
      global.io.to(`cart_${cart._id}`).emit('cart:member_left', {
        cart: updatedCart,
        userId: req.user.id
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update cart
// @route   PUT /api/carts/:id
// @access  Private
exports.updateCart = async (req, res, next) => {
  try {
    let cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if user is creator
    if (cart.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this cart'
      });
    }

    // Don't allow updates after ordering
    if (['ordering', 'ordered', 'delivered'].includes(cart.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update cart after order is placed'
      });
    }

    cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('creator', 'name avatar rating phone')
      .populate('members.user', 'name avatar rating');

    // Emit socket event
    if (global.io) {
      global.io.to(`cart_${cart._id}`).emit('cart:updated', cart);
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete cart
// @route   DELETE /api/carts/:id
// @access  Private
exports.deleteCart = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if user is creator
    if (cart.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this cart'
      });
    }

    // Don't allow deletion after ordering
    if (['ordering', 'ordered', 'delivered'].includes(cart.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete cart after order is placed'
      });
    }

    await cart.deleteOne();

    // Emit socket event
    if (global.io) {
      global.io.to(`cart_${cart._id}`).emit('cart:deleted', { cartId: cart._id });
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

// @desc    Get user's carts (created or joined)
// @route   GET /api/carts/my/all
// @access  Private
exports.getMyCarts = async (req, res, next) => {
  try {
    const carts = await Cart.find({
      $or: [
        { creator: req.user.id },
        { 'members.user': req.user.id }
      ]
    })
      .populate('creator', 'name avatar rating phone')
      .populate('members.user', 'name avatar rating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: carts.length,
      data: carts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
