import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Message as MessageIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { getUserById, sendMessage } from '../services/firestore';
import { User } from '../types';
import ChatBox from '../components/ChatBox';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setError('User ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userData = await getUserById(userId);
        setUser(userData);
        
        // Check if chat should be opened from URL parameter
        if (searchParams.get('chat') === 'true') {
          setChatOpen(true);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, searchParams]);

  const getAccountStatus = (user: User) => {
    // You can add logic here to determine account status
    // For now, we'll consider all users as active
    return {
      status: 'Active',
      color: 'success' as const,
      icon: <CheckCircleIcon />,
    };
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user) return;

    setSendingMessage(true);
    try {
      // Get current user from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('User not logged in');
      }
      const currentUser = JSON.parse(storedUser);

      const messageData = {
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderEmail: currentUser.email,
        recipientId: user.id!,
        recipientName: user.name,
        recipientEmail: user.email,
        subject: `Message from ${currentUser.name}`,
        content: messageText.trim(),
      };

      await sendMessage(messageData);
      
      setMessageSent(true);
      setMessageDialogOpen(false);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      // You could add error handling here to show an error message
    } finally {
      setSendingMessage(false);
    }
  };

  const handleOpenMessageDialog = () => {
    setMessageDialogOpen(true);
  };

  const handleCloseMessageDialog = () => {
    setMessageDialogOpen(false);
    setMessageText('');
  };

  const handleOpenChat = () => {
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
  };

  // Get current user from localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  if (loading || !currentUser) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'User not found'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  const accountStatus = getAccountStatus(user);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
      </Box>

      {/* Profile Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={3}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <PersonIcon sx={{ fontSize: '3rem' }} />
                  )}
                </Avatar>
              </Box>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Typography variant="h4" component="h2" gutterBottom>
                {user.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  icon={accountStatus.icon}
                  label={accountStatus.status}
                  color={accountStatus.color}
                  variant="filled"
                  sx={{ mr: 2 }}
                />
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                UWE Lost & Found Portal Member
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<MessageIcon />}
                  onClick={handleOpenChat}
                  sx={{ flex: 1 }}
                >
                  Start Chat
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  onClick={handleOpenMessageDialog}
                  sx={{ flex: 1 }}
                >
                  Send Email
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h3" gutterBottom>
            Account Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email Address
                  </Typography>
                  <Typography variant="body1">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">
                    {user.phoneNumber}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    UWE Student ID
                  </Typography>
                  <Typography variant="body1">
                    {user.uweId}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1">
                    Active Member
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardContent>
          <Typography variant="h5" component="h3" gutterBottom>
            Account Status
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Account Verified
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email and UWE ID verified
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Portal Access
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Can report and search items
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Contact Enabled
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Can be contacted for matches
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Message Dialog */}
      <Dialog
        open={messageDialogOpen}
        onClose={handleCloseMessageDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Send Message to {user?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your Message"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message here..."
            sx={{ mt: 2 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This message will be sent to {user?.email} and they will be notified via email.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMessageDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            startIcon={sendingMessage ? <CircularProgress size={20} /> : <SendIcon />}
            disabled={!messageText.trim() || sendingMessage}
          >
            {sendingMessage ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Notification */}
      <Snackbar
        open={messageSent}
        autoHideDuration={6000}
        onClose={() => setMessageSent(false)}
        message="Message sent successfully!"
      />

      {/* Chat Box */}
      {user && (
        <ChatBox
          recipient={user}
          currentUser={currentUser}
          open={chatOpen}
          onClose={handleCloseChat}
        />
      )}
    </Container>
  );
};

export default UserProfile;
