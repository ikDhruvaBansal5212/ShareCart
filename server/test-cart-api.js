const axios = require('axios');

// Configuration
const API_URL = 'https://sharecart.onrender.com/api';
const FRONTEND_URL = 'https://share-cart-sy7v.vercel.app';

// Test user credentials
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123',
    phone: '9876543210',
    location: {
        type: 'Point',
        coordinates: [77.5946, 12.9716], // Bangalore coordinates
        address: 'MG Road',
        city: 'Bangalore',
        pincode: '560001'
    }
};

// Test cart data
const testCart = {
    platform: 'blinkit',
    deliveryCharge: 50,
    maxMembers: 4,
    items: [
        { name: 'Milk (1L)', quantity: 2, price: 30, category: 'Dairy', image: '' },
        { name: 'Bread', quantity: 1, price: 25, category: 'Bakery', image: '' },
        { name: 'Eggs (12)', quantity: 1, price: 80, category: 'Dairy', image: '' }
    ],
    notes: 'Test cart for sharing',
    isPublic: true,
    maxDistance: 5,
    location: {
        type: 'Point',
        coordinates: [77.5946, 12.9716],
        address: 'MG Road',
        city: 'Bangalore',
        pincode: '560001'
    }
};

let authToken = '';
let userId = '';
let cartId = '';

// Helper function to log results
function logResult(testName, success, data = null, error = null) {
    console.log('\n' + '='.repeat(60));
    console.log(`TEST: ${testName}`);
    console.log('='.repeat(60));
    if (success) {
        console.log('✅ PASSED');
        if (data) console.log('Response:', JSON.stringify(data, null, 2));
    } else {
        console.log('❌ FAILED');
        if (error) console.log('Error:', error.message || error);
        if (error.response) {
            console.log('Response Status:', error.response.status);
            console.log('Response Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
    console.log('='.repeat(60));
}

// Test 1: Register User
async function testRegister() {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, testUser);
        authToken = response.data.token;
        userId = response.data.user._id;
        logResult('Register User', true, response.data);
        return true;
    } catch (error) {
        // If user already exists, try login
        if (error.response && error.response.status === 400) {
            console.log('User already exists, attempting login...');
            return await testLogin();
        }
        logResult('Register User', false, null, error);
        return false;
    }
}

// Test 2: Login User
async function testLogin() {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        authToken = response.data.token;
        userId = response.data.user._id;
        logResult('Login User', true, response.data);
        return true;
    } catch (error) {
        logResult('Login User', false, null, error);
        return false;
    }
}

// Test 3: Get User Profile
async function testGetProfile() {
    try {
        const response = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logResult('Get User Profile', true, response.data);
        
        // Check if location is properly set
        if (!response.data.data.location || 
            !response.data.data.location.coordinates || 
            response.data.data.location.coordinates[0] === 0) {
            console.log('⚠️  WARNING: User location not properly set!');
            return false;
        }
        return true;
    } catch (error) {
        logResult('Get User Profile', false, null, error);
        return false;
    }
}

