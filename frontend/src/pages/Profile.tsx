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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                {currentUser?.avatar && !imageError ? (
                  <Box sx={{ position: 'relative' }}>
                    {imageLoading && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: 150,
                          height: 150,
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
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        border: '4px solid #fff',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
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
                      width: 150, 
                      height: 150, 
                      border: '4px solid #fff',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      bgcolor: 'primary.main'
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 80 }} />
                  </Avatar>
                )}
              </Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                {currentUser?.name || 'N/A'}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                {currentUser?.email || 'N/A'}
              </Typography>
              
              {/* Photo Upload Buttons */}
              <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 2, flexDirection: 'column', alignItems: 'center' }}>
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
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <label htmlFor="profile-photo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={uploadingPhoto ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                      disabled={uploadingPhoto}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        minWidth: 120
                      }}
                    >
                      {uploadingPhoto ? 'Uploading...' : 'Choose File'}
                    </Button>
                  </label>
                  
                  <label htmlFor="profile-photo-camera">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={uploadingPhoto ? <CircularProgress size={16} /> : <PhotoCameraIcon />}
                      disabled={uploadingPhoto}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        minWidth: 120
                      }}
                    >
                      {uploadingPhoto ? 'Uploading...' : 'Take Photo'}
                    </Button>
                  </label>
                </Box>
              </Box>

              {uploadError && (
                <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                  {uploadError}
                </Alert>
              )}

              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ 
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
              
            </Box>
            <Divider sx={{ my: 2 }} />
            <List sx={{ px: 1 }}>
              <ListItem sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email" 
                  secondary={currentUser?.email || 'N/A'}
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                  secondaryTypographyProps={{ fontSize: '0.85rem' }}
                />
              </ListItem>
              <ListItem sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Phone Number" 
                  secondary={currentUser?.phoneNumber || 'N/A'}
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                  secondaryTypographyProps={{ fontSize: '0.85rem' }}
                />
              </ListItem>
              <ListItem sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Student ID"
                  secondary={currentUser?.uweId || 'N/A'}
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                  secondaryTypographyProps={{ fontSize: '0.85rem' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Reported Items */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<SearchIcon />} label="Lost Items" />
              <Tab icon={<HistoryIcon />} label="Found Items" />
            </Tabs>

            {/* Lost Items Tab */}
            <TabPanel value={tabValue} index={0}>
              {loadingItems && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
              {itemsError && <Alert severity="error">{itemsError}</Alert>}
              {!loadingItems && !itemsError && lostItems.length === 0 && (
                <Typography align="center">No lost items reported yet.</Typography>
              )}
              {!loadingItems && !itemsError && lostItems.map((item) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Date Lost: {item.dateLostFound ? new Date(item.dateLostFound).toLocaleDateString() : 'N/A'}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Location: {item.locationLostFound}
                    </Typography>
                    <Typography
                      color={item.status === 'Available' ? 'success.main' : 'error.main'}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Status: {item.status}
                    </Typography>
                    {item.phoneNumber && (
                      <Typography color="textSecondary" gutterBottom>
                        Contact: {item.phoneNumber}
                      </Typography>
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
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0'
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabPanel>

            {/* Found Items Tab */}
            <TabPanel value={tabValue} index={1}>
              {loadingItems && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
              {itemsError && <Alert severity="error">{itemsError}</Alert>}
              {!loadingItems && !itemsError && foundItems.length === 0 && (
                <Typography align="center">No found items reported yet.</Typography>
              )}
              {!loadingItems && !itemsError && foundItems.map((item) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Date Found: {item.dateLostFound ? new Date(item.dateLostFound).toLocaleDateString() : 'N/A'}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Location: {item.locationLostFound}
                    </Typography>
                    <Typography
                      color={item.status === 'Available' ? 'success.main' : 'error.main'}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Status: {item.status}
                    </Typography>
                    {item.phoneNumber && (
                      <Typography color="textSecondary" gutterBottom>
                        Contact: {item.phoneNumber}
                      </Typography>
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
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0'
                          }}
                        />
                      </Box>
                    )}
                    {item.reportName && (
                      <Typography color="textSecondary" gutterBottom>
                        Reporter's Name: {item.reportName}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

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

    </Container>
  );
};

export default Profile; 