# UWE Lost and Found Portal

A web application for University of the West of England (UWE) students to report and find lost items on campus.

## Features

### User Features
- Report lost items
- Report found items
- Search for lost/found items
- User authentication and profiles
- Image upload for items
- Real-time messaging between users
- Chat history and notifications

### Admin Features
- **Comprehensive Dashboard**: Statistics, charts, and analytics
- **User Management**: View, edit, delete users; manage roles and status
- **Item Management**: View, edit, delete all lost/found items
- **Message Management**: View and manage all user messages
- **Search & Filter**: Advanced search across all data
- **Role-based Access Control**: Secure admin authentication

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: Firebase Firestore
- Authentication: Firebase Auth
- Storage: Firebase Storage

## Project Structure

```
lost-found-uwe-app/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts (Admin)
│   │   ├── services/       # API services
│   │   └── types.ts        # TypeScript interfaces
├── backend/                # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   └── services/       # Business logic
├── ADMIN_SETUP.md          # Admin setup guide
├── create-admin.js         # Admin user creation script
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory and add your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   PORT=5001
   FIREBASE_ADMIN_PROJECT_ID=your_project_id
   FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
   FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Admin Setup

### Quick Admin Setup

1. Start both frontend and backend servers
2. Run the admin creation script:
   ```bash
   node create-admin.js
   ```
3. Login with the created admin credentials
4. Access the admin dashboard at `/admin`

### Manual Admin Setup

1. Register a regular user account
2. Access the admin dashboard (if you have admin access)
3. Promote the user to admin role
4. Or manually update the user's role in Firestore to `"admin"`

For detailed admin setup instructions, see [ADMIN_SETUP.md](./ADMIN_SETUP.md).

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 