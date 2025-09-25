const functions = require('firebase-functions');
const express = require('express');

const app = express();

console.log('Starting minimal app...');

app.get('/', (req, res) => {
  console.log('Root route hit');
  res.json({ message: 'Minimal API is running' });
});

app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Test route working' });
});

console.log('Routes registered, exporting...');

exports.minimal = functions.https.onRequest(app);
