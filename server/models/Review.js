const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  categories: {
    punctuality: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    reliability: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    }
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews
reviewSchema.index({ order: 1, reviewer: 1, reviewee: 1 }, { unique: true });
reviewSchema.index({ reviewee: 1, createdAt: -1 });

// Update user rating after review is saved
reviewSchema.post('save', async function() {
  const User = mongoose.model('User');
  
  // Calculate average rating for the reviewee
  const stats = await this.constructor.aggregate([
    {
      $match: { reviewee: this.reviewee }
    },
    {
      $group: {
        _id: '$reviewee',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  if (stats.length > 0) {
    await User.findByIdAndUpdate(this.reviewee, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
