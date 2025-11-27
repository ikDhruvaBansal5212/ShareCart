# ShareCart Backend API

Complete backend implementation for ShareCart - Cart sharing platform with Node.js, Express, MongoDB, Socket.io, and Razorpay integration.

## 🚀 Features Implemented

- ✅ User authentication with JWT
- ✅ Real-time cart synchronization with Socket.io
- ✅ Payment processing & splitting with Razorpay
- ✅ Order coordination system
- ✅ Chat between cart members
- ✅ Rating and review system
- ✅ Geolocation-based cart matching
- ✅ Distance calculations
- ✅ Real-time notifications

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Razorpay account for payment integration
- Google Maps API key (optional, for geocoding)

## 🔧 Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update the values in `.env`:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/sharecart
     JWT_SECRET=your_jwt_secret_key
     JWT_EXPIRE=7d
     RAZORPAY_KEY_ID=your_razorpay_key
     RAZORPAY_KEY_SECRET=your_razorpay_secret
     GOOGLE_MAPS_API_KEY=your_google_maps_key
     CLIENT_URL=http://localhost:3000
     ```

4. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js              # MongoDB connection
│   └── socket.js          # Socket.io configuration
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── cartController.js      # Cart management
│   ├── paymentController.js   # Payment processing
│   ├── messageController.js   # Chat functionality
│   └── reviewController.js    # Reviews & ratings
├── middleware/
│   ├── auth.js            # JWT authentication middleware
│   └── error.js           # Error handling
├── models/
│   ├── User.js            # User schema
│   ├── Cart.js            # Cart schema
│   ├── Order.js           # Order schema
│   ├── Message.js         # Message schema
│   └── Review.js          # Review schema
├── routes/
│   ├── auth.js            # Auth routes
│   ├── carts.js           # Cart routes
│   ├── payments.js        # Payment routes
│   ├── messages.js        # Message routes
│   └── reviews.js         # Review routes
├── .env.example           # Environment variables template
├── package.json           # Dependencies
└── server.js              # Main server file
```

## 🔐 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "location": {
    "coordinates": [72.8777, 19.0760],
    "address": "123 Main St",
    "city": "Mumbai",
    "pincode": "400001"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update User Details
```http
PUT /api/auth/updatedetails
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9876543211",
  "location": {...}
}
```

### Carts

#### Get All Active Carts
```http
GET /api/carts?platform=blinkit&maxDistance=2&city=Mumbai
Authorization: Bearer <token>
```

#### Get Single Cart
```http
GET /api/carts/:id
Authorization: Bearer <token>
```

#### Create Cart
```http
POST /api/carts
Authorization: Bearer <token>
Content-Type: application/json

{
  "platform": "blinkit",
  "location": {
    "coordinates": [72.8777, 19.0760],
    "address": "123 Main St",
    "city": "Mumbai",
    "pincode": "400001"
  },
  "deliveryCharge": 50,
  "maxMembers": 4,
  "maxDistance": 2,
  "notes": "Ordering groceries"
}
```

#### Join Cart
```http
POST /api/carts/:id/join
Authorization: Bearer <token>
```

#### Leave Cart
```http
POST /api/carts/:id/leave
Authorization: Bearer <token>
```

#### Update Cart
```http
PUT /api/carts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "maxMembers": 5,
  "notes": "Updated notes"
}
```

#### Delete Cart
```http
DELETE /api/carts/:id
Authorization: Bearer <token>
```

#### Get My Carts
```http
GET /api/carts/my/all
Authorization: Bearer <token>
```

### Payments

#### Create Order
```http
POST /api/payments/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "cartId": "cart_id_here"
}
```

#### Verify Payment
```http
POST /api/payments/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "cartId": "cart_id_here"
}
```

#### Get Payment Status
```http
GET /api/payments/status/:cartId
Authorization: Bearer <token>
```

#### Get My Orders
```http
GET /api/payments/orders
Authorization: Bearer <token>
```

### Messages (Chat)

#### Get Messages
```http
GET /api/messages/:cartId?limit=50&page=1
Authorization: Bearer <token>
```

#### Send Message
```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "cartId": "cart_id_here",
  "content": "Hello everyone!",
  "messageType": "text"
}
```

#### Edit Message
```http
PUT /api/messages/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated message"
}
```

#### Delete Message
```http
DELETE /api/messages/:id
Authorization: Bearer <token>
```

#### Get Unread Count
```http
GET /api/messages/unread/:cartId
Authorization: Bearer <token>
```

### Reviews

