const mongoose = require('mongoose');
const Message = require('./models/Message');
const Cart = require('./models/Cart');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sharecart')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function addDemoMessages() {
    try {
        // Get rahul user
        const rahul = await User.findOne({ email: 'rahul@gmail.com' });
        if (!rahul) {
            console.log('❌ Rahul user not found!');
            process.exit(1);
            return;
        }

        console.log(`Found user: ${rahul.name} (${rahul.email})`);

        // Get rahul's active carts with members
        const rahulCarts = await Cart.find({ 
            creator: rahul._id,
            status: 'active',
            'members.1': { $exists: true } // Has at least 2 members (including creator)
        }).populate('members.user', 'name email').limit(3);

        if (rahulCarts.length === 0) {
            console.log('❌ No active carts with members found for Rahul');
            process.exit(1);
            return;
        }

        console.log(`\nFound ${rahulCarts.length} active carts with members\n`);

        const now = new Date();
        let totalMessages = 0;

        for (const cart of rahulCarts) {
            console.log(`Creating messages for cart: ${cart.platform.toUpperCase()}`);
            
            // Get other members (not creator)
            const otherMembers = cart.members.filter(m => m.user._id.toString() !== rahul._id.toString());
            
            if (otherMembers.length === 0) continue;

            const member1 = otherMembers[0].user;
            const member2 = otherMembers[1]?.user;

            // Create conversation for this cart
            const messages = [
                {
                    cart: cart._id,
                    sender: rahul._id,
                    content: `Hey everyone! I've created this ${cart.platform} cart. Let's coordinate our orders!`,
                    messageType: 'text',
                    createdAt: new Date(now.getTime() - 60 * 60 * 1000) // 1 hour ago
                },
                {
                    cart: cart._id,
                    sender: member1._id,
                    content: 'Great! Thanks for creating this. What time are you planning to place the order?',
                    messageType: 'text',
                    createdAt: new Date(now.getTime() - 55 * 60 * 1000) // 55 mins ago
                },
                {
                    cart: cart._id,
                    sender: rahul._id,
                    content: 'I was thinking in about 2 hours. That work for everyone?',
                    messageType: 'text',
                    createdAt: new Date(now.getTime() - 50 * 60 * 1000) // 50 mins ago
                },
                {
                    cart: cart._id,
                    sender: member1._id,
                    content: 'Perfect! That gives me time to finalize my order.',
                    messageType: 'text',
                    createdAt: new Date(now.getTime() - 45 * 60 * 1000) // 45 mins ago
                }
            ];

            // Add more messages if there's a second member
            if (member2) {
                messages.push(
                    {
                        cart: cart._id,
                        sender: member2._id,
                        content: 'Count me in! Should we share our delivery address?',
                        messageType: 'text',
                        createdAt: new Date(now.getTime() - 40 * 60 * 1000)
                    },
                    {
                        cart: cart._id,
                        sender: rahul._id,
                        content: `The delivery location is ${cart.location.address}. Make sure your address is nearby!`,
                        messageType: 'text',
                        createdAt: new Date(now.getTime() - 35 * 60 * 1000)
                    },
                    {
                        cart: cart._id,
                        sender: member2._id,
                        content: 'Yes, I\'m close by. This will save us a lot on delivery! 💰',
                        messageType: 'text',
                        createdAt: new Date(now.getTime() - 30 * 60 * 1000)
                    },
                    {
                        cart: cart._id,
                        sender: member1._id,
                        content: 'Looking forward to this! Let me know when you place the order.',
                        messageType: 'text',
                        createdAt: new Date(now.getTime() - 25 * 60 * 1000)
                    }
                );
            }

            // Delete existing messages for this cart
            await Message.deleteMany({ cart: cart._id });

            // Insert messages
            const created = await Message.insertMany(messages);
            totalMessages += created.length;
            console.log(`  ✅ Added ${created.length} messages`);
        }

        console.log('\n' + '═'.repeat(60));
        console.log('     ✅ DEMO MESSAGES CREATED SUCCESSFULLY     ');
        console.log('═'.repeat(60));
        console.log(`\n💬 Total messages created: ${totalMessages}`);
        console.log(`📦 Across ${rahulCarts.length} carts`);
        console.log(`👤 Conversations involving Rahul and cart members\n`);
        
        console.log('Cart IDs with messages:');
        rahulCarts.forEach(cart => {
            console.log(`  - ${cart._id} (${cart.platform.toUpperCase()})`);
        });

        console.log('\n' + '═'.repeat(60));
        console.log('Open any cart details page to see the chat!');
        console.log('═'.repeat(60) + '\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

addDemoMessages();
