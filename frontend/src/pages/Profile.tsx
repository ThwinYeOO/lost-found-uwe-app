import React, { useState } from 'react';
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

  // Mock user data - replace with actual user data from your auth system
  const userData = {
    name: 'John Doe',
    email: 'john.doe@uwe.ac.uk',
    phone: '+44 1234 567890',
    studentId: 'UWE12345678',
    department: 'Computer Science',
    avatar: null, // URL to user's avatar if available
  };

  // Mock reported items - replace with actual data from your database
  const reportedItems = {
    lost: [
      {
        id: 1,
        itemName: 'MacBook Pro',
        dateReported: new Date('2024-03-15'),
        status: 'Lost',
        location: 'Frenchay Campus',
      },
      {
        id: 2,
        itemName: 'Student ID Card',
        dateReported: new Date('2024-03-18'),
        status: 'Found',
        location: 'Glenside Campus',
      },
    ],
    found: [
      {
        id: 3,
        itemName: 'iPhone 13',
        dateReported: new Date('2024-03-19'),
        status: 'Available',
        location: 'Frenchay Campus',
      },
    ],
  };

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
                src={userData.avatar || undefined}
              >
                {!userData.avatar && <PersonIcon sx={{ fontSize: 60 }} />}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {userData.name}
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
                <ListItemText primary="Email" secondary={userData.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText primary="Phone" secondary={userData.phone} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Student ID"
                  secondary={userData.studentId}
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
              {reportedItems.lost.map((item) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.itemName}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Date Reported: {item.dateReported.toLocaleDateString()}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Location: {item.location}
                    </Typography>
                    <Typography
                      color={item.status === 'Found' ? 'success.main' : 'error.main'}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Status: {item.status}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </TabPanel>

            {/* Found Items Tab */}
            <TabPanel value={tabValue} index={1}>
              {reportedItems.found.map((item) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.itemName}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Date Reported: {item.dateReported.toLocaleDateString()}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Location: {item.location}
                    </Typography>
                    <Typography
                      color={item.status === 'Available' ? 'success.main' : 'error.main'}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Status: {item.status}
                    </Typography>
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