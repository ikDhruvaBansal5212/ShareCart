const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sharecart')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function addSmallUser() {
    try {
        // Check if user already exists
        let user = await User.findOne({ email: 'small@gmail.com' });
        
        if (user) {
            console.log('❌ User "small@gmail.com" already exists!');
            console.log(`   User ID: ${user._id}`);
            console.log(`   Name: ${user.name}`);
            process.exit(0);
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash('small', 10);

        // Create new user
        user = await User.create({
            name: 'small',
            email: 'small@gmail.com',
            phone: '9876543225',
            password: hashedPassword,
            location: {
                type: 'Point',
                coordinates: [77.2100, 28.6150],
                address: 'Karol Bagh, New Delhi',
                city: 'Delhi',
                pincode: '110005'
            }
        });

        console.log('═'.repeat(50));
        console.log('     ✅ NEW USER CREATED SUCCESSFULLY     ');
        console.log('═'.repeat(50));
        console.log('\n📧 Email: small@gmail.com');
        console.log('🔑 Password: small');
        console.log('👤 Name: small');
        console.log('📱 Phone: 9876543225');
        console.log('📍 Location: Karol Bagh, New Delhi');
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

addSmallUser();
