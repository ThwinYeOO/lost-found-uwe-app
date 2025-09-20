import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Search as LostIcon,
  CheckCircle as FoundIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MobileAppHome: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickActions = [
    {
      title: 'Report Lost Item',
      description: 'Lost something? Report it here',
      icon: <LostIcon sx={{ fontSize: 28 }} />,
      color: '#f44336',
      action: () => navigate('/lost-items'),
    },
    {
      title: 'Report Found Item',
      description: 'Found something? Help return it',
      icon: <FoundIcon sx={{ fontSize: 28 }} />,
      color: '#4caf50',
      action: () => navigate('/found-items'),
    },
    {
      title: 'Quick Search',
      description: 'Search for lost items',
      icon: <SearchIcon sx={{ fontSize: 28 }} />,
      color: '#2196f3',
      action: () => navigate('/search'),
    },
  ];

  const recentItems = [
    {
      id: 1,
      title: 'iPhone 13 Pro',
      location: 'Library Building',
      time: '2 hours ago',
      type: 'lost',
      user: 'John D.',
    },
    {
      id: 2,
      title: 'Black Backpack',
      location: 'Cafeteria',
      time: '4 hours ago',
      type: 'found',
      user: 'Sarah M.',
    },
    {
      id: 3,
      title: 'MacBook Air',
      location: 'Computer Lab',
      time: '1 day ago',
      type: 'lost',
      user: 'Mike R.',
    },
  ];

  const stats = [
    { label: 'Items Found', value: '1,234', icon: <FoundIcon />, color: '#4caf50' },
    { label: 'Active Users', value: '2,456', icon: <PersonIcon />, color: '#2196f3' },
    { label: 'Success Rate', value: '89%', icon: <TrendingIcon />, color: '#ff9800' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
          color: 'white',
          py: 4,
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="20" cy="20" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            animation: 'float 20s ease-in-out infinite',
          },
        }}
      >
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
              >
                Welcome to UWE Lost & Found
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                }}
              >
                Connect with your community to find and return lost items
              </Typography>
            </Box>
          </Fade>

          {/* Search Bar */}
          <Fade in timeout={1000}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                mb: 3,
              }}
            >
              <TextField
                fullWidth
                placeholder="Search for lost items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch} edge="end">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  },
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    py: 2,
                    fontSize: '16px',
                  },
                }}
              />
            </Paper>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ py: 3, px: 2 }}>
        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Zoom in timeout={1200 + index * 200}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <CardActionArea onClick={action.action} sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            backgroundColor: action.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            mb: 2,
                          }}
                        >
                          {action.icon}
                        </Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            fontSize: '0.9rem',
                          }}
                        >
                          {action.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            fontSize: '0.8rem',
                            lineHeight: 1.3,
                          }}
                        >
                          {action.description}
                        </Typography>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Statistics */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
            Community Stats
          </Typography>
          <Grid container spacing={2}>
            {stats.map((stat, index) => (
              <Grid item xs={4} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <Box
                    sx={{
                      color: stat.color,
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      color: '#333',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      fontSize: '0.8rem',
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recent Items */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              Recent Items
            </Typography>
            <Button
              size="small"
              onClick={() => navigate('/lost-items')}
              sx={{ textTransform: 'none', fontSize: '0.8rem' }}
            >
              View All
            </Button>
          </Box>
          <List sx={{ p: 0 }}>
            {recentItems.map((item, index) => (
              <Card
                key={item.id}
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                }}
              >
                <ListItem
                  sx={{
                    p: 2,
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar
                      sx={{
                        bgcolor: item.type === 'lost' ? '#f44336' : '#4caf50',
                        width: 40,
                        height: 40,
                      }}
                    >
                      {item.type === 'lost' ? <LostIcon /> : <FoundIcon />}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          color: '#333',
                        }}
                      >
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <LocationIcon sx={{ fontSize: 14, mr: 0.5, color: '#666' }} />
                          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
                            {item.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ScheduleIcon sx={{ fontSize: 14, mr: 0.5, color: '#666' }} />
                            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
                              {item.time}
                            </Typography>
                          </Box>
                          <Chip
                            label={item.type === 'lost' ? 'Lost' : 'Found'}
                            size="small"
                            sx={{
                              backgroundColor: item.type === 'lost' ? '#ffebee' : '#e8f5e8',
                              color: item.type === 'lost' ? '#f44336' : '#4caf50',
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              </Card>
            ))}
          </List>
        </Box>

        {/* Features */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
            Why Choose Us?
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}
              >
                <SecurityIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Secure Platform
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
                  Your data is safe with us
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}
              >
                <SupportIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  24/7 Support
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
                  We're here to help
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default MobileAppHome;
