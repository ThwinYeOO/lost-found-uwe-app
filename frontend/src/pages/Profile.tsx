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
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { User, Item } from '../types';
import { useNavigate } from 'react-router-dom';
import { getUserItems } from '../services/firestore';
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{ width: 100, height: 100, mb: 2 }}
                src={currentUser?.avatar || undefined}
              >
                {!currentUser?.avatar && <PersonIcon sx={{ fontSize: 60 }} />}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {currentUser?.name || 'N/A'}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ mt: 1 }}
              >
                Edit Profile
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={currentUser?.email || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText primary="Phone Number" secondary={currentUser?.phoneNumber || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Student ID"
                  secondary={currentUser?.uweId || 'N/A'}
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
                          style={{ maxWidth: '100%', height: 'auto' }}
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
                          style={{ maxWidth: '100%', height: 'auto' }}
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
    </Container>
  );
};

export default Profile; 