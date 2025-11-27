# ShareCart - Smart Delivery Fee Splitting Platform

ShareCart is a web application that helps users save money on delivery charges by allowing them to share carts with nearby customers. Users can shop for items and if their cart total is below ₹250 (minimum order to avoid delivery fees), they can share their cart with others in their area.

## 🎯 Features

### Shopping & Cart Management
- **Browse Items**: 32+ products across categories (Snacks, Beverages, Groceries, Dairy, Personal Care)
- **Smart Cart System**: Add items to your personal cart with quantity controls
- **Minimum Order Tracking**: Visual progress bar showing ₹250 minimum order requirement
- **Real-time Calculations**: Live cart total and remaining amount display

### Cart Sharing
- **Share Incomplete Carts**: If your cart is below ₹250, share it with nearby users
- **Location-Based Matching**: Only users within 2km radius can see and join your cart
- **Collaborative Shopping**: Others can add their items to your cart to reach ₹250 together
- **Distance Display**: See how far each shared cart user is from you

### User Features
- **JWT Authentication**: Secure login and registration
- **User Profiles**: Manage personal information and preferences
- **Order History**: Track all past orders
- **Real-time Updates**: Socket.io for live cart updates
- **Geolocation**: Automatic location detection for nearby cart matching

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Font Awesome for icons
- Responsive design
- LocalStorage for cart persistence

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- Socket.io for real-time features
- JWT for authentication
- Bcrypt for password hashing

### Security
- Helmet.js for HTTP headers
- CORS enabled
- Rate limiting
- Input validation

## 📁 Project Structure

```
sharecart/
├── client/                 # Frontend
│   ├── css/
│   │   ├── global.css     # Shared styles
│   │   └── home.css       # Landing page styles
│   ├── js/
│   │   ├── api.js         # API client wrapper
│   │   └── cart-sharing.js # Sharing utilities
│   ├── pages/
│   │   ├── index.html     # Landing page
│   │   ├── dashboard.html # User dashboard
│   │   ├── shop.html      # Browse & shop items
│   │   ├── shared-carts.html # View shared carts
│   │   ├── cart-details.html # Cart details
│   │   ├── orders.html    # Order history
│   │   ├── profile.html   # User profile
│   │   └── join-cart.html # Join via shared link
│   └── package.json
├── server/                 # Backend
│   ├── config/
│   │   ├── db.js          # MongoDB connection
│   │   └── socket.js      # Socket.io setup
│   ├── controllers/       # Business logic
│   ├── models/            # Database schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & error handling
│   ├── utils/             # Helper functions
│   ├── server.js          # Entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/sharecart.git
cd sharecart
```

2. **Install backend dependencies**
```bash
cd server
npm install
```

3. **Configure environment variables**

Create a `.env` file in the `server` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/sharecart
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Start the backend server**
```bash
cd server
npm start
```

6. **Start the frontend server**

Open a new terminal:
```bash
cd client
python -m http.server 3000
# Or use any static file server
```

7. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 How to Use

### For New Users:
1. **Sign Up**: Create an account with your location
2. **Browse Shop**: Go to Shop page and browse 32+ items
3. **Add Items**: Add items to your cart with quantity controls
4. **Check Minimum**: Watch the progress bar - need ₹250 to avoid delivery fee
5. **Share Cart** (if < ₹250): Click the green share button
6. **Wait for Others**: Your cart appears on Shared Carts page for nearby users

### For Joining Carts:
1. **Visit Shared Carts**: See incomplete carts from nearby users
2. **Check Distance**: Only see carts within 2km
3. **View Details**: See items, current total, remaining amount
4. **Add Items**: Click "Add My Items" to shop and complete their order
5. **Save Together**: Both users split delivery charge and save money!

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Carts
- `GET /api/carts` - Get all carts (with filters)
- `POST /api/carts` - Create new cart
- `GET /api/carts/:id` - Get cart details
- `POST /api/carts/:id/join` - Join a cart
- `DELETE /api/carts/:id` - Delete cart

### Orders
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/orders` - Get user orders

### Messages
- `GET /api/messages/:cartId` - Get cart messages
- `POST /api/messages` - Send message

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/user/:userId` - Get user reviews

## 🎨 Features in Detail

### Minimum Order System
- Visual progress bar shows cart completion
- Orange color when incomplete (< ₹250)
- Green color when complete (≥ ₹250)
- Shows exact remaining amount needed

### Location-Based Matching
- Uses geolocation API for user location
- Haversine formula for distance calculation
- Only shows carts within 2km radius
- Distance displayed on each shared cart

### Real-time Updates
- Socket.io for instant notifications
- Live cart member updates
- Real-time chat messages
- Online/offline status

### Cart Sharing
- Generate shareable links
- QR code generation
- WhatsApp/Email/SMS sharing
- Deep links to delivery apps
- Native share API support

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP security headers (Helmet)
- CORS configuration
- Rate limiting on API endpoints
- Input sanitization
- XSS protection

## 🌟 Future Enhancements

- [ ] Payment integration with Razorpay
- [ ] Push notifications
- [ ] Order tracking
- [ ] Rating system
- [ ] Referral program
- [ ] Multiple delivery platforms
- [ ] Advanced filters
- [ ] Mobile app (React Native)

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For any queries or suggestions, please reach out to the development team.

---

Made with ❤️ for saving money on delivery charges!