// Test 4: Create Cart
async function testCreateCart() {
    try {
        const response = await axios.post(`${API_URL}/carts`, testCart, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        cartId = response.data.data._id;
        logResult('Create Cart', true, response.data);
        
        // Verify cart has all required fields
        const cart = response.data.data;
        const issues = [];
        
        if (!cart.location || !cart.location.coordinates) {
            issues.push('Missing location');
        }
        if (!cart.items || cart.items.length === 0) {
            issues.push('Missing items');
        }
        if (!cart.creator) {
            issues.push('Missing creator');
        }
        if (!cart.members || cart.members.length === 0) {
            issues.push('Missing members');
        }
        
        if (issues.length > 0) {
            console.log('⚠️  WARNING: Cart created but has issues:', issues.join(', '));
            return false;
        }
        
        return true;
    } catch (error) {
        logResult('Create Cart', false, null, error);
        return false;
    }
}

// Test 5: Get All Carts (No Filters)
async function testGetCarts() {
    try {
        const response = await axios.get(`${API_URL}/carts`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logResult('Get All Carts', true, response.data);
        
        if (response.data.count === 0) {
            console.log('⚠️  WARNING: No carts returned!');
            return false;
        }
        
        return true;
    } catch (error) {
        logResult('Get All Carts', false, null, error);
        return false;
    }
}

// Test 6: Get My Carts
async function testGetMyCarts() {
    try {
        const response = await axios.get(`${API_URL}/carts/my/all`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logResult('Get My Carts', true, response.data);
        
        if (response.data.count === 0) {
            console.log('⚠️  WARNING: No carts returned for user!');
            return false;
        }
        
        return true;
    } catch (error) {
        logResult('Get My Carts', false, null, error);
        return false;
    }
}

// Test 7: Get Carts with Filters
async function testGetCartsWithFilters() {
    try {
        const response = await axios.get(`${API_URL}/carts`, {
            headers: { Authorization: `Bearer ${authToken}` },
            params: {
                platform: 'blinkit',
                sortBy: 'distance',
                limit: 10,
                page: 1
            }
        });
        logResult('Get Carts with Filters', true, response.data);
        return true;
    } catch (error) {
        logResult('Get Carts with Filters', false, null, error);
        return false;
    }
}

// Test 8: Get Single Cart
async function testGetSingleCart() {
    if (!cartId) {
        console.log('⚠️  Skipping - no cart ID available');
        return false;
    }
    
    try {
        const response = await axios.get(`${API_URL}/carts/${cartId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logResult('Get Single Cart', true, response.data);
        return true;
    } catch (error) {
        logResult('Get Single Cart', false, null, error);
        return false;
    }
}

// Test 9: Frontend Integration Test
async function testFrontendFlow() {
    console.log('\n' + '='.repeat(60));
    console.log('FRONTEND FLOW SIMULATION');
    console.log('='.repeat(60));
    
    // Simulate shop page cart sharing
    console.log('\n1. User adds items to cart on shop page...');
    const shopCart = [
        { name: 'Milk (1L)', quantity: 2, price: 30, category: 'Dairy', image: '' },
        { name: 'Bread', quantity: 1, price: 25, category: 'Bakery', image: '' }
    ];
    console.log('   Cart items:', shopCart);
    
    // Simulate clicking "Share Cart" button
    console.log('\n2. User clicks "Share Cart" button...');
    console.log('   Redirecting to shared-carts.html?action=share');
    
    // Simulate shared-carts page loading
    console.log('\n3. Shared-carts page loads and calls shareMyCart()...');
    
    // This is what the frontend does
    const cartData = {
        platform: 'blinkit',
        location: {
            type: 'Point',
            coordinates: [77.5946, 12.9716],
            address: 'MG Road',
            city: 'Bangalore',
            pincode: '560001'
        },
        deliveryCharge: 50,
        maxMembers: 4,
        items: shopCart,
        notes: 'Frontend test cart',
        isPublic: true,
        maxDistance: 5
    };
    
    try {
        const response = await axios.post(`${API_URL}/carts`, cartData, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('   ✅ Cart created successfully!');
        console.log('   Cart ID:', response.data.data._id);
        
        // Simulate loading carts on shared-carts page
        console.log('\n4. Loading all shared carts...');
        const cartsResponse = await axios.get(`${API_URL}/carts?page=1&limit=10`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('   ✅ Carts fetched:', cartsResponse.data.count);
        console.log('   Total available:', cartsResponse.data.total);
        
        return true;
    } catch (error) {
        console.log('   ❌ Frontend flow failed!');
        console.error('   Error:', error.message);
        if (error.response) {
            console.log('   Response:', error.response.data);
        }
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('\n' + '█'.repeat(60));
    console.log('🧪 STARTING COMPREHENSIVE API TESTS');
    console.log('█'.repeat(60));
    
    const results = {
        passed: 0,
        failed: 0,
        total: 0
    };
    
    // Authentication Tests
    console.log('\n📝 AUTHENTICATION TESTS');
    console.log('-'.repeat(60));
    
    results.total++;
    if (await testRegister()) results.passed++;
    else results.failed++;
    
    results.total++;
    if (await testGetProfile()) results.passed++;
    else results.failed++;
    
    // Cart Tests
    console.log('\n🛒 CART MANAGEMENT TESTS');
    console.log('-'.repeat(60));
    
    results.total++;
    if (await testCreateCart()) results.passed++;
    else results.failed++;
    
    results.total++;
    if (await testGetCarts()) results.passed++;
    else results.failed++;
    
    results.total++;
    if (await testGetMyCarts()) results.passed++;
    else results.failed++;
    
    results.total++;
    if (await testGetCartsWithFilters()) results.passed++;
    else results.failed++;
    
    results.total++;
    if (await testGetSingleCart()) results.passed++;
    else results.failed++;
    
    // Frontend Integration Test
    console.log('\n🌐 FRONTEND INTEGRATION TEST');
    console.log('-'.repeat(60));
    
    results.total++;
    if (await testFrontendFlow()) results.passed++;
    else results.failed++;
    
    // Summary
    console.log('\n' + '█'.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('█'.repeat(60));
    console.log(`Total Tests: ${results.total}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`);
    console.log('█'.repeat(60) + '\n');
    
    if (results.failed > 0) {
        console.log('⚠️  ISSUES DETECTED - Please review the failed tests above');
        process.exit(1);
    } else {
        console.log('✅ ALL TESTS PASSED!');
        process.exit(0);
    }
}

// Handle errors
process.on('unhandledRejection', (error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});

// Run tests
runAllTests();
