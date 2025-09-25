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
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { getUserById, sendMessage, getItems } from '../services/firestore';
import { User, Item } from '../types';
import ChatBox from '../components/ChatBox';

const UserProfile: React.FC = () => {
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = paramUserId || searchParams.get('userId');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      console.log('UserProfile useEffect - userId:', userId);
      if (!userId) {
        console.log('No userId, setting error');
        setError('User ID is required');
        setLoading(false);
        return;
      }

      try {
        console.log('Starting to fetch user data...');
        setLoading(true);
        const userData = await getUserById(userId);
        console.log('User data received:', userData);
        setUser(userData);
        
        // Check if chat should be opened from URL parameter
        if (searchParams.get('chat') === 'true') {
          console.log('Opening chat from URL parameter');
          setChatOpen(true);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user profile');
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, searchParams]);

  // Fetch user's items when user is loaded
  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user?.id) return;

      try {
        setItemsLoading(true);
        // Fetch both lost and found items for this user
        const [lostItems, foundItems] = await Promise.all([
          getItems('Lost'),
          getItems('Found')
        ]);

        // Filter items by the current user's ID
        const userLostItems = lostItems.filter(item => item.reportUserId === user.id);
        const userFoundItems = foundItems.filter(item => item.reportUserId === user.id);
        
        setUserItems([...userLostItems, ...userFoundItems]);
      } catch (err) {
        console.error('Error fetching user items:', err);
      } finally {
        setItemsLoading(false);
      }
    };

    fetchUserItems();
  }, [user?.id]);

  // Check authentication status
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

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
    if (!messageText.trim() || !user || !currentUser) return;

    setSendingMessage(true);
    try {

      const messageData = {
        senderId: currentUser.id!,
        senderName: currentUser.name,
        senderEmail: currentUser.email,
        recipientId: user.id!,
        recipientName: user.name,
        recipientEmail: user.email,
        subject: `Message from ${currentUser.name}`,
        content: messageText.trim(),
        status: 'sending' as const,
        messageType: 'email' as const, // Distinguish email messages from chat messages
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
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setMessageDialogOpen(true);
  };

  const handleCloseMessageDialog = () => {
    setMessageDialogOpen(false);
    setMessageText('');
  };

  const handleOpenChat = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
  };

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

  if (loading) {
    console.log('UserProfile rendering loading state');
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
                      onError={(e) => {
                        console.log('Avatar image failed to load, showing fallback');
                        e.currentTarget.style.display = 'none';
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

      {/* Login Prompt for Unauthenticated Users */}
      {!isAuthenticated && (
        <Alert 
          severity="info" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => navigate('/login')}
                sx={{ fontWeight: 600 }}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => navigate('/register')}
                sx={{ fontWeight: 600 }}
              >
                Register
              </Button>
            </Box>
          }
        >
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>💬 Login Required to Message {user?.name}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              To send messages or start a chat with {user?.name}, you need to create an account. This ensures:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, fontSize: '0.875rem' }}>
              <li>Secure and private communication between users</li>
              <li>Message history is saved for your reference</li>
              <li>Notifications when you receive new messages</li>
              <li>Protection against spam and unwanted messages</li>
              <li>Ability to report inappropriate behavior</li>
            </Box>
            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
              Creating an account is free and takes less than 2 minutes!
            </Typography>
          </Box>
        </Alert>
      )}

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

      {/* User's Posted Items */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h3" gutterBottom>
            {user?.name}'s Posted Items
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {itemsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : userItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Items Posted Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.name} hasn't posted any lost or found items yet.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {userItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                      },
                    }}
                  >
                    {item.imageUrl && (
                      <Box
                        component="img"
                        src={item.imageUrl}
                        alt={item.name}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          console.log('Item image failed to load, hiding image');
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="h4" sx={{ fontWeight: 600, flex: 1 }}>
                          {item.name}
                        </Typography>
                        <Chip
                          label={item.type}
                          color={item.type === 'Lost' ? 'error' : 'success'}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                        {item.description}
                      </Typography>
                      
                      <Box sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {item.locationLostFound}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TimeIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {item.dateLostFound ? new Date(item.dateLostFound).toLocaleDateString() : 'Date not specified'}
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ViewIcon />}
                          fullWidth
                          onClick={() => navigate(`/${item.type.toLowerCase()}-items`)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
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
      {user && currentUser && (
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
