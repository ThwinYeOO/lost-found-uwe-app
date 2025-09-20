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
import SpeedIcon from '@mui/icons-material/Speed';
import GroupIcon from '@mui/icons-material/Group';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
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
      <Box sx={{ 
        backgroundColor: '#fafafa', 
        py: { xs: 3, sm: 4, md: 6 }, 
        borderBottom: '1px solid #e0e0e0',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Modern Search Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 2.5, sm: 3, md: 4 } }}>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                color: '#333', 
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.2rem' },
                lineHeight: 1.2,
                px: { xs: 1, sm: 2, md: 0 },
              }}
            >
              Find Your Lost Items
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666', 
                mb: { xs: 2.5, sm: 3, md: 4 },
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                maxWidth: '600px',
                mx: 'auto',
                px: { xs: 2, md: 0 },
                lineHeight: 1.5,
              }}
            >
              Search for users, lost items, or browse through our community to help others
            </Typography>
          </Box>

          {/* Enhanced Search Bar */}
          <Box ref={searchRef} sx={{ mb: { xs: 2.5, sm: 3, md: 4 }, position: 'relative', maxWidth: 600, mx: 'auto', px: { xs: 1, sm: 2, md: 0 } }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for users by name, email, or UWE ID..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: { xs: 2, sm: 3 },
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease',
                  minHeight: { xs: 56, sm: 60 },
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
                    transform: 'translateY(-1px)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)',
                    borderColor: '#1976d2',
                    transform: 'translateY(-1px)',
                  },
                },
                '& .MuiInputBase-input': {
                  py: { xs: 3, sm: 2.5, md: 2 },
                  px: { xs: 2, sm: 2.5, md: 3 },
                  fontSize: { xs: '16px', sm: '16px', md: '1rem' }, // 16px prevents zoom on iOS
                  '&::placeholder': {
                    color: '#999',
                    opacity: 1,
                    fontSize: { xs: '16px', sm: '16px', md: '1rem' },
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ ml: { xs: 1.5, sm: 2 } }}>
                    {isSearching ? (
                      <CircularProgress size={20} sx={{ color: '#1976d2' }} />
                    ) : (
                      <SearchIcon sx={{ color: '#1976d2', fontSize: { xs: 20, sm: 24 } }} />
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
          
          {/* Modern Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1.5, sm: 2, md: 3 }, 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' },
            px: { xs: 1, sm: 2, md: 0 },
            maxWidth: { xs: '100%', sm: '500px', md: '600px' },
            mx: 'auto',
          }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/lost')}
              sx={{
                px: { xs: 3, sm: 4, md: 6 },
                py: { xs: 2, sm: 2.5, md: 2 },
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                fontWeight: 700,
                borderRadius: { xs: 2, sm: 3 },
                backgroundColor: '#f44336',
                boxShadow: '0 4px 20px rgba(244, 67, 54, 0.4)',
                textTransform: 'none',
                minHeight: { xs: 52, sm: 56, md: 'auto' },
                width: { xs: '100%', sm: 'auto' },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover': {
                  backgroundColor: '#d32f2f',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(244, 67, 54, 0.6)',
                  '&::before': {
                    left: '100%',
                  },
                },
                '&:active': {
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Lost Something?
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/found')}
              sx={{
                px: { xs: 3, sm: 4, md: 6 },
                py: { xs: 2, sm: 2.5, md: 2 },
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                fontWeight: 700,
                borderRadius: { xs: 2, sm: 3 },
                backgroundColor: '#1976d2',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
                textTransform: 'none',
                minHeight: { xs: 52, sm: 56, md: 'auto' },
                width: { xs: '100%', sm: 'auto' },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover': {
                  backgroundColor: '#1565c0',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(25, 118, 210, 0.6)',
                  '&::before': {
                    left: '100%',
                  },
                },
                '&:active': {
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          py: { xs: 4, sm: 6, md: 12 },
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
            opacity: 0.15,
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
            `,
            zIndex: 2,
            animation: 'float 20s ease-in-out infinite',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(180deg)' },
          },
        }}
        className="hero-section"
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Modern Hero Layout */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
            {/* Main Title */}
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem', lg: '3.5rem', xl: '4rem' },
                fontWeight: 800,
                color: 'white',
                mb: { xs: 1, sm: 1.5, md: 3 },
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                px: { xs: 1, sm: 2, md: 0 },
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              UWE Lost & Found Portal
            </Typography>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.3rem', lg: '1.5rem' },
                color: 'rgba(255, 255, 255, 0.9)',
                mb: { xs: 3, sm: 4, md: 6 },
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                px: { xs: 2, md: 0 },
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              Connect with fellow students to find lost items and help others recover their belongings
            </Typography>

            {/* Statistics Cards */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: { xs: 1, sm: 1.5, md: 3 }, 
              mb: { xs: 2.5, sm: 3, md: 8 }, 
              flexWrap: 'wrap',
              px: { xs: 1, sm: 2, md: 0 },
              maxWidth: { xs: '100%', sm: '500px', md: '600px' },
              mx: 'auto',
            }}>
              {[
                { number: '50+', label: 'Items Found', color: '#4CAF50' },
                { number: '200+', label: 'Students', color: '#2196F3' },
                { number: '95%', label: 'Success Rate', color: '#FF9800' }
              ].map((stat, index) => (
                <Card
                  key={index}
                  sx={{
                    minWidth: { xs: 90, sm: 110, md: 140, lg: 160 },
                    p: { xs: 1.25, sm: 1.5, md: 3 },
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: { xs: 1.5, sm: 2, md: 3 },
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    flex: { xs: '1 1 calc(50% - 4px)', sm: '1 1 calc(33.333% - 8px)', md: '0 1 auto' },
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: stat.color,
                      fontWeight: 700,
                      mb: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.5rem' },
                      lineHeight: 1,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666',
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.95rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Card>
              ))}
            </Box>

            {/* CTA Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1.5, sm: 2, md: 3 }, 
              justifyContent: 'center', 
              flexWrap: 'wrap', 
              mb: { xs: 3, sm: 4, md: 8 },
              flexDirection: { xs: 'column', sm: 'row' },
              px: { xs: 1, sm: 2, md: 0 },
              maxWidth: { xs: '100%', sm: '500px', md: '600px' },
              mx: 'auto',
            }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: { xs: 3, sm: 4, md: 6 },
                  py: { xs: 2, sm: 2.5, md: 2 },
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  fontWeight: 700,
                  borderRadius: { xs: 2, sm: 3 },
                  backgroundColor: '#1976d2',
                  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
                  minHeight: { xs: 52, sm: 56, md: 'auto' },
                  width: { xs: '100%', sm: 'auto' },
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(25, 118, 210, 0.6)',
                    '&::before': {
                      left: '100%',
                    },
                  },
                  '&:active': {
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: { xs: 3, sm: 4, md: 6 },
                  py: { xs: 2, sm: 2.5, md: 2 },
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  fontWeight: 700,
                  borderRadius: { xs: 2, sm: 3 },
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: 2,
                  minHeight: { xs: 52, sm: 56, md: 'auto' },
                  width: { xs: '100%', sm: 'auto' },
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(255, 255, 255, 0.3)',
                  },
                  '&:active': {
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onClick={() => navigate('/lost')}
              >
                Browse Items
              </Button>
            </Box>

            {/* Features Grid */}
            <Grid 
              container 
              spacing={{ xs: 1, sm: 1.5, md: 3, lg: 4 }} 
              sx={{ 
                maxWidth: { xs: '100%', sm: 600, md: 800, lg: 1200, xl: 1400 },
                mx: 'auto', 
                px: { xs: 0.5, sm: 1, md: 0 },
                justifyContent: 'center'
              }}
            >
              {[
                { icon: <SearchIcon sx={{ fontSize: { xs: 20, sm: 24, md: 32 } }} />, title: 'Quick Search', desc: 'Find items instantly', link: '/search' },
                { icon: <NotificationsIcon sx={{ fontSize: { xs: 20, sm: 24, md: 32 } }} />, title: 'Instant Alerts', desc: 'Get notified immediately', link: '/alerts' },
                { icon: <AddCircleIcon sx={{ fontSize: { xs: 20, sm: 24, md: 32 } }} />, title: 'Easy Report', desc: 'Report in seconds', link: '/report' },
                { icon: <SecurityIcon sx={{ fontSize: { xs: 20, sm: 24, md: 32 } }} />, title: 'Secure Platform', desc: 'Safe and reliable', link: '/security' },
                { icon: <SpeedIcon sx={{ fontSize: { xs: 20, sm: 24, md: 32 } }} />, title: 'Fast Response', desc: 'Quick and efficient', link: '/about' },
                { icon: <GroupIcon sx={{ fontSize: { xs: 20, sm: 24, md: 32 } }} />, title: 'Community Support', desc: 'Help from fellow students', link: '/team' },
                { icon: <SupportAgentIcon sx={{ fontSize: { xs: 20, sm: 24, md: 32 } }} />, title: '24/7 Support', desc: 'Always here to help', link: '/support' },
                { icon: <VerifiedUserIcon sx={{ fontSize: { xs: 20, sm: 24, md: 32 } }} />, title: 'Verified Users', desc: 'Trusted community members', link: '/verified' }
              ].map((feature, index) => (
                <Grid 
                  item 
                  xs={6} 
                  sm={4} 
                  md={3} 
                  lg={3}
                  xl={3}
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Card
                    component={Button}
                    onClick={() => navigate(feature.link)}
                    sx={{
                      p: { xs: 1.5, sm: 2, md: 3 },
                      textAlign: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: { xs: 2, sm: 2.5, md: 3 },
                      transition: 'all 0.3s ease',
                      height: '100%',
                      width: '100%',
                      maxWidth: { xs: '100%', sm: 200, md: 250, lg: 280 },
                      minHeight: { xs: 100, sm: 120, md: 160 },
                      mx: 'auto',
                      cursor: 'pointer',
                      textTransform: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        '&::before': {
                          opacity: 1,
                        },
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 40, sm: 48, md: 64 },
                        height: { xs: 40, sm: 48, md: 64 },
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: { xs: 1, sm: 1.5, md: 2 },
                        color: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 600, 
                        mb: { xs: 0.5, sm: 1 },
                        fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.1rem' },
                        lineHeight: 1.2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                        lineHeight: 1.3,
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
      <Container maxWidth="lg" sx={{ mb: { xs: 4, md: 8 }, px: { xs: 2, md: 0 } }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: { xs: 3, md: 4 },
            fontSize: { xs: '1.5rem', md: '2rem' },
            px: { xs: 2, md: 0 },
          }}
        >
          Welcome to UWE Bristol
        </Typography>
        <Grid container spacing={{ xs: 2, md: 4 }}>
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
                  height: '250px',
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
                  p: { xs: 1.5, md: 2 },
                }}
              >
                <Typography 
                  variant="h6" 
                  component="h3"
                  sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                >
                  UWE Bristol Chancellors Scholarship
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                >
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
                  height: '250px',
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
                  p: { xs: 1.5, md: 2 },
                }}
              >
                <Typography 
                  variant="h6" 
                  component="h3"
                  sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                >
                  UWE Bristol Campus
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                >
                  A vibrant learning community where students thrive
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* UWE Campus Maps Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 4, md: 8 }, px: { xs: 2, md: 0 } }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: { xs: 3, md: 4 },
            fontSize: { xs: '1.5rem', md: '2rem' },
            px: { xs: 2, md: 0 },
          }}
        >
          Campus Maps & Navigation
        </Typography>
        <Grid container spacing={{ xs: 2, md: 4 }}>
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
                  height: '250px',
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
                <ZoomInIcon sx={{ color: 'white', fontSize: { xs: 18, md: 20 } }} />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  color: 'white',
                  p: { xs: 1.5, md: 2 },
                }}
              >
                <Typography 
                  variant="h6" 
                  component="h3"
                  sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                >
                  UWE Bristol Campus Overview
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                >
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
                  height: '250px',
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
                <ZoomInIcon sx={{ color: 'white', fontSize: { xs: 18, md: 20 } }} />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  color: 'white',
                  p: { xs: 1.5, md: 2 },
                }}
              >
                <Typography 
                  variant="h6" 
                  component="h3"
                  sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                >
                  Glenside Campus Map
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                >
                  Detailed map of the Glenside campus facilities
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 4, md: 8 }, px: { xs: 2, md: 0 } }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: { xs: 3, md: 4 },
            fontSize: { xs: '1.5rem', md: '2rem' },
            px: { xs: 2, md: 0 },
          }}
        >
          How It Works
        </Typography>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <SearchIcon sx={{ fontSize: { xs: 32, md: 40 }, color: 'primary.main' }} />
                </Box>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  gutterBottom 
                  align="center"
                  sx={{ fontSize: { xs: '1.125rem', md: '1.5rem' } }}
                >
                  Search
                </Typography>
                <Typography 
                  align="center"
                  sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
                  Browse through lost and found items to find what you're looking for
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <AddCircleIcon sx={{ fontSize: { xs: 32, md: 40 }, color: 'primary.main' }} />
                </Box>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  gutterBottom 
                  align="center"
                  sx={{ fontSize: { xs: '1.125rem', md: '1.5rem' } }}
                >
                  Report
                </Typography>
                <Typography 
                  align="center"
                  sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
                  Report lost items or submit found items to help others
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <NotificationsIcon sx={{ fontSize: { xs: 32, md: 40 }, color: 'primary.main' }} />
                </Box>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  gutterBottom 
                  align="center"
                  sx={{ fontSize: { xs: '1.125rem', md: '1.5rem' } }}
                >
                  Get Notified
                </Typography>
                <Typography 
                  align="center"
                  sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
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