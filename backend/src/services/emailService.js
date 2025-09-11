const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP
// For production, you should use environment variables for credentials
const createTransporter = () => {
  // Try to load email config, fallback to environment variables or defaults
  let emailConfig;
  try {
    emailConfig = require('../../email-config.js');
  } catch (error) {
    // Config file doesn't exist, use environment variables or defaults
    emailConfig = {
      email: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    };
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailConfig.email.user,
      pass: emailConfig.email.pass
    }
  });
};

// Send message notification email
const sendMessageNotification = async (messageData) => {
  try {
    const transporter = createTransporter();
    
    // Get email config for from address
    let emailConfig;
    try {
      emailConfig = require('../../email-config.js');
    } catch (error) {
      emailConfig = {
        email: {
          user: process.env.EMAIL_USER || 'your-email@gmail.com'
        }
      };
    }
    
    const mailOptions = {
      from: emailConfig.email.user,
      to: messageData.recipientEmail,
      subject: `New Message from ${messageData.senderName} - UWE Lost & Found Portal`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1976d2; color: white; padding: 20px; text-align: center;">
            <h1>UWE Lost & Found Portal</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f5f5f5;">
            <h2>You have received a new message!</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>From:</strong> ${messageData.senderName}</p>
              <p><strong>Email:</strong> ${messageData.senderEmail}</p>
              <p><strong>Subject:</strong> ${messageData.subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #1976d2; margin: 10px 0;">
                ${messageData.content.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="http://localhost:3000" 
                 style="background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Visit UWE Lost & Found Portal
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
              <p>This message was sent through the UWE Lost & Found Portal messaging system.</p>
              <p>If you believe this message was sent in error, please contact the portal administrator.</p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send welcome email to new users
const sendWelcomeEmail = async (userData) => {
  try {
    const transporter = createTransporter();
    
    // Get email config for from address
    let emailConfig;
    try {
      emailConfig = require('../../email-config.js');
    } catch (error) {
      emailConfig = {
        email: {
          user: process.env.EMAIL_USER || 'your-email@gmail.com'
        }
      };
    }
    
    const mailOptions = {
      from: emailConfig.email.user,
      to: userData.email,
      subject: 'Welcome to UWE Lost & Found Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1976d2; color: white; padding: 20px; text-align: center;">
            <h1>Welcome to UWE Lost & Found Portal</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f5f5f5;">
            <h2>Hello ${userData.name}!</h2>
            
            <p>Welcome to the UWE Lost & Found Portal! Your account has been successfully created.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Your Account Details:</h3>
              <p><strong>Name:</strong> ${userData.name}</p>
              <p><strong>Email:</strong> ${userData.email}</p>
              <p><strong>UWE ID:</strong> ${userData.uweId}</p>
              <p><strong>Phone:</strong> ${userData.phoneNumber}</p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="http://localhost:3000" 
                 style="background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Start Using the Portal
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
              <p>Thank you for joining the UWE Lost & Found Portal community!</p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

module.exports = {
  sendMessageNotification,
  sendWelcomeEmail
};
