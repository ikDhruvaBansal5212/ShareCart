const mongoose = require('mongoose');
const Cart = require('./models/Cart');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sharecart')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function addMoreDemoData() {
    try {
        // Create additional demo users with passwords
        const newDemoUsers = [
            { 
                name: 'Neha Reddy', 
                email: 'neha@demo.com', 
                phone: '9876543220',
                password: 'demo123',
                location: {
                    type: 'Point',
                    coordinates: [77.2100, 28.6150],
                    address: 'Karol Bagh, New Delhi',
                    city: 'Delhi',
                    pincode: '110005'
                }
            },
            { 
                name: 'Arjun Verma', 
                email: 'arjun@demo.com', 
                phone: '9876543221',
                password: 'demo123',
                location: {
                    type: 'Point',
                    coordinates: [77.2070, 28.6120],
                    address: 'Paharganj, New Delhi',
                    city: 'Delhi',
                    pincode: '110055'
                }
            },
            { 
                name: 'Divya Nair', 
                email: 'divya@demo.com', 
                phone: '9876543222',
                password: 'demo123',
                location: {
                    type: 'Point',
                    coordinates: [77.2110, 28.6160],
                    address: 'Rajendra Place, New Delhi',
                    city: 'Delhi',
                    pincode: '110008'
                }
            },
            { 
                name: 'Karan Mehta', 
                email: 'karan@demo.com', 
                phone: '9876543223',
                password: 'demo123',
                location: {
                    type: 'Point',
                    coordinates: [77.2095, 28.6125],
                    address: 'Sarojini Nagar, New Delhi',
                    city: 'Delhi',
                    pincode: '110023'
                }
            }
        ];

        const createdUsers = [];
        for (const userData of newDemoUsers) {
            let user = await User.findOne({ email: userData.email });
            if (!user) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                user = await User.create({
                    ...userData,
                    password: hashedPassword
                });
                console.log(`✅ Created user: ${user.name} (${user.email})`);
            } else {
                console.log(`ℹ️  User already exists: ${user.name}`);
            }
            createdUsers.push(user);
        }

        console.log(`\n📦 Creating public carts from new users...\n`);

        // Create diverse public carts from these users
        const newCarts = [
            // Neha's carts
            {
                creator: createdUsers[0]._id,
                platform: 'blinkit',
                location: {
                    type: 'Point',
                    coordinates: createdUsers[0].location.coordinates,
                    address: createdUsers[0].location.address,
                    city: createdUsers[0].location.city,
                    pincode: createdUsers[0].location.pincode
                },
                deliveryCharge: 60,
                maxMembers: 5,
                members: [
                    { user: createdUsers[0]._id, status: 'joined', splitAmount: 20 },
                    { user: createdUsers[1]._id, status: 'joined', splitAmount: 20 }
                ],
                status: 'active',
                maxDistance: 2.5,
                isPublic: true,
                notes: 'Weekend grocery run! Looking for 3 more people to split delivery.',
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000)
            },
            {
                creator: createdUsers[0]._id,
                platform: 'zepto',
                location: {
                    type: 'Point',
                    coordinates: createdUsers[0].location.coordinates,
                    address: createdUsers[0].location.address,
                    city: createdUsers[0].location.city,
                    pincode: createdUsers[0].location.pincode
                },
                deliveryCharge: 45,
                maxMembers: 3,
                members: [
                    { user: createdUsers[0]._id, status: 'joined', splitAmount: 15 }
                ],
                status: 'active',
                maxDistance: 1.5,
                isPublic: true,
                notes: 'Quick midnight snacks order. Join fast!',
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000)
            },
            // Arjun's carts
            {
                creator: createdUsers[1]._id,
                platform: 'swiggy',
                location: {
                    type: 'Point',
                    coordinates: createdUsers[1].location.coordinates,
                    address: createdUsers[1].location.address,
                    city: createdUsers[1].location.city,
                    pincode: createdUsers[1].location.pincode
                },
                deliveryCharge: 70,
                maxMembers: 4,
                members: [
                    { user: createdUsers[1]._id, status: 'joined', splitAmount: 23.33 },
                    { user: createdUsers[2]._id, status: 'joined', splitAmount: 23.33 },
                    { user: createdUsers[3]._id, status: 'joined', splitAmount: 23.33 }
                ],
                status: 'active',
                maxDistance: 3,
                isPublic: true,
                notes: 'Office team lunch order. One more person can join!',
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
            },
            {
                creator: createdUsers[1]._id,
                platform: 'bigbasket',
                location: {
                    type: 'Point',
                    coordinates: createdUsers[1].location.coordinates,
                    address: createdUsers[1].location.address,
                    city: createdUsers[1].location.city,
                    pincode: createdUsers[1].location.pincode
                },
                deliveryCharge: 80,
                maxMembers: 5,
                members: [
                    { user: createdUsers[1]._id, status: 'joined', splitAmount: 26.66 },
                    { user: createdUsers[0]._id, status: 'joined', splitAmount: 26.66 }
                ],
                status: 'active',
                maxDistance: 2,
                isPublic: true,
                notes: 'Monthly groceries. Big order, save big on delivery!',
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000)
            },
            // Divya's carts
            {
                creator: createdUsers[2]._id,
                platform: 'blinkit',
                location: {
                    type: 'Point',
                    coordinates: createdUsers[2].location.coordinates,
                    address: createdUsers[2].location.address,
                    city: createdUsers[2].location.city,
                    pincode: createdUsers[2].location.pincode
                },
                deliveryCharge: 55,
                maxMembers: 4,
                members: [
                    { user: createdUsers[2]._id, status: 'joined', splitAmount: 18.33 },
                    { user: createdUsers[3]._id, status: 'joined', splitAmount: 18.33 }
                ],
                status: 'active',
                maxDistance: 2,
                isPublic: true,
                notes: 'Party supplies needed! Help split the cost 🎉',
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 2.5 * 60 * 60 * 1000)
            },
            {
                creator: createdUsers[2]._id,
                platform: 'zepto',
                location: {
                    type: 'Point',
                    coordinates: createdUsers[2].location.coordinates,
                    address: createdUsers[2].location.address,
                    city: createdUsers[2].location.city,
                    pincode: createdUsers[2].location.pincode
                },
                deliveryCharge: 40,
                maxMembers: 3,
                members: [
                    { user: createdUsers[2]._id, status: 'joined', splitAmount: 20 }
                ],
                status: 'active',
                maxDistance: 1,
                isPublic: true,
                notes: 'Breakfast items for tomorrow morning',
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 1.5 * 60 * 60 * 1000)
            },
            // Karan's carts
            {
                creator: createdUsers[3]._id,
                platform: 'swiggy',
                location: {
                    type: 'Point',
                    coordinates: createdUsers[3].location.coordinates,
                    address: createdUsers[3].location.address,
                    city: createdUsers[3].location.city,
                    pincode: createdUsers[3].location.pincode
                },
                deliveryCharge: 65,
                maxMembers: 4,
                members: [
                    { user: createdUsers[3]._id, status: 'joined', splitAmount: 21.66 },
                    { user: createdUsers[1]._id, status: 'joined', splitAmount: 21.66 }
                ],
                status: 'active',
                maxDistance: 2,
                isPublic: true,
                notes: 'Study group snacks order. 2 spots available!',
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000)
            },
            {
                creator: createdUsers[3]._id,
                platform: 'blinkit',
                location: {
                    type: 'Point',
                    coordinates: createdUsers[3].location.coordinates,
                    address: createdUsers[3].location.address,
                    city: createdUsers[3].location.city,
                    pincode: createdUsers[3].location.pincode
                },
                deliveryCharge: 50,
                maxMembers: 5,
                members: [
                    { user: createdUsers[3]._id, status: 'joined', splitAmount: 16.66 },
                    { user: createdUsers[0]._id, status: 'joined', splitAmount: 16.66 },
                    { user: createdUsers[2]._id, status: 'joined', splitAmount: 16.66 }
                ],
                status: 'active',
                maxDistance: 2.5,
                isPublic: true,
                notes: 'Evening chai and pakoras! Join the fun 😊',
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
            }
        ];

        // Insert new carts
        const createdCarts = await Cart.insertMany(newCarts);
        console.log(`✅ Successfully added ${createdCarts.length} new public carts\n`);
        
        // Display summary
        console.log('═'.repeat(70));
        console.log('           🎉 NEW DEMO DATA SUMMARY           ');
        console.log('═'.repeat(70));
        
        console.log('\n👥 NEW USERS CREATED (Login: email / demo123):');
        createdUsers.forEach(user => {
            console.log(`  - ${user.name} (${user.email})`);
            console.log(`    📍 ${user.location.address}`);
        });
        
        console.log('\n📦 NEW PUBLIC CARTS:');
        const groupedCarts = {};
        createdCarts.forEach(cart => {
            const creator = createdUsers.find(u => u._id.toString() === cart.creator.toString());
            if (!groupedCarts[creator.name]) {
                groupedCarts[creator.name] = [];
            }
            groupedCarts[creator.name].push(cart);
        });
        
        Object.entries(groupedCarts).forEach(([name, carts]) => {
            console.log(`\n  ${name}:`);
            carts.forEach(cart => {
                console.log(`    - ${cart.platform.toUpperCase()} | ₹${cart.deliveryCharge} | ${cart.members.length}/${cart.maxMembers} members`);
                console.log(`      "${cart.notes}"`);
            });
        });
        
        console.log('\n' + '═'.repeat(70));
        console.log('✅ All users can now browse and join these carts!');
        console.log('═'.repeat(70) + '\n');
        
        process.exit(0);
    } catch (error) {
        console.error('Error adding demo data:', error);
        process.exit(1);
    }
}

addMoreDemoData();
