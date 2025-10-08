const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
const firebaseStorage = admin.storage();

const app = express();

// Middleware - Simplified CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(cors());

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Add a simple root route for testing
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.json({ message: 'API is running', timestamp: new Date().toISOString() });
});

console.log('Registering routes...');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage for Cloud Functions
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    fieldSize: 10 * 1024 * 1024, // 10MB field size limit
  },
  fileFilter: function (req, file, cb) {
    console.log('File filter called with:', file);
    // Check file type
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      console.log('File type rejected:', file.mimetype);
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Test route
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Simple items route for testing
app.get('/items-simple', (req, res) => {
  console.log('Simple items route hit');
  res.json({ message: 'Items route working', query: req.query });
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { emailOrName, password } = req.body;
    console.log('Login attempt for:', emailOrName);
    
    if (!emailOrName || !password) {
      return res.status(400).json({ error: 'Email/Name and password are required' });
    }
    
    // Query users collection to find matching user
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', emailOrName).get();
    
    let user = null;
    if (!snapshot.empty) {
      // Found by email
      user = snapshot.docs[0].data();
      user.id = snapshot.docs[0].id;
    } else {
      // Try to find by name
      const nameSnapshot = await usersRef.where('name', '==', emailOrName).get();
      if (!nameSnapshot.empty) {
        user = nameSnapshot.docs[0].data();
        user.id = nameSnapshot.docs[0].id;
      }
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password (in a real app, you'd hash passwords)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    await usersRef.doc(user.id).update({
      lastLogin: admin.firestore.Timestamp.now()
    });
    
    // Remove password from response
    delete user.password;
    
    console.log('Login successful for user:', user.name);
    res.json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

console.log('Test route registered');

// Routes
console.log('Registering items route...');
app.get('/items', async (req, res) => {
  try {
    const { type, reportUserId } = req.query;
    console.log('Fetching items with type:', type, 'and reportUserId:', reportUserId);
    
    const itemsRef = db.collection('items');
    let query = itemsRef;

    if (type) {
      query = query.where('type', '==', type);
    }
    if (reportUserId) {
      query = query.where('reportUserId', '==', reportUserId);
    }

    const snapshot = await query.get();
    
    const items = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      let dateLostFound = data.dateLostFound;
      
      // Handle different date formats
      if (dateLostFound && typeof dateLostFound.toDate === 'function') {
        dateLostFound = dateLostFound.toDate();
      } else if (dateLostFound && typeof dateLostFound === 'string') {
        dateLostFound = new Date(dateLostFound);
      } else if (dateLostFound && dateLostFound.seconds) {
        // Handle Firestore timestamp format
        dateLostFound = new Date(dateLostFound.seconds * 1000);
      }
      
      items.push({
        id: doc.id,
        ...data,
        dateLostFound: dateLostFound
      });
    });
    
    console.log(`Found ${items.length} items`);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items', details: error.message });
  }
});

app.post('/items', async (req, res) => {
  try {
    const itemData = {
      ...req.body,
      dateLostFound: admin.firestore.Timestamp.fromDate(new Date(req.body.dateLostFound))
    };
    
    console.log('Creating new item:', itemData);
    const docRef = await db.collection('items').add(itemData);
    console.log('Item created with ID:', docRef.id);
    
    res.status(201).json({ id: docRef.id, ...itemData });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item', details: error.message });
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const itemData = {
      ...req.body,
      dateLostFound: admin.firestore.Timestamp.fromDate(new Date(req.body.dateLostFound))
    };
    
    console.log('Updating item with ID:', id, 'Data:', itemData);
    
    // Check if item exists
    const itemRef = db.collection('items').doc(id);
    const itemDoc = await itemRef.get();
    
    if (!itemDoc.exists) {
      return res.status(404).json({ error: 'Item not found', details: 'Item with the specified ID does not exist' });
    }
    
    // Update the item document
    await itemRef.update(itemData);
    
    // Get the updated item data
    const updatedItemDoc = await itemRef.get();
    const updatedItem = {
      id: updatedItemDoc.id,
      ...updatedItemDoc.data(),
      dateLostFound: updatedItemDoc.data().dateLostFound?.toDate()
    };
    
    console.log('Item updated successfully:', updatedItem);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item', details: error.message });
  }
});

app.get('/items/search', async (req, res) => {
  try {
    const { query, type } = req.query;
    console.log('Searching items with query:', query, 'and type:', type);
    
    const itemsRef = db.collection('items');
    const snapshot = await itemsRef.where('type', '==', type).get();
    
    const items = [];
    snapshot.forEach(doc => {
      const item = doc.data();
      const searchFields = [
        item.name,
        item.description,
        item.locationLostFound
      ].map(field => field.toLowerCase());
      
      if (searchFields.some(field => field.includes(query.toLowerCase()))) {
        let dateLostFound = item.dateLostFound;
        
        // Handle different date formats
        if (dateLostFound && typeof dateLostFound.toDate === 'function') {
          dateLostFound = dateLostFound.toDate();
        } else if (dateLostFound && typeof dateLostFound === 'string') {
          dateLostFound = new Date(dateLostFound);
        } else if (dateLostFound && dateLostFound.seconds) {
          // Handle Firestore timestamp format
          dateLostFound = new Date(dateLostFound.seconds * 1000);
        }
        
        items.push({
          id: doc.id,
          ...item,
          dateLostFound: dateLostFound
        });
      }
    });
    
    console.log(`Found ${items.length} matching items`);
    res.json(items);
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({ error: 'Failed to search items', details: error.message });
  }
});

// User routes
app.get('/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = [];
    snapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const userData = {
      ...req.body,
      role: req.body.role || 'user',
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      createdAt: admin.firestore.Timestamp.now(),
      lastLogin: admin.firestore.Timestamp.now()
    };
    const docRef = await db.collection('users').add(userData);
    
    res.status(201).json({ id: docRef.id, ...userData });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    console.log('Updating user with ID:', id, 'Data:', userData);
    
    // Check if user exists
    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found', details: 'User with the specified ID does not exist' });
    }
    
    // Update the user document
    await userRef.update(userData);
    
    // Get the updated user data
    const updatedUserDoc = await userRef.get();
    const updatedUser = {
      id: updatedUserDoc.id,
      ...updatedUserDoc.data()
    };
    
    console.log('User updated successfully:', updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

app.get('/users/search', async (req, res) => {
  try {
    const { query } = req.query;
    console.log('Searching users with query:', query);
    
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    const users = [];
    snapshot.forEach(doc => {
      const user = doc.data();
      const searchFields = [
        user.name,
        user.email,
        user.uweId
      ].map(field => field ? field.toLowerCase() : '');
      
      if (searchFields.some(field => field.includes(query.toLowerCase()))) {
        users.push({
          id: doc.id,
          ...user
        });
      }
    });
    
    console.log(`Found ${users.length} matching users`);
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users', details: error.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching user with ID:', id);
    
    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found', details: 'User with the specified ID does not exist' });
    }
    
    const user = {
      id: userDoc.id,
      ...userDoc.data()
    };
    
    console.log('User found:', user);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
});

// Message routes
app.post('/messages', async (req, res) => {
  try {
    const messageData = {
      ...req.body,
      timestamp: admin.firestore.Timestamp.now(),
      read: false,
      status: 'sent', // Initial status
      deliveredAt: null,
      seenAt: null
    };
    
    console.log('Creating new message:', messageData);
    const docRef = await db.collection('messages').add(messageData);
    console.log('Message created with ID:', docRef.id);
    
    // Update status to delivered immediately (since we're using real-time)
    await docRef.update({
      status: 'delivered',
      deliveredAt: admin.firestore.Timestamp.now()
    });
    
    const updatedMessage = {
      id: docRef.id,
      ...messageData,
      status: 'delivered',
      deliveredAt: new Date()
    };
    
    res.status(201).json(updatedMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message', details: error.message });
  }
});

// Mark messages as read
app.put('/messages/mark-as-read', async (req, res) => {
  try {
    const { userId, chatWith } = req.body;
    console.log(`Marking messages as read for user: ${userId} with: ${chatWith}`);
    
    if (!userId || !chatWith) {
      return res.status(400).json({ error: 'userId and chatWith are required' });
    }
    
    // Get all unread messages from the other user to this user
    const messagesSnapshot = await db.collection('messages')
      .where('senderId', '==', chatWith)
      .where('recipientId', '==', userId)
      .where('read', '==', false)
      .get();
    
    if (messagesSnapshot.empty) {
      return res.json({ message: 'No unread messages found' });
    }
    
    // Update all unread messages to read and seen
    const batch = db.batch();
    const now = admin.firestore.Timestamp.now();
    messagesSnapshot.forEach(doc => {
      batch.update(doc.ref, { 
        read: true,
        status: 'seen',
        seenAt: now
      });
    });
    
    await batch.commit();
    
    console.log(`Marked ${messagesSnapshot.size} messages as read`);
    res.json({ 
      success: true, 
      message: `Marked ${messagesSnapshot.size} messages as read` 
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read', details: error.message });
  }
});

// Update message status
app.put('/messages/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`Updating message ${id} status to: ${status}`);
    
    if (!['sent', 'delivered', 'seen'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be sent, delivered, or seen' });
    }
    
    const messageRef = db.collection('messages').doc(id);
    const messageDoc = await messageRef.get();
    
    if (!messageDoc.exists) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    const updateData = { status };
    
    if (status === 'delivered') {
      updateData.deliveredAt = admin.firestore.Timestamp.now();
    } else if (status === 'seen') {
      updateData.seenAt = admin.firestore.Timestamp.now();
      updateData.read = true;
    }
    
    await messageRef.update(updateData);
    
    console.log(`Message ${id} status updated to ${status}`);
    res.json({ 
      success: true, 
      message: `Message status updated to ${status}`,
      status,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ error: 'Failed to update message status', details: error.message });
  }
});

app.get('/messages', async (req, res) => {
  try {
    const { userId, chatWith } = req.query;
    console.log(`Fetching messages for user: ${userId}${chatWith ? ` (chat with: ${chatWith})` : ''}`);
    
    let messages = [];
    
    if (userId && chatWith) {
      // Get messages between two specific users
      const sentMessagesSnapshot = await db.collection('messages')
        .where('senderId', '==', userId)
        .where('recipientId', '==', chatWith)
        .get();
      
      const receivedMessagesSnapshot = await db.collection('messages')
        .where('senderId', '==', chatWith)
        .where('recipientId', '==', userId)
        .get();
      
      // Combine both sent and received messages
      sentMessagesSnapshot.forEach(doc => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate()
        });
      });
      
      receivedMessagesSnapshot.forEach(doc => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate()
        });
      });
    } else if (userId) {
      // Get all messages where the user is either sender or recipient
      const sentMessagesSnapshot = await db.collection('messages')
        .where('senderId', '==', userId)
        .get();
      
      const receivedMessagesSnapshot = await db.collection('messages')
        .where('recipientId', '==', userId)
        .get();
      
      // Combine both sent and received messages
      sentMessagesSnapshot.forEach(doc => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate()
        });
      });
      
      receivedMessagesSnapshot.forEach(doc => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate()
        });
      });
    }
    
    // Sort messages by timestamp (oldest first for chat display)
    messages.sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }
      return 0;
    });
    
    console.log(`Found ${messages.length} messages`);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
});

