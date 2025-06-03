import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  School as SchoolIcon,
  Security as SecurityIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  ContactSupport as SupportIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const AboutUs: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        About UWE Lost & Found Portal
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome to UWE's Lost & Found Portal
        </Typography>
        <Typography paragraph>
          The University of the West of England (UWE) Lost & Found Portal is a dedicated platform
          designed to help our community members recover lost items and return found belongings
          to their rightful owners. Our mission is to create a seamless and efficient system
          that connects lost items with their owners while maintaining the highest standards
          of security and privacy.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                How It Works
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Report Lost Items"
                    secondary="Students and staff can report lost items with detailed descriptions and locations"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Report Found Items"
                    secondary="Anyone who finds an item can report it through our secure portal"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Campus Coverage"
                    secondary="Our service covers all UWE campuses: Frenchay, Glenside, City, and Bower Ashton"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <TimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Collection Process
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SupportIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Verification"
                    secondary="Items are verified and securely stored at campus security offices"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TimeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Collection Hours"
                    secondary="Items can be collected during campus security office hours"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Security"
                    secondary="Valid ID required for collection of items"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Contact Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Frenchay Campus
              </Typography>
              <Typography variant="body2" paragraph>
                Security Office: 0117 32 86333
                <br />
                Email: security@uwe.ac.uk
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Glenside Campus
              </Typography>
              <Typography variant="body2" paragraph>
                Security Office: 0117 32 86333
                <br />
                Email: security@uwe.ac.uk
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Important Notes
          </Typography>
          <Typography variant="body2" paragraph>
            • All items are held for 3 months before being disposed of or donated
            <br />
            • Valuable items are stored securely and require additional verification
            <br />
            • Please report lost items as soon as possible to increase chances of recovery
            <br />
            • For urgent matters, please contact campus security directly
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default AboutUs; 