# Admin Setup Guide

## Overview
The UWE Lost & Found application now includes a comprehensive admin dashboard for managing users, items, and messages.

## Admin Features

### Dashboard
- **Statistics Overview**: View total users, items, messages, and active users
- **Charts**: Visual representation of items and users by month
- **Recent Activity**: See latest users and items

### User Management
- **View All Users**: Complete list of registered users
- **Role Management**: Promote users to admin or demote to regular user
- **Status Management**: Activate or deactivate user accounts
- **User Search**: Search users by name, email, or UWE ID
- **Delete Users**: Remove user accounts (with confirmation)

### Item Management
- **View All Items**: Complete list of lost and found items
- **Item Search**: Search items by name, description, or location
- **Delete Items**: Remove items from the system (with confirmation)
- **Status Tracking**: View item status and resolution

### Message Management
- **View All Messages**: Complete list of messages between users
- **Message Search**: Search messages by content, sender, or recipient
- **Delete Messages**: Remove messages from the system (with confirmation)
- **Read Status**: View message read status

## Setting Up Admin Access

### Method 1: Through Registration
1. Register a new user account through the normal registration process
2. The user will be created with role 'user' by default
3. Use the admin dashboard to promote the user to 'admin' role

### Method 2: Direct Database Update
1. Create a user account normally
2. In your Firestore database, find the user document
3. Update the `role` field to `"admin"`
4. Set `isActive` to `true`

### Method 3: Using the Backend API
```bash
# Create an admin user directly
curl -X POST http://localhost:5001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@uwe.ac.uk",
    "phoneNumber": "1234567890",
    "uweId": "ADMIN001",
    "password": "adminpassword",
    "role": "admin",
    "isActive": true
  }'
```

## Accessing Admin Dashboard

1. **Login as Admin**: Use your admin credentials to log in
2. **Navigate to Admin**: Click the "Admin" button in the navigation bar
3. **Admin Dashboard**: You'll see the comprehensive admin interface

## Admin Navigation

- **Dashboard Tab**: Overview with statistics and charts
- **Users Tab**: Manage all users, roles, and status
- **Items Tab**: Manage all lost and found items
- **Messages Tab**: View and manage all messages

## Security Features

- **Role-based Access**: Only users with `role: "admin"` can access admin features
- **Authentication Required**: Must be logged in as admin
- **Confirmation Dialogs**: All delete operations require confirmation
- **Search Functionality**: Easy filtering and searching across all data

## API Endpoints

### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics and data

### User Management
- `DELETE /api/admin/users/:id` - Delete a user
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/users/:id/status` - Update user status

### Item Management
- `DELETE /api/admin/items/:id` - Delete an item

### Message Management
- `GET /api/admin/messages` - Get all messages
- `DELETE /api/admin/messages/:id` - Delete a message

## Troubleshooting

### Can't Access Admin Dashboard
- Ensure you're logged in with an admin account
- Check that the user has `role: "admin"` in the database
- Verify the user account is active (`isActive: true`)

### Admin Button Not Showing
- Make sure you're logged in as an admin user
- Check the browser console for any errors
- Refresh the page after logging in

### Permission Denied
- Verify the user has admin role
- Check if the user account is active
- Ensure you're using the correct credentials

## Best Practices

1. **Regular Backups**: Always backup your data before making bulk changes
2. **Test Changes**: Test admin functions in a development environment first
3. **Monitor Activity**: Regularly check the admin dashboard for system health
4. **User Communication**: Inform users before making significant changes
5. **Security**: Keep admin credentials secure and change them regularly

## Support

If you encounter any issues with the admin functionality:
1. Check the browser console for error messages
2. Verify the backend server is running
3. Check the database connection
4. Review the API endpoints for proper responses