#### Create Review
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_id_here",
  "revieweeId": "user_id_here",
  "rating": 5,
  "comment": "Great cart member!",
  "categories": {
    "punctuality": 5,
    "communication": 5,
    "reliability": 5
  },
  "isAnonymous": false
}
```

#### Get User Reviews
```http
GET /api/reviews/user/:userId
```

#### Get My Reviews
```http
GET /api/reviews/my
Authorization: Bearer <token>
```

#### Get Pending Reviews
```http
GET /api/reviews/pending
Authorization: Bearer <token>
```

#### Update Review
```http
PUT /api/reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review"
}
```

#### Delete Review
```http
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

#### Report Review
```http
POST /api/reviews/:id/report
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Inappropriate content"
}
```

## 🔌 Socket.io Events

### Client → Server

#### Join Cart Room
```javascript
socket.emit('cart:join', cartId);
```

#### Leave Cart Room
```javascript
socket.emit('cart:leave', cartId);
```

#### Typing Indicator
```javascript
socket.emit('message:typing', { cartId, isTyping: true });
```

#### Update Location
```javascript
socket.emit('location:update', {
  coordinates: [longitude, latitude],
  address: "123 Main St",
  city: "Mumbai"
});
```

#### Share Location
```javascript
socket.emit('location:share', {
  cartId: cartId,
  location: { coordinates: [lon, lat] }
});
```

#### Order Status Update
```javascript
socket.emit('order:status_update', {
  cartId: cartId,
  status: 'preparing'
});
```

#### Delivery Arrived
```javascript
socket.emit('delivery:arrived', { cartId: cartId });
```

### Server → Client

#### User Online
```javascript
socket.on('user:online', (data) => {
  console.log(`${data.name} is online`);
});
```

#### User Offline
```javascript
socket.on('user:offline', (data) => {
  console.log(`User ${data.userId} is offline`);
});
```

#### Cart Created
```javascript
socket.on('cart:created', (cart) => {
  console.log('New cart created:', cart);
});
```

#### Member Joined
```javascript
socket.on('cart:member_joined', (data) => {
  console.log(`${data.user.name} joined the cart`);
});
```

#### Member Left
```javascript
socket.on('cart:member_left', (data) => {
  console.log(`User left the cart`);
});
```

#### Cart Updated
```javascript
socket.on('cart:updated', (cart) => {
  console.log('Cart updated:', cart);
});
```

#### Cart Deleted
```javascript
socket.on('cart:deleted', (data) => {
  console.log('Cart deleted:', data.cartId);
});
```

#### New Message
```javascript
socket.on('message:new', (message) => {
  console.log('New message:', message);
});
```

#### Message Edited
```javascript
socket.on('message:edited', (message) => {
  console.log('Message edited:', message);
});
```

#### Message Deleted
```javascript
socket.on('message:deleted', (data) => {
  console.log('Message deleted:', data.messageId);
});
```

#### Payment Completed
```javascript
socket.on('payment:completed', (data) => {
  console.log('Payment completed:', data);
});
```

#### Location Shared
```javascript
socket.on('location:shared', (data) => {
  console.log(`${data.name} shared location`);
});
```

## 🗄️ Database Models

### User Model
- Authentication with bcrypt
- JWT token generation
- Geolocation support (GeoJSON)
- Rating system
- Order statistics

### Cart Model
- Platform selection (blinkit, zepto, swiggy, bigbasket)
- Geolocation with distance-based filtering
- Member management with slot tracking
- Auto-expiration after 2 hours
- Split amount calculation

### Order Model
- Unique order number generation
- Multi-member payment tracking
- Razorpay integration
- Order status tracking
- Payment verification

### Message Model
- Text and image messages
- Read receipts
- Edit and delete functionality
- System messages support

### Review Model
- 5-star rating system
- Category-based ratings (punctuality, communication, reliability)
- Anonymous review option
- Auto-update user ratings

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Helmet.js for security headers
- Rate limiting (100 requests per 10 minutes)
- CORS configuration
- Input validation
- MongoDB injection prevention

## 🚀 Deployment

### MongoDB Atlas Setup
1. Create account at mongodb.com/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in .env

### Razorpay Setup
1. Create account at razorpay.com
2. Get API keys from dashboard
3. Update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET

### Heroku Deployment
```bash
# Install Heroku CLI
heroku login

# Create app
heroku create sharecart-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set RAZORPAY_KEY_ID=your_razorpay_key
heroku config:set RAZORPAY_KEY_SECRET=your_razorpay_secret

# Deploy
git push heroku main
```

## 📊 Testing

### Using Postman
1. Import API endpoints
2. Set up environment variables
3. Test authentication flow
4. Test cart operations
5. Test payment flow

### Manual Testing
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456","phone":"9876543210"}'
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

### Socket.io Connection Issues
- Check CORS configuration
- Verify CLIENT_URL matches frontend
- Check firewall settings

### Payment Issues
- Verify Razorpay credentials
- Check test mode vs live mode
- Review Razorpay logs

## 📝 License

MIT

## 👥 Support

For issues or questions, please create an issue in the repository.
