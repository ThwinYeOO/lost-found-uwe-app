import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Chip,
  Fade,
  Zoom,
  LinearProgress,
  Badge,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  CloudUpload as CloudUploadIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { User, Item } from '../types';
import { useNavigate } from 'react-router-dom';
import { getUserItems, updateUser, uploadProfilePhoto } from '../services/firestore';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lostItems, setLostItems] = useState<Item[]>([]);
  const [foundItems, setFoundItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);

  // Edit profile state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    uweId: '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // Photo upload state
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        setCurrentUser(user);
        
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Debug: Log when currentUser changes
  useEffect(() => {
    console.log('Current user changed:', currentUser);
  }, [currentUser]);

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!currentUser) return;

      setLoadingItems(true);
      setItemsError(null);
      try {
        if (tabValue === 0) {
          const items = await getUserItems(currentUser.id!, 'Lost');
          setLostItems(items);
        } else {
          const items = await getUserItems(currentUser.id!, 'Found');
          setFoundItems(items);
        }
      } catch (err: any) {
        console.error('Error fetching user items:', err);
        setItemsError('Failed to fetch your reported items.');
      } finally {
        setLoadingItems(false);
      }
    };

    fetchUserItems();
  }, [tabValue, currentUser]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Edit profile functions
  const handleEditProfile = () => {
    if (currentUser) {
      setEditFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
        uweId: currentUser.uweId || '',
      });
      setEditError(null);
      setEditDialogOpen(true);
    }
  };

  const handleEditFormChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSaveProfile = async () => {
    if (!currentUser?.id) return;

    setEditLoading(true);
    setEditError(null);

    try {
      // Validate required fields
      if (!editFormData.name.trim() || !editFormData.email.trim() || !editFormData.phoneNumber.trim() || !editFormData.uweId.trim()) {
        throw new Error('All fields are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editFormData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Update user
      const updatedUser = await updateUser(currentUser.id, editFormData);
      
      // Update local state
      const newUser = { ...currentUser, ...editFormData };
      setCurrentUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setEditSuccess(true);
      setEditDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setEditError(error.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditError(null);
  };

  const handleCloseSuccessSnackbar = () => {
    setEditSuccess(false);
  };

  // Photo upload functions
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser?.id) return;

    // Reset the input value to allow selecting the same file again
    event.target.value = '';

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setUploadingPhoto(true);
    setUploadError(null);
    setImageError(false);

    try {
      const avatarUrl = await uploadProfilePhoto(currentUser.id, file);
      
      console.log('Upload successful, avatar URL:', avatarUrl);
      console.log('Current user before update:', currentUser);
      
      // Update local state
      const updatedUser = { ...currentUser, avatar: avatarUrl };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      console.log('Updated user:', updatedUser);
      
      // Small delay to ensure state update is processed
      setTimeout(() => {
        setUploadSuccess(true);
      }, 100);
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      setUploadError(error.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCloseUploadSuccessSnackbar = () => {
    setUploadSuccess(false);
  };


  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={800}>
            <Grid container spacing={4}>
            {/* Profile Information */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={8} 
                sx={{ 
                  p: 4, 
                  borderRadius: 4,
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ position: 'relative', mb: 3 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Tooltip title="Active User">
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                              border: '3px solid white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 12, color: 'white' }} />
                          </Box>
                        </Tooltip>
                      }
                    >
                      {currentUser?.avatar && !imageError ? (
                        <Box sx={{ position: 'relative' }}>
                          {imageLoading && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: 160,
                                height: 160,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                zIndex: 1
                              }}
                            >
                              <CircularProgress size={40} sx={{ color: 'white' }} />
                            </Box>
                          )}
                          <img
                            key={currentUser.avatar}
                            src={currentUser.avatar}
                            alt="Profile"
                            style={{
                              width: 160,
                              height: 160,
                              borderRadius: '50%',
                              border: '6px solid #fff',
                              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                              objectFit: 'cover'
                            }}
                            onLoadStart={() => {
                              console.log('Image loading started:', currentUser.avatar);
                              setImageLoading(true);
                              setImageError(false);
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', currentUser.avatar);
                              setImageLoading(false);
                              setImageError(false);
                            }}
                            onError={(e) => {
                              console.error('Image failed to load:', currentUser.avatar);
                              setImageLoading(false);
                              setImageError(true);
                            }}
                          />
                        </Box>
                      ) : (
                        <Avatar
                          sx={{ 
                            width: 160, 
                            height: 160, 
                            border: '6px solid #fff',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontSize: '4rem'
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 80 }} />
                        </Avatar>
                      )}
                    </Badge>
                  </Box>
                  
                  <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'text.primary', 
                      mb: 1,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {currentUser?.name || 'N/A'}
                  </Typography>
                  
                  <Chip
                    icon={<SchoolIcon />}
                    label="UWE Student"
                    color="primary"
                    variant="filled"
                    sx={{ 
                      mb: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
                    {currentUser?.email || 'N/A'}
                  </Typography>
                  
                  {/* Photo Upload Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 3, flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="profile-photo-upload"
                      type="file"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                    />
                    <input
                      accept="image/*"
                      capture="environment"
                      style={{ display: 'none' }}
                      id="profile-photo-camera"
                      type="file"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                      <label htmlFor="profile-photo-upload" style={{ flex: 1 }}>
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={uploadingPhoto ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                          disabled={uploadingPhoto}
                          fullWidth
                          sx={{ 
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5,
                            borderWidth: 2,
                            '&:hover': {
                              borderWidth: 2,
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                            },
                            transition: 'all 0.3s ease-in-out'
                          }}
                        >
                          {uploadingPhoto ? 'Uploading...' : 'Choose File'}
                        </Button>
                      </label>
                      
                      <label htmlFor="profile-photo-camera" style={{ flex: 1 }}>
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={uploadingPhoto ? <CircularProgress size={16} /> : <PhotoCameraIcon />}
                          disabled={uploadingPhoto}
                          fullWidth
                          sx={{ 
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                            },
                            transition: 'all 0.3s ease-in-out'
                          }}
                        >
                          {uploadingPhoto ? 'Uploading...' : 'Take Photo'}
                        </Button>
                      </label>
                    </Box>
                  </Box>

                  {uploadError && (
                    <Alert severity="error" sx={{ mb: 2, width: '100%', borderRadius: 2 }}>
                      {uploadError}
                    </Alert>
                  )}

                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    fullWidth
                    sx={{ 
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      },
                      transition: 'all 0.3s ease-in-out'
                    }}
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                  
                </Box>
                
                <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
                
                <List sx={{ px: 0 }}>
                  <ListItem sx={{ py: 2, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 45 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <EmailIcon sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email Address" 
                      secondary={currentUser?.email || 'N/A'}
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem', color: 'text.primary' }}
                      secondaryTypographyProps={{ fontSize: '0.85rem', color: 'text.secondary' }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 2, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 45 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PhoneIcon sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone Number" 
                      secondary={currentUser?.phoneNumber || 'N/A'}
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem', color: 'text.primary' }}
                      secondaryTypographyProps={{ fontSize: '0.85rem', color: 'text.secondary' }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 2, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 45 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <SchoolIcon sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary="Student ID"
                      secondary={currentUser?.uweId || 'N/A'}
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem', color: 'text.primary' }}
                      secondaryTypographyProps={{ fontSize: '0.85rem', color: 'text.secondary' }}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Zoom in timeout={1000}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <SearchIcon sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    {lostItems.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lost Items
                  </Typography>
                </Card>
              </Zoom>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Zoom in timeout={1200}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <HistoryIcon sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    {foundItems.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Found Items
                  </Typography>
                </Card>
              </Zoom>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Zoom in timeout={1400}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <CheckCircleIcon sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    {lostItems.filter(item => item.status === 'Available').length + foundItems.filter(item => item.status === 'Available').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Items
                  </Typography>
                </Card>
              </Zoom>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Zoom in timeout={1600}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ffd93d 0%, #ff6b6b 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <TrendingUpIcon sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    {lostItems.length + foundItems.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Reports
                  </Typography>
                </Card>
              </Zoom>
            </Grid>
          </Grid>

          {/* Reported Items */}
          <Paper 
            elevation={8}
            sx={{ 
              borderRadius: 4,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              overflow: 'hidden',
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                '& .MuiTab-root': {
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&.Mui-selected': {
                    color: 'white',
                    background: 'rgba(255,255,255,0.1)',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white',
                  height: 3,
                },
              }}
            >
              <Tab icon={<SearchIcon />} label="Lost Items" />
              <Tab icon={<HistoryIcon />} label="Found Items" />
            </Tabs>

            {/* Lost Items Tab */}
            <TabPanel value={tabValue} index={0}>
              {loadingItems && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={60} sx={{ color: 'primary.main' }} />
                </Box>
              )}
              {itemsError && (
                <Alert severity="error" sx={{ m: 3, borderRadius: 2 }}>
                  {itemsError}
                </Alert>
              )}
              {!loadingItems && !itemsError && lostItems.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <SearchIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No lost items reported yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start by reporting a lost item to help others find it
                  </Typography>
                </Box>
              )}
              {!loadingItems && !itemsError && lostItems.map((item, index) => (
                <Fade in timeout={800 + index * 200} key={item.id}>
                  <Card 
                    sx={{ 
                      mb: 3, 
                      mx: 3,
                      mt: index === 0 ? 3 : 0,
                      borderRadius: 3,
                      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      },
                      transition: 'all 0.3s ease-in-out',
                      overflow: 'hidden',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', flex: 1 }}>
                          {item.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            icon={item.status === 'Available' ? <CheckCircleIcon /> : <TimeIcon />}
                            label={item.status}
                            color={item.status === 'Available' ? 'success' : 'warning'}
                            variant="filled"
                            sx={{ fontWeight: 600 }}
                          />
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TimeIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                              Date Lost: {item.dateLostFound ? new Date(item.dateLostFound).toLocaleDateString() : 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                              {item.locationLostFound}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      {item.phoneNumber && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PhoneIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            Contact: {item.phoneNumber}
                          </Typography>
                        </Box>
                      )}
                      
                      {item.imageUrl && (
                        <Box sx={{ mt: 2 }}>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{ 
                              width: '100%', 
                              height: '200px', 
                              objectFit: 'cover',
                              borderRadius: '12px',
                              border: '1px solid rgba(0,0,0,0.1)',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            }}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Fade>
              ))}
            </TabPanel>

            {/* Found Items Tab */}
            <TabPanel value={tabValue} index={1}>
              {loadingItems && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={60} sx={{ color: 'primary.main' }} />
                </Box>
              )}
              {itemsError && (
                <Alert severity="error" sx={{ m: 3, borderRadius: 2 }}>
                  {itemsError}
                </Alert>
              )}
              {!loadingItems && !itemsError && foundItems.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <HistoryIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No found items reported yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Help others by reporting items you've found
                  </Typography>
                </Box>
              )}
              {!loadingItems && !itemsError && foundItems.map((item, index) => (
                <Fade in timeout={800 + index * 200} key={item.id}>
                  <Card 
                    sx={{ 
                      mb: 3, 
                      mx: 3,
                      mt: index === 0 ? 3 : 0,
                      borderRadius: 3,
                      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      },
                      transition: 'all 0.3s ease-in-out',
                      overflow: 'hidden',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', flex: 1 }}>
                          {item.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            icon={item.status === 'Available' ? <CheckCircleIcon /> : <TimeIcon />}
                            label={item.status}
                            color={item.status === 'Available' ? 'success' : 'warning'}
                            variant="filled"
                            sx={{ fontWeight: 600 }}
                          />
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TimeIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                              Date Found: {item.dateLostFound ? new Date(item.dateLostFound).toLocaleDateString() : 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                              {item.locationLostFound}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      {item.phoneNumber && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PhoneIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            Contact: {item.phoneNumber}
                          </Typography>
                        </Box>
                      )}
                      
                      {item.reportName && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PersonIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            Reporter: {item.reportName}
                          </Typography>
                        </Box>
                      )}
                      
                      {item.imageUrl && (
                        <Box sx={{ mt: 2 }}>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{ 
                              width: '100%', 
                              height: '200px', 
                              objectFit: 'cover',
                              borderRadius: '12px',
                              border: '1px solid rgba(0,0,0,0.1)',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            }}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Fade>
              ))}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
      </Fade>
      </Container>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Full Name"
              fullWidth
              variant="outlined"
              value={editFormData.name}
              onChange={handleEditFormChange('name')}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={editFormData.email}
              onChange={handleEditFormChange('email')}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Phone Number"
              fullWidth
              variant="outlined"
              value={editFormData.phoneNumber}
              onChange={handleEditFormChange('phoneNumber')}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Student ID"
              fullWidth
              variant="outlined"
              value={editFormData.uweId}
              onChange={handleEditFormChange('uweId')}
              sx={{ mb: 2 }}
            />
            {editError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {editError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseEditDialog}
            startIcon={<CancelIcon />}
            disabled={editLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            variant="contained"
            startIcon={editLoading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={editLoading}
          >
            {editLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={editSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccessSnackbar} severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>

      {/* Photo Upload Success Snackbar */}
      <Snackbar
        open={uploadSuccess}
        autoHideDuration={6000}
        onClose={handleCloseUploadSuccessSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseUploadSuccessSnackbar} severity="success" sx={{ width: '100%' }}>
          Profile photo uploaded successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile; 