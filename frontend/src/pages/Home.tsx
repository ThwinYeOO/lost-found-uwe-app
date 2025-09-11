import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { searchUsers } from '../services/firestore';
import { User } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedMap, setSelectedMap] = useState<{ src: string; title: string; description: string } | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchUsers(query);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleUserClick = (user: User) => {
    // Navigate to user profile or show user details
    navigate(`/profile/${user.id}`);
  };

  const handleMessageClick = (user: User, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the user click
    navigate(`/profile/${user.id}`);
  };

  const handleChatClick = (user: User, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the user click
    navigate(`/profile/${user.id}?chat=true`);
  };

  const handleMapClick = (mapData: { src: string; title: string; description: string }) => {
    setSelectedMap(mapData);
    setMapModalOpen(true);
  };

  const handleCloseMapModal = () => {
    setMapModalOpen(false);
    setSelectedMap(null);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Main Hero Content */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
              <img
                src="/uwe-logo.png"
                alt="UWE Bristol Logo"
                style={{
                  height: '100px',
                  width: 'auto',
                  marginRight: '30px',
                  objectFit: 'contain'
                }}
              />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  UWE Lost & Found Portal
                </Typography>
                <Typography variant="h5" component="h2" sx={{ opacity: 0.9, fontWeight: 300 }}>
                  Find your lost items or help others find theirs
                </Typography>
              </Box>
            </Box>

            {/* Statistics Row */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 4,
                mb: 4,
                flexWrap: 'wrap',
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  minWidth: '150px',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                  50+
                </Typography>
                <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
                  Items Found
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  minWidth: '150px',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                  200+
                </Typography>
                <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
                  Students
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  minWidth: '150px',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                  95%
                </Typography>
                <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
                  Success Rate
                </Typography>
              </Box>
            </Box>

            {/* Feature Icons Row */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 6,
                mb: 4,
                flexWrap: 'wrap',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'white',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    p: 3,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SearchIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                  Quick Search
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.8, mt: 1 }}>
                  Find items instantly
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'white',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    p: 3,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                  Instant Alerts
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.8, mt: 1 }}>
                  Get notified immediately
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'white',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    p: 3,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AddCircleIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                  Easy Report
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.8, mt: 1 }}>
                  Report in seconds
                </Typography>
              </Box>
            </Box>

            {/* Call to Action */}
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                p: 4,
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                Join Our Community Today
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', opacity: 0.9, mb: 3 }}>
                Help fellow students and find your lost items with ease
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 'bold',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                  onClick={() => navigate('/lost')}
                >
                  Browse Items
                </Button>
              </Box>
            </Box>
          </Box>
          
          {/* User Search Bar */}
          <Box ref={searchRef} sx={{ mt: 4, mb: 4, position: 'relative' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for users by name, email, or UWE ID..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                maxWidth: 600,
                mx: 'auto',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black',
                  '&::placeholder': {
                    color: 'rgba(0, 0, 0, 0.6)',
                    opacity: 1,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {isSearching ? (
                      <CircularProgress size={20} />
                    ) : (
                      <SearchIcon sx={{ color: 'primary.main' }} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            
            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100%',
                  maxWidth: 600,
                  maxHeight: 300,
                  overflow: 'auto',
                  zIndex: 1000,
                  mt: 1,
                  boxShadow: 3,
                }}
              >
                <List>
                  {searchResults.map((user) => (
                    <ListItem
                      key={user.id}
                      button
                      onClick={() => handleUserClick(user)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <PersonIcon />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={`${user.email} • UWE ID: ${user.uweId}`}
                      />
                      <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ChatIcon />}
                          onClick={(e) => handleChatClick(user, e)}
                        >
                          Chat
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<MessageIcon />}
                          onClick={(e) => handleMessageClick(user, e)}
                        >
                          Email
                        </Button>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
            
            {showResults && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100%',
                  maxWidth: 600,
                  zIndex: 1000,
                  mt: 1,
                  boxShadow: 3,
                  p: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary" align="center">
                  No users found matching "{searchQuery}"
                </Typography>
              </Paper>
            )}
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/lost')}
              sx={{ mr: 2 }}
            >
              Lost Something?
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate('/found')}
            >
              Found Something?
            </Button>
          </Box>
        </Container>
      </Box>

      {/* UWE Images Gallery Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Welcome to UWE Bristol
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.3s ease-in-out',
                },
              }}
            >
              <img
                src="/uwe-scholarship.jpg"
                alt="UWE Bristol Chancellors Scholarship"
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  color: 'white',
                  p: 2,
                }}
              >
                <Typography variant="h6" component="h3">
                  UWE Bristol Chancellors Scholarship
                </Typography>
                <Typography variant="body2">
                  Supporting excellence in education and student success
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.3s ease-in-out',
                },
              }}
            >
              <img
                src="/uwe-campus.jpg"
                alt="UWE Bristol Campus"
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  color: 'white',
                  p: 2,
                }}
              >
                <Typography variant="h6" component="h3">
                  UWE Bristol Campus
                </Typography>
                <Typography variant="body2">
                  A vibrant learning community where students thrive
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* UWE Campus Maps Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Campus Maps & Navigation
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.3s ease-in-out',
                },
              }}
              onClick={() => handleMapClick({
                src: '/uwe-map-1.jpg',
                title: 'UWE Bristol Campus Overview',
                description: 'Navigate around our beautiful campus facilities'
              })}
            >
              <img
                src="/uwe-map-1.jpg"
                alt="UWE Bristol Campus Map"
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderRadius: '50%',
                  p: 1,
                }}
              >
                <ZoomInIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  color: 'white',
                  p: 2,
                }}
              >
                <Typography variant="h6" component="h3">
                  UWE Bristol Campus Overview
                </Typography>
                <Typography variant="body2">
                  Navigate around our beautiful campus facilities
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.3s ease-in-out',
                },
              }}
              onClick={() => handleMapClick({
                src: '/uwe-campus-map.jpg',
                title: 'Glenside Campus Map',
                description: 'Detailed map of the Glenside campus facilities'
              })}
            >
              <img
                src="/uwe-campus-map.jpg"
                alt="UWE Glenside Campus Map"
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderRadius: '50%',
                  p: 1,
                }}
              >
                <ZoomInIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  color: 'white',
                  p: 2,
                }}
              >
                <Typography variant="h6" component="h3">
                  Glenside Campus Map
                </Typography>
                <Typography variant="body2">
                  Detailed map of the Glenside campus facilities
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          How It Works
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom align="center">
                  Search
                </Typography>
                <Typography align="center">
                  Browse through lost and found items to find what you're looking for
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <AddCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom align="center">
                  Report
                </Typography>
                <Typography align="center">
                  Report lost items or submit found items to help others
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <NotificationsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom align="center">
                  Get Notified
                </Typography>
                <Typography align="center">
                  Receive notifications when your lost item is found
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Map Modal Dialog */}
      <Dialog
        open={mapModalOpen}
        onClose={handleCloseMapModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            margin: 1,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" component="div">
              {selectedMap?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedMap?.description}
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseMapModal}
            sx={{ color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedMap && (
            <img
              src={selectedMap.src}
              alt={selectedMap.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Home; 