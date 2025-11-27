require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

// Import models to ensure they're registered
const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Message = require('../models/Message');
const Review = require('../models/Review');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected: ' + mongoose.connection.host);
    console.log('📦 Database: ' + mongoose.connection.name);

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 Existing Collections:');
    if (collections.length === 0) {
      console.log('   (none - database is empty)');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }

    console.log('\n🔨 Creating collections and indexes...\n');

    // Create collections by accessing them (will create if they don't exist)
    const models = [
      { name: 'Users', model: User },
      { name: 'Carts', model: Cart },
      { name: 'Orders', model: Order },
      { name: 'Messages', model: Message },
      { name: 'Reviews', model: Review }
    ];

    for (const { name, model } of models) {
      try {
        // Ensure indexes are created
        await model.createIndexes();
        
        // Get collection stats
        const count = await model.countDocuments();
        console.log(`✅ ${name.padEnd(10)} - Collection ready (${count} documents)`);
      } catch (error) {
        console.log(`⚠️  ${name.padEnd(10)} - ${error.message}`);
      }
    }

    // Show all indexes
    console.log('\n📑 Indexes created:');
    for (const { name, model } of models) {
      const indexes = await model.collection.getIndexes();
      console.log(`\n   ${name}:`);
      Object.keys(indexes).forEach(indexName => {
        console.log(`      - ${indexName}`);
      });
    }

    console.log('\n✨ Database initialization complete!');
    console.log('\n💡 You can now:');
    console.log('   1. Start the server: npm start');
    console.log('   2. Register users via the signup form');
    console.log('   3. Create and join carts');
    console.log('   4. Test all features!\n');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed\n');
  }
};

// Run initialization
console.log('\n' + '='.repeat(50));
console.log('   ShareCart Database Initialization');
console.log('='.repeat(50) + '\n');

initializeDatabase();
