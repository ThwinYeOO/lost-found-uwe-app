const axios = require('axios');

const API_BASE_URL = 'https://us-central1-lostfoundportal-dbbb7.cloudfunctions.net/api';

async function createAdminUser() {
  const adminData = {
    name: 'Admin User',
    email: 'admin@uwe.ac.uk',
    phoneNumber: '1234567890',
    uweId: 'ADMIN001',
    password: 'admin123',
    role: 'admin',
    isActive: true
  };

  try {
    console.log('Creating admin user...');
    const response = await axios.post(`${API_BASE_URL}/users`, adminData);
    console.log('Admin user created successfully!');
    console.log('User ID:', response.data.id);
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('\nYou can now log in with these credentials to access the admin dashboard.');
  } catch (error) {
    if (error.response) {
      console.error('Error creating admin user:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${API_BASE_URL}/test`);
    return true;
  } catch (error) {
    console.log('Using production server...');
    return true; // Always return true for production
  }
}

async function main() {
  console.log('UWE Lost & Found - Admin User Creator');
  console.log('=====================================\n');
  
  const serverRunning = await checkServer();
  if (serverRunning) {
    await createAdminUser();
  }
}

main();
