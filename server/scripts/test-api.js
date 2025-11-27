require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testSignup() {
  console.log('\n🧪 Testing Signup API...\n');

  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    phone: '9876543210',
    location: {
      coordinates: [72.8777, 19.0760],
      address: 'Test Address, Mumbai',
      city: 'Mumbai',
      pincode: '400001'
    }
  };

  try {
    console.log('📤 Sending signup request...');
    console.log('   Email:', testUser.email);

    const response = await axios.post(`${API_URL}/auth/register`, testUser);

    if (response.data.success) {
      console.log('\n✅ Signup Successful!');
      console.log('   User ID:', response.data.user.id);
      console.log('   Name:', response.data.user.name);
      console.log('   Email:', response.data.user.email);
      console.log('   Token:', response.data.token.substring(0, 20) + '...');
      console.log('\n🎉 Backend is working perfectly!\n');
      return true;
    }
  } catch (error) {
    console.log('\n❌ Signup Failed!');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Error:', error.response.data.message);
    } else {
      console.log('   Error:', error.message);
    }
    console.log('\n💡 Make sure the server is running on port 5000\n');
    return false;
  }
}

async function testHealth() {
  console.log('🏥 Testing Health Endpoint...\n');
  
  try {
    const response = await axios.get('http://localhost:5000/health');
    console.log('✅ Server is running');
    console.log('   Message:', response.data.message);
    console.log('   Time:', response.data.timestamp);
    return true;
  } catch (error) {
    console.log('❌ Server is not responding');
    console.log('   Please start the server: npm start');
    return false;
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(50));
  console.log('   ShareCart Backend Test Suite');
  console.log('='.repeat(50));

  const healthOk = await testHealth();
  if (!healthOk) {
    process.exit(1);
  }

  console.log('\n' + '-'.repeat(50) + '\n');

  const signupOk = await testSignup();
  
  if (signupOk) {
    console.log('✨ All tests passed! The backend is ready to use.\n');
  }
}

runTests();
