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
import SecurityIcon from '@mui/icons-material/Security';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import SupportIcon from '@mui/icons-material/Support';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
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
    navigate(`/user-profile?userId=${user.id}`);
  };

  const handleMessageClick = (user: User, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the user click
    navigate(`/user-profile?userId=${user.id}`);
  };

  const handleChatClick = (user: User, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the user click
    navigate(`/user-profile?userId=${user.id}&chat=true`);
  };

  const handleViewProfile = (user: User, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/user-profile?userId=${user.id}`);
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
      {/* Search Bar and Action Buttons - Under Navbar */}
      <Box sx={{ backgroundColor: '#fafafa', py: 6, borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          {/* Modern Search Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                fontWeight: 600, 
                color: '#333', 
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.2rem' },
              }}
            >
              Find Your Lost Items
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666', 
                mb: 4,
                fontSize: '1.1rem',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Search for users, lost items, or browse through our community to help others
            </Typography>
          </Box>

          {/* Enhanced Search Bar */}
          <Box ref={searchRef} sx={{ mb: 4, position: 'relative', maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for users by name, email, or UWE ID..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 3,
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)',
                    borderColor: '#1976d2',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 2,
                  fontSize: '1rem',
                  '&::placeholder': {
                    color: '#999',
                    opacity: 1,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ ml: 2 }}>
                    {isSearching ? (
                      <CircularProgress size={24} sx={{ color: '#1976d2' }} />
                    ) : (
                      <SearchIcon sx={{ color: '#1976d2', fontSize: 24 }} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            
            {/* Enhanced Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  mt: 1,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  border: '1px solid #e0e0e0',
                  overflow: 'hidden',
                  zIndex: 1000,
                  maxHeight: 400,
                  overflowY: 'auto',
                }}
              >
                <List sx={{ p: 0 }}>
                  {searchResults.map((user) => (
                    <ListItem
                      key={user.id}
                      button
                      onClick={() => handleUserClick(user)}
                      sx={{
                        py: 2,
                        px: 3,
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f8f9fa',
                        },
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: '#1976d2',
                            width: 48,
                            height: 48,
                          }}
                        >
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }} 
                            />
                          ) : (
                            <PersonIcon />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                            {user.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {user.email} • UWE ID: {user.uweId}
                          </Typography>
                        }
                      />
                      <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ChatIcon />}
                          onClick={(e) => handleChatClick(user, e)}
                          sx={{
                            backgroundColor: '#1976d2',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: '#1565c0',
                            },
                          }}
                        >
                          Chat
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => handleViewProfile(user, e)}
                          sx={{
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: '#f3f4f6',
                              borderColor: '#1565c0',
                            },
                          }}
                        >
                          Profile
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
                  left: 0,
                  right: 0,
                  mt: 1,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  border: '1px solid #e0e0e0',
                  zIndex: 1000,
                  p: 3,
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#666', 
                    textAlign: 'center',
                    fontWeight: 500,
                  }}
                >
                  No users found matching "{searchQuery}"
                </Typography>
              </Paper>
            )}
          </Box>
          
          {/* Modern Action Buttons - Mobile Optimized */}
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 2, sm: 3 }, 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center'
          }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/lost')}
              fullWidth={false}
              sx={{
                px: { xs: 4, sm: 6 },
                py: 2,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 600,
                borderRadius: 3,
                backgroundColor: '#f44336',
                boxShadow: '0 4px 20px rgba(244, 67, 54, 0.4)',
                textTransform: 'none',
                minWidth: { xs: '280px', sm: 'auto' },
                minHeight: '48px',
                '&:hover': {
                  backgroundColor: '#d32f2f',
                  transform: { xs: 'none', sm: 'translateY(-2px)' },
                  boxShadow: '0 8px 30px rgba(244, 67, 54, 0.6)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
            >
              Lost Something?
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/found')}
              fullWidth={false}
              sx={{
                px: { xs: 4, sm: 6 },
                py: 2,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 600,
                borderRadius: 3,
                backgroundColor: '#1976d2',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
                textTransform: 'none',
                minWidth: { xs: '280px', sm: 'auto' },
                minHeight: '48px',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  transform: { xs: 'none', sm: 'translateY(-2px)' },
                  boxShadow: '0 8px 30px rgba(25, 118, 210, 0.6)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
            >
              Found Something?
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: { xs: 6, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/graduate-students-scholarships.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.1,
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Modern Hero Layout */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            {/* Main Title */}
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                fontWeight: 800,
                color: 'white',
                mb: 3,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              UWE Lost & Found Portal
            </Typography>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 6,
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Connect with fellow students to find lost items and help others recover their belongings
            </Typography>

            {/* Statistics Cards - Mobile Optimized */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: { xs: 2, sm: 3 }, 
              mb: 8, 
              flexWrap: 'wrap',
              px: { xs: 2, sm: 0 }
            }}>
              {[
                { number: '50+', label: 'Items Found', color: '#4CAF50' },
                { number: '200+', label: 'Students', color: '#2196F3' },
                { number: '95%', label: 'Success Rate', color: '#FF9800' }
              ].map((stat, index) => (
                <Card
                  key={index}
                  sx={{
                    minWidth: { xs: 140, sm: 160 },
                    width: { xs: 'calc(33.333% - 16px)', sm: 'auto' },
                    p: { xs: 2, sm: 3 },
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: { xs: 'none', sm: 'translateY(-8px)' },
                      boxShadow: { xs: '0 8px 32px rgba(0, 0, 0, 0.12)', sm: '0 16px 48px rgba(0, 0, 0, 0.2)' },
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                  }}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: stat.color,
                      fontWeight: 700,
                      mb: 1,
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                      textAlign: 'center'
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666',
                      fontWeight: 500,
                      fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      textAlign: 'center'
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Card>
              ))}
            </Box>

            {/* CTA Buttons - Mobile Optimized */}
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 2, sm: 3 }, 
              justifyContent: 'center', 
              flexWrap: 'wrap', 
              mb: 8,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              px: { xs: 2, sm: 0 }
            }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: { xs: 4, sm: 6 },
                  py: 2,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 600,
                  borderRadius: 3,
                  backgroundColor: '#1976d2',
                  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
                  minWidth: { xs: '280px', sm: 'auto' },
                  minHeight: '48px',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    transform: { xs: 'none', sm: 'translateY(-2px)' },
                    boxShadow: '0 8px 30px rgba(25, 118, 210, 0.6)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
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
                  px: { xs: 4, sm: 6 },
                  py: 2,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 600,
                  borderRadius: 3,
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: 2,
                  minWidth: { xs: '280px', sm: 'auto' },
                  minHeight: '48px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                    transform: { xs: 'none', sm: 'translateY(-2px)' },
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                }}
                onClick={() => navigate('/lost')}
              >
                Browse Items
              </Button>
            </Box>

            {/* Features Grid */}
            <Grid container spacing={4} sx={{ maxWidth: 1200, mx: 'auto' }}>
              {[
                { 
                  icon: <SearchIcon sx={{ fontSize: 32 }} />, 
                  title: 'Quick Search', 
                  desc: 'Find items instantly',
                  path: '/search'
                },
                { 
                  icon: <NotificationsIcon sx={{ fontSize: 32 }} />, 
                  title: 'Instant Alerts', 
                  desc: 'Get notified immediately',
                  path: '/alerts'
                },
                { 
                  icon: <AddCircleIcon sx={{ fontSize: 32 }} />, 
                  title: 'Easy Report', 
                  desc: 'Report in seconds',
                  path: '/report'
                },
                { 
                  icon: <SecurityIcon sx={{ fontSize: 32 }} />, 
                  title: 'Secure Platform', 
                  desc: 'Safe and reliable',
                  path: '/secure'
                },
                { 
                  icon: <SupportIcon sx={{ fontSize: 32 }} />, 
                  title: 'Support 24x7', 
                  desc: 'Get help anytime',
                  path: '/support'
                },
                { 
                  icon: <VerifiedUserIcon sx={{ fontSize: 32 }} />, 
                  title: 'Verified Users', 
                  desc: 'Trusted community',
                  path: '/verified'
                }
              ].map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    onClick={() => navigate(feature.path)}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        color: 'white',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 600, 
                        mb: 1,
                        fontSize: '1.1rem',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {feature.desc}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
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