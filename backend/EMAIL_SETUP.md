# Email Setup Instructions

The UWE Lost & Found Portal now includes email notification functionality. When users send messages to each other, the recipient will receive an email notification.

## Setup Instructions

### 1. Gmail App Password Setup

To send emails through Gmail, you need to set up an App Password:

1. **Enable 2-Factor Authentication** on your Google Account (if not already enabled)
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Under "Signing in to Google", click on **App passwords**
4. Select **Mail** as the app and **Other** as the device
5. Enter "UWE Lost & Found Portal" as the device name
6. Copy the generated 16-character password

### 2. Configure Email Settings

Create a file called `email-config.js` in the backend directory with the following content:

```javascript
module.exports = {
  email: {
    user: 'your-email@gmail.com',        // Your Gmail address
    pass: 'your-16-character-app-password' // The app password from step 1
  }
};
```

**Important:** 
- Replace `your-email@gmail.com` with your actual Gmail address
- Replace `your-16-character-app-password` with the app password you generated
- Never use your regular Gmail password

### 3. Alternative: Environment Variables

Instead of creating `email-config.js`, you can set environment variables:

```bash
export EMAIL_USER=your-email@gmail.com
export EMAIL_PASS=your-16-character-app-password
```

### 4. Test Email Functionality

After setting up the configuration, restart the backend server:

```bash
cd backend
node src/index.js
```

The system will now automatically send email notifications when:
- Users send messages to each other
- New users register (welcome email)

### 5. Email Templates

The system includes two email templates:

1. **Message Notification**: Sent when someone receives a new message
2. **Welcome Email**: Sent to new users when they register

Both emails are professionally designed with the UWE Lost & Found Portal branding.

## Troubleshooting

### Common Issues:

1. **"Invalid login" error**: 
   - Make sure you're using an App Password, not your regular Gmail password
   - Verify 2-Factor Authentication is enabled

2. **"Less secure app access" error**:
   - Use App Passwords instead of enabling less secure app access
   - App Passwords are more secure

3. **Emails not being received**:
   - Check spam/junk folder
   - Verify the recipient email address is correct
   - Check server logs for email sending errors

### Testing Email Functionality:

You can test the email functionality by sending a message through the portal or using the API directly:

```bash
curl -X POST "http://localhost:5001/api/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "test-sender",
    "senderName": "Test Sender", 
    "senderEmail": "test@example.com",
    "recipientId": "recipient-id",
    "recipientName": "Recipient Name",
    "recipientEmail": "recipient@gmail.com",
    "subject": "Test Message",
    "content": "This is a test message."
  }'
```

## Security Notes

- Never commit `email-config.js` to version control
- Use App Passwords instead of regular passwords
- Consider using environment variables in production
- The email service gracefully handles failures without breaking message creation
