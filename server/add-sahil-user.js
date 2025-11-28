const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sharecart')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function addSahilUser() {
    try {
        // Check if user already exists
        let user = await User.findOne({ email: 'sahil@gmail.com' });
        
        if (user) {
            console.log('❌ User sahil@gmail.com already exists!');
            console.log(`   User ID: ${user._id}`);
            console.log(`   Name: ${user.name}`);
            process.exit(0);
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash('123456', 10);

        // Create new user
        user = await User.create({
            name: 'Sahil Kumar',
            email: 'sahil@gmail.com',
            phone: '9876543224',
            password: hashedPassword,
            location: {
                type: 'Point',
                coordinates: [77.2090, 28.6139],
                address: 'Connaught Place, New Delhi',
                city: 'Delhi',
                pincode: '110001'
            }
        });

        console.log('═'.repeat(50));
        console.log('     ✅ NEW USER CREATED SUCCESSFULLY     ');
        console.log('═'.repeat(50));
        console.log('\n📧 Email: sahil@gmail.com');
        console.log('🔑 Password: 123456');
        console.log('👤 Name: Sahil Kumar');
        console.log('📱 Phone: 9876543224');
        console.log('📍 Location: Connaught Place, New Delhi');
        console.log(`🆔 User ID: ${user._id}`);
        console.log('\n' + '═'.repeat(50));
        console.log('You can now login with these credentials!');
        console.log('═'.repeat(50) + '\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating user:', error);
        process.exit(1);
    }
}

addSahilUser();
