const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const admin = require('firebase-admin');
const path = require('path');
const dotenv = require('dotenv');

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

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Routes
app.get('/api/items', async (req, res) => {
  try {
    const { type } = req.query;
    console.log('Fetching items with type:', type);
    
    const itemsRef = db.collection('items');
    const query = type ? itemsRef.where('type', '==', type) : itemsRef;
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
    const userData = req.body;
    const docRef = await db.collection('users').add(userData);
    res.status(201).json({ id: docRef.id, ...userData });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something broke!', details: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the server at http://localhost:${PORT}/api/test`);
}); 