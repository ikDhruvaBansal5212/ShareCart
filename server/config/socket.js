const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketHandler = (io) => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.userId})`);

    // Join user's personal room
    socket.join(`user_${socket.userId}`);

    // Update user's online status
    User.findByIdAndUpdate(socket.userId, {
      isActive: true,
      lastSeen: new Date()
    }).exec();

    // Broadcast online status to all users
    io.emit('user:online', {
      userId: socket.userId,
      name: socket.user.name
    });

    // Join a cart room
    socket.on('cart:join', (cartId) => {
      socket.join(`cart_${cartId}`);
      console.log(`User ${socket.user.name} joined cart ${cartId}`);
      
      // Notify other members
      socket.to(`cart_${cartId}`).emit('cart:user_joined', {
        userId: socket.userId,
        name: socket.user.name,
        avatar: socket.user.avatar
      });
    });

    // Leave a cart room
    socket.on('cart:leave', (cartId) => {
      socket.leave(`cart_${cartId}`);
      console.log(`User ${socket.user.name} left cart ${cartId}`);
      
      // Notify other members
      socket.to(`cart_${cartId}`).emit('cart:user_left', {
        userId: socket.userId,
        name: socket.user.name
      });
    });

    // Typing indicator
    socket.on('message:typing', ({ cartId, isTyping }) => {
      socket.to(`cart_${cartId}`).emit('message:typing', {
        userId: socket.userId,
        name: socket.user.name,
        isTyping: isTyping
      });
    });

    // Location update
    socket.on('location:update', async (location) => {
      try {
        await User.findByIdAndUpdate(socket.userId, {
          location: location
        });

        socket.emit('location:updated', {
          success: true,
          location: location
        });
      } catch (error) {
        socket.emit('location:error', {
          success: false,
          message: error.message
        });
      }
    });

    // Request current location of cart members
    socket.on('cart:request_locations', ({ cartId, memberIds }) => {
      memberIds.forEach(memberId => {
        io.to(`user_${memberId}`).emit('location:request', {
          cartId: cartId,
          requesterId: socket.userId
        });
      });
    });

    // Share location with cart members
    socket.on('location:share', ({ cartId, location }) => {
      socket.to(`cart_${cartId}`).emit('location:shared', {
        userId: socket.userId,
        name: socket.user.name,
        location: location
      });
    });

    // Order status update (creator only)
    socket.on('order:status_update', ({ cartId, status }) => {
      io.to(`cart_${cartId}`).emit('order:status_changed', {
        status: status,
        updatedBy: socket.user.name,
        timestamp: new Date()
      });
    });

    // Delivery arrived notification
    socket.on('delivery:arrived', ({ cartId }) => {
      io.to(`cart_${cartId}`).emit('delivery:notification', {
        message: 'Delivery has arrived!',
        userId: socket.userId,
        name: socket.user.name,
        timestamp: new Date()
      });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.name}`);
      
      // Update user's offline status
      await User.findByIdAndUpdate(socket.userId, {
        isActive: false,
        lastSeen: new Date()
      });

      // Broadcast offline status
      io.emit('user:offline', {
        userId: socket.userId,
        lastSeen: new Date()
      });
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      socket.emit('error', {
        message: 'An error occurred',
        error: error.message
      });
    });
  });

  return io;
};

module.exports = socketHandler;