// Profile photo upload endpoint (base64 approach)
app.post('/upload-profile-photo', async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Request body keys:', Object.keys(req.body));
    
    const { userId, imageData } = req.body;
    
    if (!userId) {
      console.log('No userId provided');
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!imageData) {
      console.log('No image data provided');
      return res.status(400).json({ error: 'Image data is required' });
    }

    console.log(`Processing upload for user: ${userId}`);
    console.log(`Image data length: ${imageData.length} characters`);

    // Validate that it's a base64 image
    if (!imageData.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image format. Please provide a valid image file.' });
    }

    // Update user's avatar in Firestore with base64 data
    console.log('Updating user avatar in Firestore...');
    await db.collection('users').doc(userId).update({
      avatar: imageData
    });
    console.log('User avatar updated in Firestore');
    
    res.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      avatarUrl: imageData
    });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ error: 'Failed to upload profile photo', details: error.message });
  }
});

// Item image upload endpoint
app.post('/api/upload-item-image', async (req, res) => {
  try {
    console.log('Item image upload request received');
    console.log('Request body keys:', Object.keys(req.body));
    
    const { imageData } = req.body;
    
    if (!imageData) {
      console.log('No image data provided');
      return res.status(400).json({ error: 'Image data is required' });
    }

    console.log(`Processing item image upload`);
    console.log(`Image data length: ${imageData.length} characters`);

    // Validate that it's a base64 image
    if (!imageData.startsWith('data:image/')) {
      console.log('Invalid image format');
      return res.status(400).json({ error: 'Invalid image format. Must be base64 encoded image.' });
    }

    // For now, we'll return the base64 data as the URL
    // In a production environment, you might want to upload to a cloud storage service
    const imageUrl = imageData;

    console.log(`Item image processed successfully`);
    
    res.json({
      success: true,
      message: 'Item image uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Error uploading item image:', error);
    res.status(500).json({ error: 'Failed to upload item image', details: error.message });
  }
});

// Admin routes
app.get('/admin/dashboard', async (req, res) => {
  try {
    console.log('Fetching admin dashboard data');
    
    // Get all collections
    const [usersSnapshot, itemsSnapshot, messagesSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('items').get(),
      db.collection('messages').get()
    ]);

    const users = [];
    const items = [];
    const messages = [];

    usersSnapshot.forEach(doc => {
      const data = doc.data();
      
      // Handle createdAt timestamp
      let createdAt = data.createdAt;
      if (createdAt && typeof createdAt.toDate === 'function') {
        createdAt = createdAt.toDate();
      } else if (createdAt && typeof createdAt === 'string') {
        createdAt = new Date(createdAt);
      } else if (createdAt && createdAt.seconds) {
        createdAt = new Date(createdAt.seconds * 1000);
      }
      
      // Handle lastLogin timestamp
      let lastLogin = data.lastLogin;
      if (lastLogin && typeof lastLogin.toDate === 'function') {
        lastLogin = lastLogin.toDate();
      } else if (lastLogin && typeof lastLogin === 'string') {
        lastLogin = new Date(lastLogin);
      } else if (lastLogin && lastLogin.seconds) {
        lastLogin = new Date(lastLogin.seconds * 1000);
      }
      
      users.push({
        id: doc.id,
        ...data,
        createdAt: createdAt,
        lastLogin: lastLogin
      });
    });

    itemsSnapshot.forEach(doc => {
      const data = doc.data();
      let dateLostFound = data.dateLostFound;
      
      // Handle different date formats
      if (dateLostFound && typeof dateLostFound.toDate === 'function') {
        dateLostFound = dateLostFound.toDate();
      } else if (dateLostFound && typeof dateLostFound === 'string') {
        dateLostFound = new Date(dateLostFound);
      } else if (dateLostFound && dateLostFound.seconds) {
        // Handle Firestore timestamp format
        dateLostFound = new Date(dateLostFound.seconds * 1000);
      }
      
      items.push({
        id: doc.id,
        ...data,
        dateLostFound: dateLostFound
      });
    });

    messagesSnapshot.forEach(doc => {
      const data = doc.data();
      let timestamp = data.timestamp;
      
      // Handle different timestamp formats
      if (timestamp && typeof timestamp.toDate === 'function') {
        timestamp = timestamp.toDate();
      } else if (timestamp && typeof timestamp === 'string') {
        timestamp = new Date(timestamp);
      } else if (timestamp && timestamp.seconds) {
        // Handle Firestore timestamp format
        timestamp = new Date(timestamp.seconds * 1000);
      }
      
      messages.push({
        id: doc.id,
        ...data,
        timestamp: timestamp
      });
    });

    // Calculate statistics
    const totalUsers = users.length;
    const totalItems = items.length;
    const totalLostItems = items.filter(item => item.type === 'Lost').length;
    const totalFoundItems = items.filter(item => item.type === 'Found').length;
    const totalMessages = messages.length;
    const activeUsers = users.filter(user => user.isActive !== false).length;

    // Get recent items (last 10)
    const recentItems = items
      .sort((a, b) => new Date(b.dateLostFound) - new Date(a.dateLostFound))
      .slice(0, 10);

    // Get recent users (last 10)
    const recentUsers = users
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 10);

    // Generate chart data for items by month
    const itemsByMonth = {};
    items.forEach(item => {
      const month = new Date(item.dateLostFound).toISOString().slice(0, 7); // YYYY-MM
      if (!itemsByMonth[month]) {
        itemsByMonth[month] = { lost: 0, found: 0 };
      }
      itemsByMonth[month][item.type.toLowerCase()]++;
    });

    const chartData = {
      itemsByMonth: Object.entries(itemsByMonth).map(([month, data]) => ({
        month,
        lost: data.lost,
        found: data.found
      })),
      usersByMonth: Object.entries(
        users.reduce((acc, user) => {
          const month = new Date(user.createdAt || 0).toISOString().slice(0, 7);
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {})
      ).map(([month, count]) => ({ month, count }))
    };

    const dashboardData = {
      stats: {
        totalUsers,
        totalItems,
        totalLostItems,
        totalFoundItems,
        totalMessages,
        activeUsers,
        recentItems,
        recentUsers
      },
      chartData
    };

    console.log('Admin dashboard data fetched successfully');
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch admin dashboard data', details: error.message });
  }
});

