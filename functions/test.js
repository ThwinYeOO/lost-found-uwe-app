const functions = require('firebase-functions');
const express = require('express');

const app = express();

// Simple test routes
app.get('/', (req, res) => {
  res.json({ message: 'Test API is running' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

app.get('/api/items', (req, res) => {
  res.json({ message: 'Items route working', query: req.query });
});

// Export the API as a Firebase Function
exports.testapi = functions.https.onRequest(app);
