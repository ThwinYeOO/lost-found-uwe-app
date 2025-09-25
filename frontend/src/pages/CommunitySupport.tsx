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
  Alert,
  Fade,
  Zoom,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Badge,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Handshake as HandshakeIcon,
  Forum as ForumIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Support as SupportIcon,
  Chat as ChatIcon,
  EmojiEvents as EmojiEventsIcon,
  Psychology as PsychologyIcon,
  VolunteerActivism as VolunteerActivismIcon,
  Public as PublicIcon,
  LocationOn as LocationOnIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
      id={`community-tabpanel-${index}`}
      aria-labelledby={`community-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CommunitySupport: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const communityStats = [
    { label: 'Active Members', value: '2,847', icon: <PeopleIcon />, color: '#4caf50' },
    { label: 'Items Reunited', value: '1,234', icon: <HandshakeIcon />, color: '#2196f3' },
    { label: 'Success Rate', value: '94.2%', icon: <StarIcon />, color: '#ff9800' },
    { label: 'Community Posts', value: '5,678', icon: <ForumIcon />, color: '#9c27b0' },
  ];

  const communityFeatures = [
    {
      title: 'Peer-to-Peer Help',
      description: 'Connect directly with fellow students who can assist you',
      icon: <HandshakeIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
      benefits: ['Direct messaging', 'Real-time assistance', 'Personal connections'],
    },
    {
      title: 'Study Groups',
      description: 'Join study groups and academic support communities',
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
      benefits: ['Academic support', 'Study materials', 'Peer tutoring'],
    },
    {
      title: 'Campus Events',
      description: 'Stay updated with campus events and community activities',
      icon: <EmojiEventsIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
      benefits: ['Event notifications', 'Community meetups', 'Social activities'],
    },
    {
      title: 'Mentorship Program',
      description: 'Get guidance from senior students and alumni',
      icon: <PsychologyIcon sx={{ fontSize: 40, color: '#9c27b0' }} />,
      benefits: ['Career guidance', 'Academic advice', 'Life coaching'],
    },
  ];

  const recentPosts = [
    {
      id: 1,
      author: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      title: 'Found: Black iPhone 13 near Library',
      content: 'Found a black iPhone 13 near the main library entrance. Please contact me if it\'s yours!',
      timestamp: '2 hours ago',
      likes: 12,
      comments: 5,
      category: 'Found Item',
      verified: true,
    },
    {
      id: 2,
      author: 'Mike Chen',
      avatar: '/api/placeholder/40/40',
      title: 'Study Group for CS101 - Anyone interested?',
      content: 'Looking to form a study group for CS101. We meet every Tuesday and Thursday at 6 PM in the library.',
      timestamp: '4 hours ago',
      likes: 8,
      comments: 12,
      category: 'Study Group',
      verified: false,
    },
    {
      id: 3,
      author: 'Emma Wilson',
      avatar: '/api/placeholder/40/40',
      title: 'Lost: MacBook Pro charger',
      content: 'Lost my MacBook Pro charger yesterday. It\'s a 96W USB-C charger. Reward offered!',
      timestamp: '6 hours ago',
      likes: 15,
      comments: 8,
      category: 'Lost Item',
      verified: true,
    },
  ];

  const successStories = [
    {
      title: 'Reunited After 3 Days',
      story: 'Thanks to the community, I found my lost wallet within 3 days. The support was amazing!',
      author: 'Alex Thompson',
      item: 'Wallet',
      time: '2 days ago',
    },
    {
      title: 'Study Group Success',
      story: 'Joined a study group through the platform and improved my grades significantly.',
      author: 'Maria Garcia',
      item: 'Study Group',
      time: '1 week ago',
    },
    {
      title: 'Found My Phone',
      story: 'Community members helped me locate my lost phone within hours. So grateful!',
      author: 'David Lee',
      item: 'iPhone',
      time: '3 days ago',
    },
  ];

  const campusGroups = [
    {
      name: 'Computer Science Society',
      members: 156,
      description: 'Connect with fellow CS students and share resources',
      category: 'Academic',
      active: true,
    },
    {
      name: 'Lost & Found Helpers',
      members: 89,
      description: 'Dedicated group helping with lost and found items',
      category: 'Community Service',
      active: true,
    },
    {
      name: 'Study Buddies',
      members: 234,
      description: 'Find study partners for any subject',
      category: 'Academic',
      active: true,
    },
    {
      name: 'Campus Events',
      members: 445,
      description: 'Stay updated with all campus events and activities',
      category: 'Social',
      active: true,
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
                <PeopleIcon sx={{ fontSize: 80, mb: 2 }} />
              </Zoom>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Community Support
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Help from Fellow Students
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                Connect with your UWE community, get help from fellow students, 
                and contribute to making our campus a better place for everyone.
              </Typography>
              
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setOpenDialog(true)}
                  sx={{ bgcolor: 'white', color: 'primary.main', px: 4 }}
                >
                  Join Community
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setTabValue(1)}
                  sx={{ borderColor: 'white', color: 'white', px: 4 }}
                >
                  Browse Posts
                </Button>
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
          Community Impact
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
          Numbers that show our community's strength and support
        </Typography>

        <Grid container spacing={4}>
          {communityStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Fade in timeout={1000 + index * 200}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: `${stat.color}10`,
                    border: `2px solid ${stat.color}30`,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ color: stat.color, mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
            Community Features
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Discover all the ways our community can help and support you
          </Typography>

          <Grid container spacing={4}>
            {communityFeatures.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Card sx={{ height: '100%', transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'translateY(-8px)' } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                        <Box sx={{ mr: 3 }}>
                          {feature.icon}
                        </Box>
                        <Box>
                          <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                            {feature.title}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            {feature.description}
                          </Typography>
                          <List dense>
                            {feature.benefits.map((benefit, idx) => (
                              <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                </ListItemIcon>
                                <ListItemText primary={benefit} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Tabs Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="community tabs">
            <Tab label="Recent Posts" />
            <Tab label="Success Stories" />
            <Tab label="Campus Groups" />
            <Tab label="Get Help" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search community posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Grid container spacing={3}>
            {recentPosts.map((post, index) => (
              <Grid item xs={12} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar src={post.avatar} sx={{ mr: 2 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {post.author}
                            </Typography>
                            {post.verified && (
                              <Tooltip title="Verified User">
                                <CheckCircleIcon sx={{ fontSize: 16, color: 'primary.main', ml: 1 }} />
                              </Tooltip>
                            )}
                            <Chip label={post.category} size="small" sx={{ ml: 2 }} />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {post.timestamp}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {post.title}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {post.content}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button startIcon={<ThumbUpIcon />} size="small">
                          {post.likes}
                        </Button>
                        <Button startIcon={<CommentIcon />} size="small">
                          {post.comments}
                        </Button>
                        <Button startIcon={<ShareIcon />} size="small">
                          Share
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {successStories.map((story, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {story.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {story.story}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight="bold">
                          {story.author}
                        </Typography>
                        <Chip label={story.item} size="small" color="primary" />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {story.time}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {campusGroups.map((group, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <GroupIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight="bold">
                          {group.name}
                        </Typography>
                        {group.active && (
                          <Chip label="Active" size="small" color="success" sx={{ ml: 1 }} />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {group.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2">
                          {group.members} members
                        </Typography>
                        <Chip label={group.category} size="small" variant="outlined" />
                      </Box>
                      <Button variant="contained" fullWidth size="small">
                        Join Group
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Need Help?
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Our community is here to help! Reach out to fellow students for assistance.
                  </Typography>
                  <Stack spacing={2}>
                    <Button variant="contained" startIcon={<ChatIcon />} fullWidth>
                      Start a Discussion
                    </Button>
                    <Button variant="outlined" startIcon={<EmailIcon />} fullWidth>
                      Contact Support
                    </Button>
                    <Button variant="outlined" startIcon={<PhoneIcon />} fullWidth>
                      Call Help Line
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Want to Help?
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Join our community and help fellow students in need.
                  </Typography>
                  <Stack spacing={2}>
                    <Button variant="contained" startIcon={<VolunteerActivismIcon />} fullWidth>
                      Become a Volunteer
                    </Button>
                    <Button variant="outlined" startIcon={<ForumIcon />} fullWidth>
                      Join Discussions
                    </Button>
                    <Button variant="outlined" startIcon={<ShareIcon />} fullWidth>
                      Share Resources
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Container>

      {/* Join Community Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Join Our Community</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Join the UWE Lost & Found community to connect with fellow students and get help when you need it.
          </Typography>
          <Stack spacing={2}>
            <TextField label="Full Name" fullWidth />
            <TextField label="Student ID" fullWidth />
            <TextField label="Email" type="email" fullWidth />
            <TextField label="Phone Number" fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Join Community
          </Button>
        </DialogActions>
      </Dialog>

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
            Ready to Join Our Community?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Connect with fellow students and make a difference in our campus community
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ bgcolor: 'white', color: 'primary.main', px: 4 }}
            >
              Join Now
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

export default CommunitySupport;
