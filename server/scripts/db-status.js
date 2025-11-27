require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

// Import models
const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Message = require('../models/Message');
const Review = require('../models/Review');

const checkDatabaseStatus = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected: ' + mongoose.connection.host);
    console.log('📦 Database: ' + mongoose.connection.name + '\n');

    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log('📊 Database Status:\n');
    console.log('Collection'.padEnd(15) + 'Documents'.padEnd(15) + 'Status');
    console.log('─'.repeat(50));

    const models = [
      { name: 'users', model: User },
      { name: 'carts', model: Cart },
      { name: 'orders', model: Order },
      { name: 'messages', model: Message },
      { name: 'reviews', model: Review }
    ];

    for (const { name, model } of models) {
      const exists = collections.find(col => col.name === name);
      if (exists) {
        const count = await model.countDocuments();
        console.log(name.padEnd(15) + count.toString().padEnd(15) + '✅ Ready');
      } else {
        console.log(name.padEnd(15) + '0'.padEnd(15) + '⚠️  Not created yet');
      }
    }

    console.log('\n💡 Tip: Run "npm run init-db" to initialize all collections\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

console.log('\n' + '='.repeat(50));
console.log('   ShareCart Database Status Check');
console.log('='.repeat(50) + '\n');

checkDatabaseStatus();
