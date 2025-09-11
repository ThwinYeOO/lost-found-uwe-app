// Email Configuration Example
// Copy this file to email-config.js and update with your actual credentials

module.exports = {
  // Gmail SMTP Configuration
  email: {
    user: 'your-email@gmail.com', // Your Gmail address
    pass: 'your-app-password'     // Your Gmail app password (not your regular password)
  }
};

// Instructions for setting up Gmail App Password:
// 1. Go to your Google Account settings
// 2. Enable 2-Factor Authentication if not already enabled
// 3. Go to Security > App passwords
// 4. Generate a new app password for "Mail"
// 5. Use this app password in the 'pass' field above
// 6. Never use your regular Gmail password for this
