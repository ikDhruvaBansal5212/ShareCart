# ShareCart Backend - Installation & Setup

## Prerequisites Installed ✅

- Node.js
- MongoDB
- npm

## Installation Commands

### 1. Install Dependencies

Open PowerShell in the backend directory and run:

```powershell
cd "c:\Users\garga\Saved Games\OneDrive\Desktop\dhruv project\backend"
npm install
```

This will install all required packages:
- express (web framework)
- mongoose (MongoDB ODM)
- socket.io (real-time communication)
- jsonwebtoken (JWT authentication)
- bcryptjs (password hashing)
- razorpay (payment integration)
- dotenv (environment variables)
- cors (cross-origin requests)
- helmet (security)
- morgan (logging)
- compression (response compression)
- express-rate-limit (rate limiting)
- express-validator (input validation)
- axios (HTTP client)

### 2. Create Environment File

```powershell
# Copy the example file
Copy-Item .env.example .env
```

Then open `.env` and update with your actual values.

### 3. Start MongoDB

**If using local MongoDB:**
```powershell
# Start MongoDB service
mongod
```

**If using MongoDB Atlas:**
- Already configured with connection string in .env
- No local setup needed

### 4. Start the Server

**Development mode (recommended):**
```powershell
npm run dev
```

**Production mode:**
```powershell
npm start
```

### 5. Verify Installation

Test the health endpoint:
```powershell
curl http://localhost:5000/health
```

Or open in browser: http://localhost:5000/health

Expected response:
```json
{
  "success": true,
  "message": "ShareCart API is running",
  "timestamp": "2025-11-26T..."
}
```

## 📦 Installed Packages Overview

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web server framework |
| mongoose | ^7.5.0 | MongoDB object modeling |
| socket.io | ^4.7.2 | WebSocket for real-time features |
| jsonwebtoken | ^9.0.2 | JWT authentication |
| bcryptjs | ^2.4.3 | Password hashing |
| dotenv | ^16.3.1 | Environment variable management |
| cors | ^2.8.5 | CORS middleware |
| helmet | ^7.0.0 | Security headers |
| morgan | ^1.10.0 | HTTP request logger |
| compression | ^1.7.4 | Response compression |
| express-rate-limit | ^6.10.0 | Rate limiting |
| express-validator | ^7.0.1 | Input validation |
| razorpay | ^2.9.2 | Payment gateway |
| axios | ^1.5.0 | HTTP client |
| nodemon | ^3.0.1 | Auto-restart (dev) |

## 🔧 Configuration Required

### Required (Must Configure):
1. **MONGODB_URI** - Your MongoDB connection string
2. **JWT_SECRET** - Secret key for JWT (change from default!)

### Recommended (For Full Features):
3. **RAZORPAY_KEY_ID** - For payment processing
4. **RAZORPAY_KEY_SECRET** - For payment verification

### Optional (Enhanced Features):
5. **GOOGLE_MAPS_API_KEY** - For geocoding/location services
6. **EMAIL_SERVICE** - For email notifications
7. **EMAIL_USER** - SMTP username
8. **EMAIL_PASSWORD** - SMTP password

## 🚀 Quick Test Commands

### Test User Registration
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    phone = "9876543210"
    location = @{
        coordinates = @(72.8777, 19.0760)
        address = "Mumbai, India"
        city = "Mumbai"
        pincode = "400001"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

### Test Login
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

## 📊 Database Setup

The application will automatically create collections when needed:
- users
- carts
- orders
- messages
- reviews

Indexes are created automatically by Mongoose schemas.

## 🔐 Security Notes

1. **Change JWT_SECRET** in production to a strong random string
2. **Use environment variables** - Never commit .env file
3. **Enable HTTPS** in production
4. **Set up rate limiting** (already configured)
5. **Use MongoDB Atlas** for production (includes backup/monitoring)

## 📝 Development Tips

1. **Use nodemon**: Already configured with `npm run dev`
2. **Check logs**: Morgan logs all HTTP requests
3. **MongoDB Compass**: Visual tool to inspect database
4. **Postman**: Test API endpoints easily
5. **Socket.io Client**: Test WebSocket events

## ⚡ Performance Optimizations

Already implemented:
- Response compression (gzip)
- MongoDB indexing
- Rate limiting
- Helmet security headers
- CORS configuration
- Error handling middleware

## 🐛 Troubleshooting

### Dependencies not installing?
```powershell
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install
```

### MongoDB connection issues?
- Check if MongoDB is running: `Get-Service MongoDB`
- Verify MONGODB_URI in .env
- Try MongoDB Atlas as alternative

### Port already in use?
```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000

# Kill the process
Stop-Process -Id <PID>
```

## 📈 Next Steps

1. ✅ Install dependencies
2. ✅ Configure .env
3. ✅ Start MongoDB
4. ✅ Start server
5. ✅ Test endpoints
6. 🔜 Connect frontend
7. 🔜 Deploy to production

---

**Installation complete! Server is ready to use.** 🎉
