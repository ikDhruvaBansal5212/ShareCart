const axios = require('axios');

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Get address from coordinates using Google Maps Geocoding API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Object} Address details
 */
exports.getAddressFromCoordinates = async (lat, lng) => {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      const addressComponents = result.address_components;

      let city = '';
      let pincode = '';

      addressComponents.forEach(component => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('postal_code')) {
          pincode = component.long_name;
        }
      });

      return {
        address: result.formatted_address,
        city: city,
        pincode: pincode
      };
    }

    throw new Error('No results found');
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw error;
  }
};

/**
 * Get coordinates from address using Google Maps Geocoding API
 * @param {string} address - Address string
 * @returns {Object} Coordinates
 */
exports.getCoordinatesFromAddress = async (address) => {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        coordinates: [location.lng, location.lat]
      };
    }

    throw new Error('No results found');
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw error;
  }
};

/**
 * Find nearby carts based on user location
 * @param {Object} userLocation - User's GeoJSON location
 * @param {Array} carts - Array of cart objects
 * @param {number} maxDistance - Maximum distance in km
 * @returns {Array} Filtered carts with distance
 */
exports.findNearbyCarts = (userLocation, carts, maxDistance = 5) => {
  const userLat = userLocation.coordinates[1];
  const userLon = userLocation.coordinates[0];

  return carts
    .map(cart => {
      const cartLat = cart.location.coordinates[1];
      const cartLon = cart.location.coordinates[0];
      const distance = this.calculateDistance(userLat, userLon, cartLat, cartLon);

      return {
        ...cart,
        distance: distance
      };
    })
    .filter(cart => cart.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Check if point is within radius
 * @param {number} lat1 - Point 1 latitude
 * @param {number} lon1 - Point 1 longitude
 * @param {number} lat2 - Point 2 latitude
 * @param {number} lon2 - Point 2 longitude
 * @param {number} radiusKm - Radius in kilometers
 * @returns {boolean}
 */
exports.isWithinRadius = (lat1, lon1, lat2, lon2, radiusKm) => {
  const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= radiusKm;
};

/**
 * Get city from coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} City name
 */
exports.getCityFromCoordinates = async (lat, lng) => {
  try {
    const addressData = await this.getAddressFromCoordinates(lat, lng);
    return addressData.city;
  } catch (error) {
    console.error('Error getting city:', error.message);
    return '';
  }
};

/**
 * Validate coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean}
 */
exports.isValidCoordinates = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};
