const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`⚠️  Server will continue running but database features won't work`);
    console.error(`💡 To fix: Start MongoDB locally or use MongoDB Atlas`);
    // Don't exit - allow server to run without DB for testing
  }
};

module.exports = connectDB;