// Admin user management routes
app.delete('/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting user with ID:', id);
    
    // Check if user exists
    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Delete the user
    await userRef.delete();
    
    console.log('User deleted successfully');
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

app.put('/admin/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    console.log('Updating user role:', id, 'to', role);
    
    // Check if user exists
    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update the user role
    await userRef.update({ role });
    
    console.log('User role updated successfully');
    res.json({ success: true, message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role', details: error.message });
  }
});

app.put('/admin/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    console.log('Updating user status:', id, 'to', isActive);
    
    // Check if user exists
    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update the user status
    await userRef.update({ isActive });
    
    console.log('User status updated successfully');
    res.json({ success: true, message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status', details: error.message });
  }
});

// Admin item management routes
app.post('/admin/items', async (req, res) => {
  try {
    const itemData = req.body;
    console.log('Creating new item:', itemData);
    
    // Validate required fields
    if (!itemData.name || !itemData.description || !itemData.type || !itemData.locationLostFound) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Add timestamp
    const newItem = {
      ...itemData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    // Create the item
    const docRef = await db.collection('items').add(newItem);
    
    console.log('Item created successfully with ID:', docRef.id);
    res.status(201).json({ 
      success: true, 
      message: 'Item created successfully',
      id: docRef.id,
      ...newItem
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item', details: error.message });
  }
});

app.put('/admin/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const itemData = req.body;
    console.log('Updating item with ID:', id);
    
    // Check if item exists
    const itemRef = db.collection('items').doc(id);
    const itemDoc = await itemRef.get();
    
    if (!itemDoc.exists) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Update the item
    const updatedData = {
      ...itemData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await itemRef.update(updatedData);
    
    // Get the updated item
    const updatedDoc = await itemRef.get();
    const updatedItem = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };
    
    console.log('Item updated successfully');
    res.json({ 
      success: true, 
      message: 'Item updated successfully',
      ...updatedItem
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item', details: error.message });
  }
});

app.delete('/admin/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting item with ID:', id);
    
    // Check if item exists
    const itemRef = db.collection('items').doc(id);
    const itemDoc = await itemRef.get();
    
    if (!itemDoc.exists) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Delete the item
    await itemRef.delete();
    
    console.log('Item deleted successfully');
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item', details: error.message });
  }
});

// Admin message management routes
app.get('/admin/messages', async (req, res) => {
  try {
    console.log('Fetching all messages for admin');
    
    const messagesSnapshot = await db.collection('messages').get();
    const messages = [];
    
    messagesSnapshot.forEach(doc => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate()
      });
    });
    
    // Sort by timestamp (newest first)
    messages.sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
      return 0;
    });
    
    console.log(`Found ${messages.length} messages`);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
});

app.delete('/admin/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting message with ID:', id);
    
    // Check if message exists
    const messageRef = db.collection('messages').doc(id);
    const messageDoc = await messageRef.get();
    
    if (!messageDoc.exists) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Delete the message
    await messageRef.delete();
    
    console.log('Message deleted successfully');
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message', details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something broke!', details: err.message });
});

// Catch-all route for debugging
app.use('*', (req, res) => {
  console.log('Catch-all route hit for:', req.originalUrl);
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

console.log('All routes registered, exporting function...');
// Export the API as a Firebase Function
exports.api = functions.https.onRequest(app);
