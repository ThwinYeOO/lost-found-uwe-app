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

  const handleViewProfile = (user: User, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/profile/${user.id}`);
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
      <Box sx={{ backgroundColor: '#f5f5f5', py: 3 }}>
        <Container maxWidth="lg">
          {/* User Search Bar */}
          <Box ref={searchRef} sx={{ mb: 3, position: 'relative' }}>
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
                          onClick={(e) => handleViewProfile(user, e)}
                        >
                          View Profile
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
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/lost')}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
            >
              Lost Something?
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/found')}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
            >
              Found Something?
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          mb: 6,
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
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.85) 0%, rgba(13, 71, 161, 0.9) 50%, rgba(1, 87, 155, 0.85) 100%)',
            zIndex: 2,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* 2-Column Hero Layout */}
          <Grid container spacing={6} alignItems="center" sx={{ minHeight: '70vh' }}>
            {/* Left Column - Main Content */}
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                {/* Title */}
                <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 4 }}>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 2, 
                      color: 'white',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    UWE Lost & Found Portal
                  </Typography>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                      opacity: 0.95, 
                      fontWeight: 300, 
                      color: 'white',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                      fontSize: { xs: '1.2rem', md: '1.5rem' },
                      lineHeight: 1.4,
                    }}
                  >
                    Find your lost items or help others find theirs
                  </Typography>
                </Box>

                {/* Statistics Grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 2,
                    mb: 4,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                      p: 3,
                      textAlign: 'center',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        transform: 'translateY(-5px) scale(1.02)',
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 'bold', 
                        mb: 1,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        fontSize: { xs: '2rem', md: '2.5rem' },
                      }}
                    >
                      50+
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white', 
                        opacity: 0.95,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        fontWeight: 500,
                      }}
                    >
                      Items Found
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                      p: 3,
                      textAlign: 'center',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        transform: 'translateY(-5px) scale(1.02)',
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 'bold', 
                        mb: 1,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        fontSize: { xs: '2rem', md: '2.5rem' },
                      }}
                    >
                      200+
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white', 
                        opacity: 0.95,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        fontWeight: 500,
                      }}
                    >
                      Students
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                      p: 3,
                      textAlign: 'center',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        transform: 'translateY(-5px) scale(1.02)',
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 'bold', 
                        mb: 1,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        fontSize: { xs: '2rem', md: '2.5rem' },
                      }}
                    >
                      95%
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white', 
                        opacity: 0.95,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        fontWeight: 500,
                      }}
                    >
                      Success Rate
                    </Typography>
                  </Box>
                </Box>

                {/* Call to Action */}
                <Box
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 4,
                    p: 4,
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    mb: 3,
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: 'white', 
                      mb: 2, 
                      fontWeight: 'bold',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      textAlign: 'center',
                    }}
                  >
                    Join Our Community Today
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white', 
                      opacity: 0.95, 
                      mb: 3,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      textAlign: 'center',
                      fontWeight: 300,
                    }}
                  >
                    Help fellow students and find your lost items with ease
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
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
                        borderRadius: 3,
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
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
                        borderRadius: 3,
                        borderWidth: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          borderColor: 'white',
                          transform: 'translateY(-3px)',
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
            </Grid>

            {/* Right Column - Features */}
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                {/* Feature Icons Grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 3,
                    mb: 4,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: 'white',
                      transition: 'all 0.3s ease',
                      p: 2,
                      borderRadius: 3,
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        borderRadius: '50%',
                        p: 3,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.35)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <SearchIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        textAlign: 'center', 
                        fontWeight: 'bold', 
                        mb: 1,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      Quick Search
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        textAlign: 'center', 
                        opacity: 0.9,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        fontWeight: 500,
                      }}
                    >
                      Find items instantly
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: 'white',
                      transition: 'all 0.3s ease',
                      p: 2,
                      borderRadius: 3,
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        borderRadius: '50%',
                        p: 3,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.35)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <NotificationsIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        textAlign: 'center', 
                        fontWeight: 'bold', 
                        mb: 1,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      Instant Alerts
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        textAlign: 'center', 
                        opacity: 0.9,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        fontWeight: 500,
                      }}
                    >
                      Get notified immediately
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: 'white',
                      transition: 'all 0.3s ease',
                      p: 2,
                      borderRadius: 3,
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        borderRadius: '50%',
                        p: 3,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.35)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <AddCircleIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        textAlign: 'center', 
                        fontWeight: 'bold', 
                        mb: 1,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      Easy Report
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        textAlign: 'center', 
                        opacity: 0.9,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        fontWeight: 500,
                      }}
                    >
                      Report in seconds
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: 'white',
                      transition: 'all 0.3s ease',
                      p: 2,
                      borderRadius: 3,
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        borderRadius: '50%',
                        p: 3,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.35)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <SecurityIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        textAlign: 'center', 
                        fontWeight: 'bold', 
                        mb: 1,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      Secure Platform
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        textAlign: 'center', 
                        opacity: 0.9,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        fontWeight: 500,
                      }}
                    >
                      Safe and reliable
                    </Typography>
                  </Box>
                </Box>

                {/* Additional Info Card */}
                <Box
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: 4,
                    p: 4,
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.18)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'white', 
                      mb: 3, 
                      fontWeight: 'bold', 
                      textAlign: 'center',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    Why Choose UWE Lost & Found?
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '50%', 
                          mr: 2,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        }} 
                      />
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          opacity: 0.95,
                          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                          fontWeight: 500,
                        }}
                      >
                        University-verified platform
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '50%', 
                          mr: 2,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        }} 
                      />
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          opacity: 0.95,
                          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                          fontWeight: 500,
                        }}
                      >
                        Real-time notifications
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '50%', 
                          mr: 2,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        }} 
                      />
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          opacity: 0.95,
                          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                          fontWeight: 500,
                        }}
                      >
                        Easy photo uploads
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '50%', 
                          mr: 2,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        }} 
                      />
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          opacity: 0.95,
                          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                          fontWeight: 500,
                        }}
                      >
                        Community-driven support
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
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