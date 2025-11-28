const mongoose = require('mongoose');
const Cart = require('./models/Cart');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sharecart')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function createFreshDemoCarts() {
    try {
        // Get all users
        const users = await User.find().limit(10);
        
        if (users.length < 3) {
            console.log('❌ Not enough users. Need at least 3 users.');
            process.exit(1);
            return;
        }

        console.log(`Found ${users.length} users`);
        console.log('Creating fresh demo carts...\n');

        // Delete old expired carts
        await Cart.deleteMany({ expiresAt: { $lt: new Date() } });

        // Create new carts with future expiration times
        const now = new Date();
        const demoCarts = [
            {
                creator: users[0]._id,
                platform: 'swiggy',
                location: {
                    type: 'Point',
                    coordinates: [77.2090, 28.6139],
                    address: 'Connaught Place, New Delhi',
                    city: 'Delhi',
                    pincode: '110001'
                },
                deliveryCharge: 60,
                maxMembers: 4,
                members: [{ user: users[0]._id, status: 'joined', splitAmount: 20 }],
                status: 'active',
                maxDistance: 3,
                isPublic: true,
                notes: 'Lunch order from office! 3 spots available 🍔',
                createdAt: now,
                expiresAt: new Date(now.getTime() + 5 * 60 * 60 * 1000) // 5 hours
            },
            {
                creator: users[1]._id,
                platform: 'zepto',
                location: {
                    type: 'Point',
                    coordinates: [77.2100, 28.6150],
                    address: 'Karol Bagh, New Delhi',
                    city: 'Delhi',
                    pincode: '110005'
                },
                deliveryCharge: 50,
                maxMembers: 3,
                members: [{ user: users[1]._id, status: 'joined', splitAmount: 16.67 }],
                status: 'active',
                maxDistance: 2,
                isPublic: true,
                notes: 'Evening snacks! Join quickly 🍕',
                createdAt: now,
                expiresAt: new Date(now.getTime() + 4 * 60 * 60 * 1000)
            },
            {
                creator: users[2]._id,
                platform: 'blinkit',
                location: {
                    type: 'Point',
                    coordinates: [77.2070, 28.6120],
                    address: 'Paharganj, New Delhi',
                    city: 'Delhi',
                    pincode: '110055'
                },
                deliveryCharge: 45,
                maxMembers: 4,
                members: [
                    { user: users[2]._id, status: 'joined', splitAmount: 15 },
                    { user: users[3]._id, status: 'joined', splitAmount: 15 }
                ],
                status: 'active',
                maxDistance: 2.5,
                isPublic: true,
                notes: 'Grocery shopping! 2 more can join 🛒',
                createdAt: now,
                expiresAt: new Date(now.getTime() + 6 * 60 * 60 * 1000)
            },
            {
                creator: users[3]._id,
                platform: 'zepto',
                location: {
                    type: 'Point',
                    coordinates: [77.2110, 28.6160],
                    address: 'Rajendra Place, New Delhi',
                    city: 'Delhi',
                    pincode: '110008'
                },
                deliveryCharge: 40,
                maxMembers: 3,
                members: [{ user: users[3]._id, status: 'joined', splitAmount: 13.33 }],
                status: 'active',
                maxDistance: 2,
                isPublic: true,
                notes: 'Quick midnight snacks order! 🌙',
                createdAt: now,
                expiresAt: new Date(now.getTime() + 3 * 60 * 60 * 1000)
            },
            {
                creator: users[4]._id,
                platform: 'swiggy',
                location: {
                    type: 'Point',
                    coordinates: [77.2095, 28.6125],
                    address: 'Sarojini Nagar, New Delhi',
                    city: 'Delhi',
                    pincode: '110023'
                },
                deliveryCharge: 70,
                maxMembers: 5,
                members: [
                    { user: users[4]._id, status: 'joined', splitAmount: 23.33 },
                    { user: users[5]._id, status: 'joined', splitAmount: 23.33 }
                ],
                status: 'active',
                maxDistance: 3,
                isPublic: true,
                notes: 'Family dinner order! 3 spots left 🍽️',
                createdAt: now,
                expiresAt: new Date(now.getTime() + 4 * 60 * 60 * 1000)
            },
            {
                creator: users[5]._id,
                platform: 'bigbasket',
                location: {
                    type: 'Point',
                    coordinates: [77.2085, 28.6130],
                    address: 'RK Puram, New Delhi',
                    city: 'Delhi',
                    pincode: '110022'
                },
                deliveryCharge: 80,
                maxMembers: 4,
                members: [{ user: users[5]._id, status: 'joined', splitAmount: 26.67 }],
                status: 'active',
                maxDistance: 2.5,
                isPublic: true,
                notes: 'Weekly groceries! Big savings on delivery 💰',
                createdAt: now,
                expiresAt: new Date(now.getTime() + 8 * 60 * 60 * 1000)
            },
            {
                creator: users[6]._id,
                platform: 'blinkit',
                location: {
                    type: 'Point',
                    coordinates: [77.2105, 28.6145],
                    address: 'Naraina, New Delhi',
                    city: 'Delhi',
                    pincode: '110028'
                },
                deliveryCharge: 55,
                maxMembers: 4,
                members: [
                    { user: users[6]._id, status: 'joined', splitAmount: 18.33 },
                    { user: users[7]._id, status: 'joined', splitAmount: 18.33 },
                    { user: users[8]._id, status: 'joined', splitAmount: 18.33 }
                ],
                status: 'active',
                maxDistance: 2,
                isPublic: true,
                notes: 'Party supplies! One more person needed 🎉',
                createdAt: now,
                expiresAt: new Date(now.getTime() + 3 * 60 * 60 * 1000)
            },
            {
                creator: users[7]._id,
                platform: 'zepto',
                location: {
                    type: 'Point',
                    coordinates: [77.2080, 28.6135],
                    address: 'Vasant Vihar, New Delhi',
                    city: 'Delhi',
                    pincode: '110057'
                },
                deliveryCharge: 45,
                maxMembers: 3,
                members: [{ user: users[7]._id, status: 'joined', splitAmount: 15 }],
                status: 'active',
                maxDistance: 2,
                isPublic: true,
                notes: 'Breakfast items for tomorrow! 🥐',
                createdAt: now,
                expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000)
            },
            {
                creator: users[8]._id,
                platform: 'swiggy',
                location: {
                    type: 'Point',
                    coordinates: [77.2115, 28.6155],
                    address: 'Pitampura, New Delhi',
                    city: 'Delhi',
                    pincode: '110034'
                },
                deliveryCharge: 65,
                maxMembers: 5,
                members: [
                    { user: users[8]._id, status: 'joined', splitAmount: 21.67 },
                    { user: users[9]._id, status: 'joined', splitAmount: 21.67 }
                ],
                status: 'active',
                maxDistance: 3,
                isPublic: true,
                notes: 'Study group pizza order! 3 spots open 📚',
                createdAt: now,
                expiresAt: new Date(now.getTime() + 5 * 60 * 60 * 1000)
            },
            {
                creator: users[9]._id,
                platform: 'swiggy',
                location: {
                    type: 'Point',
                    coordinates: [77.2090, 28.6140],
                    address: 'Moti Nagar, New Delhi',
                    city: 'Delhi',
                    pincode: '110015'
                },
                deliveryCharge: 55,
                maxMembers: 4,
                members: [{ user: users[9]._id, status: 'joined', splitAmount: 18.33 }],
                status: 'active',
                maxDistance: 2.5,
                isPublic: true,
                notes: 'Biryani cravings! Join now 🍛',
                createdAt: now,
                expiresAt: new Date(now.getTime() + 4 * 60 * 60 * 1000)
            }
        ];

        // Insert carts
        const createdCarts = await Cart.insertMany(demoCarts);

        console.log('═'.repeat(60));
        console.log('     ✅ DEMO CARTS CREATED SUCCESSFULLY     ');
        console.log('═'.repeat(60));
        console.log(`\n📦 Created ${createdCarts.length} new active carts`);
        console.log('⏰ All carts expire between 2-8 hours from now');
        console.log('\n🌍 All carts are PUBLIC and ACTIVE');
        console.log('📍 All carts are in Delhi with nearby locations\n');

        // Show summary
        const platforms = {};
        createdCarts.forEach(cart => {
            platforms[cart.platform] = (platforms[cart.platform] || 0) + 1;
        });

        console.log('Platform breakdown:');
        Object.entries(platforms).forEach(([platform, count]) => {
            console.log(`  ${platform.toUpperCase()}: ${count} carts`);
        });

        console.log('\n' + '═'.repeat(60));
        console.log('Refresh browse-carts page to see them!');
        console.log('═'.repeat(60) + '\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createFreshDemoCarts();
