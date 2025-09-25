const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const multer = require('multer');
const { sendMessageNotification, sendWelcomeEmail } = require('./services/emailService');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
let serviceAccount;
try {
  serviceAccount = require('../config/firebase-admin.json');
} catch (error) {
  console.error('Error loading firebase-admin.json:', error);
  process.exit(1);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

const db = admin.firestore();
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Routes
app.get('/api/items', async (req, res) => {
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
      items.push({
        id: doc.id,
        ...data,
        dateLostFound: data.dateLostFound?.toDate()
      });
    });
    
    console.log(`Found ${items.length} items`);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items', details: error.message });
  }
});

app.post('/api/items', async (req, res) => {
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

app.put('/api/items/:id', async (req, res) => {
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

app.get('/api/items/search', async (req, res) => {
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
        items.push({
          id: doc.id,
          ...item,
          dateLostFound: item.dateLostFound?.toDate()
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
app.get('/api/users', async (req, res) => {
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

app.post('/api/users', async (req, res) => {
  try {
    const userData = {
      ...req.body,
      role: req.body.role || 'user',
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      createdAt: admin.firestore.Timestamp.now(),
      lastLogin: admin.firestore.Timestamp.now()
    };
    const docRef = await db.collection('users').add(userData);
    
    // Send welcome email to new user
    try {
      await sendWelcomeEmail(userData);
      console.log('Welcome email sent successfully');
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the user creation if email fails
    }
    
    res.status(201).json({ id: docRef.id, ...userData });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
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

app.get('/api/users/search', async (req, res) => {
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

app.get('/api/users/:id', async (req, res) => {
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
app.post('/api/messages', async (req, res) => {
  try {
    const messageData = {
      ...req.body,
      timestamp: admin.firestore.Timestamp.now(),
      read: false
    };
    
    console.log('Creating new message:', messageData);
    const docRef = await db.collection('messages').add(messageData);
    console.log('Message created with ID:', docRef.id);
    
    // Send email notification to recipient
    try {
      await sendMessageNotification(messageData);
      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the message creation if email fails
    }
    
    res.status(201).json({ id: docRef.id, ...messageData });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message', details: error.message });
  }
});

app.get('/api/messages', async (req, res) => {
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

// Profile photo upload endpoint
app.post('/api/upload-profile-photo', upload.single('profilePhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Generate the file URL
    const baseUrl = process.env.RENDER_EXTERNAL_URL || `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    // Update user's avatar in Firestore
    await db.collection('users').doc(userId).update({
      avatar: fileUrl
    });

    console.log(`Profile photo uploaded for user ${userId}: ${fileUrl}`);
    
    res.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      avatarUrl: fileUrl
    });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ error: 'Failed to upload profile photo', details: error.message });
  }
});

// Admin routes
app.get('/api/admin/dashboard', async (req, res) => {
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
      users.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        lastLogin: doc.data().lastLogin?.toDate()
      });
    });

    itemsSnapshot.forEach(doc => {
      items.push({
        id: doc.id,
        ...doc.data(),
        dateLostFound: doc.data().dateLostFound?.toDate()
      });
    });

    messagesSnapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
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
app.delete('/api/admin/users/:id', async (req, res) => {
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

app.put('/api/admin/users/:id/role', async (req, res) => {
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

app.put('/api/admin/users/:id/status', async (req, res) => {
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
app.delete('/api/admin/items/:id', async (req, res) => {
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
app.get('/api/admin/messages', async (req, res) => {
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

app.delete('/api/admin/messages/:id', async (req, res) => {
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the server at http://localhost:${PORT}/api/test`);
}); 