/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted date
 */
exports.formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(date).toLocaleDateString('en-IN', options);
};

/**
 * Calculate time remaining until expiry
 * @param {Date} expiryDate - Expiry date
 * @returns {string} Time remaining string
 */
exports.getTimeRemaining = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry - now;

  if (diff <= 0) {
    return 'Expired';
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
};

/**
 * Generate unique order number
 * @returns {string} Unique order number
 */
exports.generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `SC${timestamp}${random}`;
};

/**
 * Calculate split amount
 * @param {number} totalAmount - Total amount to split
 * @param {number} memberCount - Number of members
 * @returns {number} Split amount per member
 */
exports.calculateSplitAmount = (totalAmount, memberCount) => {
  if (memberCount === 0) return 0;
  return Math.ceil(totalAmount / memberCount);
};

/**
 * Calculate savings per person
 * @param {number} deliveryCharge - Delivery charge
 * @param {number} memberCount - Number of members
 * @returns {number} Savings per person
 */
exports.calculateSavings = (deliveryCharge, memberCount) => {
  if (memberCount <= 1) return 0;
  const splitAmount = deliveryCharge / memberCount;
  return Math.round((deliveryCharge - splitAmount) * 10) / 10;
};

/**
 * Format currency (INR)
 * @param {number} amount - Amount in rupees
 * @returns {string} Formatted currency string
 */
exports.formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Validate Indian phone number
 * @param {string} phone - Phone number
 * @returns {boolean}
 */
exports.isValidIndianPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate email
 * @param {string} email - Email address
 * @returns {boolean}
 */
exports.isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Generate random avatar URL
 * @param {string} name - User name
 * @returns {string} Avatar URL
 */
exports.generateAvatar = (name) => {
  const initial = name.charAt(0).toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;
};

/**
 * Sanitize user input
 * @param {string} input - User input
 * @returns {string} Sanitized input
 */
exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Check if cart is expiring soon (within 30 minutes)
 * @param {Date} expiryDate - Expiry date
 * @returns {boolean}
 */
exports.isExpiringSoon = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry - now;
  const thirtyMinutes = 30 * 60 * 1000;
  return diff > 0 && diff <= thirtyMinutes;
};

/**
 * Get platform display name
 * @param {string} platform - Platform code
 * @returns {string} Display name
 */
exports.getPlatformDisplayName = (platform) => {
  const platforms = {
    'blinkit': 'Blinkit',
    'zepto': 'Zepto',
    'swiggy': 'Swiggy Instamart',
    'bigbasket': 'BigBasket'
  };
  return platforms[platform.toLowerCase()] || platform;
};

/**
 * Get cart status display text
 * @param {string} status - Cart status
 * @returns {string} Display text
 */
exports.getCartStatusText = (status) => {
  const statuses = {
    'active': 'Active - Accepting Members',
    'full': 'Full - No More Slots',
    'ordering': 'Order Being Placed',
    'ordered': 'Order Placed',
    'delivered': 'Delivered',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  return statuses[status] || status;
};

/**
 * Paginate results
 * @param {Array} items - Items to paginate
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Object} Paginated results
 */
exports.paginate = (items, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < items.length) {
    results.next = {
      page: page + 1,
      limit: limit
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit
    };
  }

  results.data = items.slice(startIndex, endIndex);
  results.total = items.length;
  results.totalPages = Math.ceil(items.length / limit);
  results.currentPage = page;

  return results;
};

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
exports.sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
