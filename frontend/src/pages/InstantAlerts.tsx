import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Grid,
  Button,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Alert,
  Snackbar,
  IconButton,
  Badge,
  Avatar,
  Tabs,
  Tab,
  Fade,
  Slide,
} from '@mui/material';
import {
  Notifications as NotificationIcon,
  NotificationsActive as ActiveIcon,
  NotificationsOff as OffIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Phone as PhoneIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface AlertRule {
  id: string;
  name: string;
  keywords: string[];
  categories: string[];
  locations: string[];
  isActive: boolean;
  notificationTypes: ('email' | 'sms' | 'push')[];
  frequency: 'instant' | 'daily' | 'weekly';
  createdAt: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'match' | 'reminder' | 'update' | 'system';
  isRead: boolean;
  timestamp: string;
  itemId?: string;
  priority: 'low' | 'medium' | 'high';
}

const InstantAlerts: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Mock data
  const mockAlertRules: AlertRule[] = [
    {
      id: '1',
      name: 'iPhone Alerts',
      keywords: ['iphone', 'apple', 'phone'],
      categories: ['electronics'],
      locations: ['Frenchay Campus', 'Glenside Campus'],
      isActive: true,
      notificationTypes: ['email', 'push'],
      frequency: 'instant',
      createdAt: '2024-01-10',
    },
    {
      id: '2',
      name: 'Backpack & Bags',
      keywords: ['backpack', 'bag', 'rucksack'],
      categories: ['bags'],
      locations: ['All Campuses'],
      isActive: true,
      notificationTypes: ['email'],
      frequency: 'daily',
      createdAt: '2024-01-08',
    },
    {
      id: '3',
      name: 'Keys & ID Cards',
      keywords: ['keys', 'id card', 'student card'],
      categories: ['keys'],
      locations: ['All Campuses'],
      isActive: false,
      notificationTypes: ['email', 'sms'],
      frequency: 'instant',
      createdAt: '2024-01-05',
    },
  ];

  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Potential Match Found!',
      message: 'A black iPhone was found near the library - this might be yours!',
      type: 'match',
      isRead: false,
      timestamp: '2024-01-15T10:30:00Z',
      itemId: 'item_123',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Daily Summary',
      message: '3 new items matching your criteria were found today.',
      type: 'reminder',
      isRead: true,
      timestamp: '2024-01-15T09:00:00Z',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'System Update',
      message: 'New search filters are now available in the portal.',
      type: 'system',
      isRead: false,
      timestamp: '2024-01-14T16:45:00Z',
      priority: 'low',
    },
  ];

  useEffect(() => {
    setAlertRules(mockAlertRules);
    setNotifications(mockNotifications);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleToggleAlert = (ruleId: string) => {
    setAlertRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, isActive: !rule.isActive }
          : rule
      )
    );
    setSnackbarMessage('Alert rule updated successfully');
    setShowSnackbar(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    setAlertRules(prev => prev.filter(rule => rule.id !== ruleId));
    setSnackbarMessage('Alert rule deleted successfully');
    setShowSnackbar(true);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setSnackbarMessage('All notifications marked as read');
    setShowSnackbar(true);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <CheckIcon color="success" />;
      case 'reminder':
        return <ScheduleIcon color="info" />;
      case 'update':
        return <InfoIcon color="primary" />;
      case 'system':
        return <SettingsIcon color="secondary" />;
      default:
        return <NotificationIcon />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 800, 
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Instant Alerts
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              opacity: 0.9, 
              maxWidth: '800px', 
              mx: 'auto',
              fontWeight: 300,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
            }}
          >
            Get notified immediately when items matching your criteria are found
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Notification Settings */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon />
            Notification Settings
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Global Settings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={alertsEnabled}
                        onChange={(e) => setAlertsEnabled(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {alertsEnabled ? <ActiveIcon color="primary" /> : <OffIcon />}
                        <Typography>Enable All Alerts</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        color="primary"
                        disabled={!alertsEnabled}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon />
                        <Typography>Email Notifications</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={smsNotifications}
                        onChange={(e) => setSmsNotifications(e.target.checked)}
                        color="primary"
                        disabled={!alertsEnabled}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SmsIcon />
                        <Typography>SMS Notifications</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={pushNotifications}
                        onChange={(e) => setPushNotifications(e.target.checked)}
                        color="primary"
                        disabled={!alertsEnabled}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotificationIcon />
                        <Typography>Push Notifications</Typography>
                      </Box>
                    }
                  />
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Quick Stats
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Active Alert Rules</Typography>
                    <Chip label={alertRules.filter(rule => rule.isActive).length} color="primary" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Unread Notifications</Typography>
                    <Badge badgeContent={unreadCount} color="error">
                      <Chip label={notifications.length} color="secondary" />
                    </Badge>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Matches This Week</Typography>
                    <Chip label="12" color="success" />
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationIcon />
                  <Typography>Notifications</Typography>
                  {unreadCount > 0 && (
                    <Badge badgeContent={unreadCount} color="error" />
                  )}
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterIcon />
                  <Typography>Alert Rules</Typography>
                </Box>
              } 
            />
          </Tabs>
        </Box>

        {/* Notifications Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Recent Notifications
              </Typography>
              <Button
                variant="outlined"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                startIcon={<CheckIcon />}
              >
                Mark All as Read
              </Button>
            </Box>

            <List>
              {notifications.map((notification, index) => (
                <Fade in timeout={300 + index * 100} key={notification.id}>
                  <Paper
                    elevation={notification.isRead ? 1 : 3}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      border: notification.isRead ? 'none' : '2px solid',
                      borderColor: 'primary.main',
                      bgcolor: notification.isRead ? 'background.paper' : 'rgba(33, 150, 243, 0.05)',
                    }}
                  >
                    <ListItem
                      sx={{ py: 2 }}
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={notification.priority}
                            size="small"
                            color={getPriorityColor(notification.priority) as any}
                            variant="outlined"
                          />
                          {!notification.isRead && (
                            <IconButton
                              size="small"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckIcon />
                            </IconButton>
                          )}
                        </Box>
                      }
                    >
                      <ListItemIcon>
                        {getNotificationIcon(notification.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: notification.isRead ? 400 : 600 }}>
                              {notification.title}
                            </Typography>
                            {!notification.isRead && (
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.main',
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(notification.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </Paper>
                </Fade>
              ))}
            </List>
          </Box>
        )}

        {/* Alert Rules Tab */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Alert Rules
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ borderRadius: 2 }}
              >
                Create New Rule
              </Button>
            </Box>

            <Grid container spacing={3}>
              {alertRules.map((rule, index) => (
                <Grid item xs={12} md={6} key={rule.id}>
                  <Slide direction="up" in timeout={300 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {rule.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" color="primary">
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteRule(rule.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Keywords:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {rule.keywords.map((keyword) => (
                              <Chip key={keyword} label={keyword} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Categories:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {rule.categories.map((category) => (
                              <Chip key={category} label={category} size="small" color="primary" variant="outlined" />
                            ))}
                          </Box>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Locations:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {rule.locations.map((location) => (
                              <Chip key={location} label={location} size="small" color="secondary" variant="outlined" />
                            ))}
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={rule.isActive}
                                onChange={() => handleToggleAlert(rule.id)}
                                color="primary"
                              />
                            }
                            label={rule.isActive ? 'Active' : 'Inactive'}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Created: {new Date(rule.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Slide>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Snackbar */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={() => setShowSnackbar(false)}
          message={snackbarMessage}
        />
      </Container>
    </Box>
  );
};

export default InstantAlerts;
