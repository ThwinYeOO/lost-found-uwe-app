import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  LinearProgress,
  Alert,
  Fade,
  Zoom,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Notifications as NotificationsIcon,
  AutoAwesome as AutoAwesomeIcon,
  FlashOn as FlashOnIcon,
  Timer as TimerIcon,
  Rocket as RocketIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FastResponse: React.FC = () => {
  const navigate = useNavigate();
  const [responseTime, setResponseTime] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const features = [
    {
      title: 'Instant Processing',
      description: 'Reports are processed and published within seconds',
      icon: <FlashOnIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
      stats: '< 5 seconds',
      color: '#4caf50',
    },
    {
      title: 'Real-time Updates',
      description: 'Get instant notifications when items are found or claimed',
      icon: <NotificationsIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
      stats: 'Real-time',
      color: '#2196f3',
    },
    {
      title: 'Automated Matching',
      description: 'AI-powered system matches lost and found items automatically',
      icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
      stats: '95% accuracy',
      color: '#ff9800',
    },
    {
      title: 'Priority Queue',
      description: 'Urgent items get processed first with priority handling',
      icon: <RocketIcon sx={{ fontSize: 40, color: '#f44336' }} />,
      stats: 'Priority',
      color: '#f44336',
    },
  ];

  const responseStats = [
    { label: 'Average Response Time', value: '2.3 seconds', icon: <TimerIcon /> },
    { label: 'Success Rate', value: '99.8%', icon: <CheckCircleIcon /> },
    { label: 'Items Processed Today', value: '1,247', icon: <TrendingUpIcon /> },
    { label: 'Active Users', value: '2,156', icon: <SupportIcon /> },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Submit Report',
      description: 'Upload your lost or found item details',
      time: '30 seconds',
      icon: <PlayArrowIcon />,
    },
    {
      step: 2,
      title: 'AI Processing',
      description: 'System analyzes and categorizes your item',
      time: '2 seconds',
      icon: <AutoAwesomeIcon />,
    },
    {
      step: 3,
      title: 'Match Detection',
      description: 'Automatically searches for potential matches',
      time: '1 second',
      icon: <SearchIcon />,
    },
    {
      step: 4,
      title: 'Notification Sent',
      description: 'Relevant users are notified instantly',
      time: '1 second',
      icon: <NotificationsIcon />,
    },
  ];

  const simulateResponse = () => {
    setIsSimulating(true);
    setResponseTime(0);
    
    const interval = setInterval(() => {
      setResponseTime(prev => {
        if (prev >= 5) {
          clearInterval(interval);
          setIsSimulating(false);
          return 5;
        }
        return prev + 0.1;
      });
    }, 100);
  };

  const quickActions = [
    {
      title: 'Report Lost Item',
      description: 'Quick report for lost belongings',
      action: () => navigate('/lost-items'),
      color: '#f44336',
    },
    {
      title: 'Report Found Item',
      description: 'Help return found items',
      action: () => navigate('/found-items'),
      color: '#4caf50',
    },
    {
      title: 'Search Items',
      description: 'Find your lost items quickly',
      action: () => navigate('/search'),
      color: '#2196f3',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box textAlign="center">
              <Zoom in timeout={1200}>
                <SpeedIcon sx={{ fontSize: 80, mb: 2 }} />
              </Zoom>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Fast Response
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Quick and Efficient Service
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                Experience lightning-fast processing with our advanced system. 
                Get instant results and real-time updates for all your lost and found needs.
              </Typography>
              
              {/* Response Time Simulation */}
              <Paper
                sx={{
                  p: 3,
                  mb: 4,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Live Response Time
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(responseTime / 5) * 100}
                    sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="h4" fontWeight="bold">
                    {responseTime.toFixed(1)}s
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={simulateResponse}
                  disabled={isSimulating}
                  startIcon={isSimulating ? <RefreshIcon /> : <PlayArrowIcon />}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                >
                  {isSimulating ? 'Processing...' : 'Test Response Time'}
                </Button>
              </Paper>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
          Why We're Fast
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Advanced technology and optimized processes ensure lightning-fast service
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Fade in timeout={1000 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { transform: 'translateY(-8px)' },
                    border: `2px solid ${feature.color}20`,
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                    <Chip
                      label={feature.stats}
                      sx={{
                        bgcolor: `${feature.color}20`,
                        color: feature.color,
                        fontWeight: 'bold',
                      }}
                    />
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Process Steps */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
            How It Works
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Our streamlined process ensures maximum speed and efficiency
          </Typography>

          <Grid container spacing={4}>
            {processSteps.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Card sx={{ height: '100%', textAlign: 'center' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          mx: 'auto',
                          mb: 2,
                          bgcolor: 'primary.main',
                          fontSize: '1.5rem',
                        }}
                      >
                        {step.step}
                      </Avatar>
                      <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {step.description}
                      </Typography>
                      <Chip
                        icon={step.icon}
                        label={step.time}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
          Performance Metrics
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Real-time statistics showing our commitment to speed and efficiency
        </Typography>

        <Grid container spacing={4}>
          {responseStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Fade in timeout={1000 + index * 200}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {stat.label}
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Quick Actions */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
            Get Started Now
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Experience our fast response system today
          </Typography>

          <Grid container spacing={4}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                      },
                    }}
                    onClick={action.action}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          bgcolor: `${action.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        <SpeedIcon sx={{ fontSize: 30, color: action.color }} />
                      </Box>
                      <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                        {action.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {action.description}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{ bgcolor: action.color }}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Ready to Experience Fast Response?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of users who trust our lightning-fast service
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ bgcolor: 'white', color: 'primary.main', px: 4 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/about')}
              sx={{ borderColor: 'white', color: 'white', px: 4 }}
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default FastResponse;
