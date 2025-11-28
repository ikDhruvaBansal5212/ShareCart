const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/sharecart')
    .then(async () => {
        const rahul = await User.findOne({ email: 'rahul@gmail.com' });
        const orders = await Order.find({ 'members.user': rahul._id }).populate('members.user', 'name email');
        
        console.log(`\n✅ Found ${orders.length} orders for ${rahul.name}\n`);
        console.log('═'.repeat(70));
        
        orders.forEach((order, i) => {
            console.log(`\nOrder ${i + 1}:`);
            console.log(`  Order ID: ${order.orderNumber}`);
            console.log(`  Platform: ${order.platform.toUpperCase()}`);
            console.log(`  Status: ${order.status}`);
            console.log(`  Total: ₹${order.totalAmount + order.deliveryCharge}`);
            console.log(`  Items: ${order.items.length}`);
            console.log(`  Date: ${order.createdAt.toDateString()}`);
        });
        
        console.log('\n' + '═'.repeat(70));
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
