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
  Button,
  Chip,
  Avatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  School as SchoolIcon,
  Security as SecurityIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  ContactSupport as SupportIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Map as MapIcon,
} from '@mui/icons-material';

const AboutUs: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
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
            About UWE Lost & Found Portal
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
            Connecting our community through a secure, efficient platform for recovering lost items and helping fellow students
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Mission & Vision Section */}
        <Box sx={{ mb: 8 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
                Our Mission
              </Typography>
              <Typography variant="h6" sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
                To create a seamless, secure, and efficient system that connects lost items with their rightful owners while fostering a sense of community and mutual support among UWE students and staff.
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', mb: 4, lineHeight: 1.7 }}>
                We believe that every lost item has a story and every found item represents an opportunity to help a fellow community member. Our platform ensures that valuable belongings find their way back home while maintaining the highest standards of security and privacy.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label="100% Secure" 
                  color="success" 
                  variant="outlined"
                />
                <Chip 
                  icon={<PeopleIcon />} 
                  label="Community Driven" 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  icon={<SecurityIcon />} 
                  label="Privacy First" 
                  color="info" 
                  variant="outlined"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39736.970295184045!2d-2.6287581513672427!3d51.502929599999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48718fa5b4e5f827%3A0xfef76b37b45ecccc!2sFrenchay%20Campus!5e0!3m2!1sen!2sth!4v1757580221796!5m2!1sen!2sth"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="UWE Frenchay Campus Map"
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    p: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    UWE Frenchay Campus
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Interactive map of our main campus
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Statistics Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Our Impact
          </Typography>
          <Grid container spacing={4}>
            {[
              { number: '500+', label: 'Items Recovered', icon: <CheckCircleIcon />, color: '#4CAF50' },
              { number: '1,200+', label: 'Active Users', icon: <PeopleIcon />, color: '#2196F3' },
              { number: '95%', label: 'Success Rate', icon: <TrendingUpIcon />, color: '#FF9800' },
              { number: '4', label: 'Campus Locations', icon: <LocationIcon />, color: '#9C27B0' },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: stat.color,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color, mb: 1 }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#666', fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* How It Works Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                step: '01',
                title: 'Report Lost Item',
                description: 'Students and staff can report lost items with detailed descriptions, photos, and location information.',
                icon: <SchoolIcon />,
                color: '#f44336',
              },
              {
                step: '02',
                title: 'Report Found Item',
                description: 'Anyone who finds an item can report it through our secure portal with photos and location details.',
                icon: <SecurityIcon />,
                color: '#4CAF50',
              },
              {
                step: '03',
                title: 'Smart Matching',
                description: 'Our intelligent system matches lost and found items based on descriptions, locations, and timestamps.',
                icon: <CheckCircleIcon />,
                color: '#2196F3',
              },
              {
                step: '04',
                title: 'Secure Collection',
                description: 'Items are verified and securely stored at campus security offices for safe collection.',
                icon: <LocationIcon />,
                color: '#FF9800',
              },
            ].map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 3,
                      }}
                    >
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                        {item.step}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {item.icon}
                        <Typography variant="body2" sx={{ color: '#666', ml: 1 }}>
                          Step {item.step}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Campus Coverage Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Campus Coverage
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                name: 'Frenchay Campus',
                description: 'Main campus with comprehensive facilities',
                phone: '0117 32 86333',
                email: 'security@uwe.ac.uk',
                hours: '24/7 Security Office',
              },
              {
                name: 'Glenside Campus',
                description: 'Health and social care focused campus',
                phone: '0117 32 86333',
                email: 'security@uwe.ac.uk',
                hours: '24/7 Security Office',
              },
              {
                name: 'City Campus',
                description: 'Located in the heart of Bristol',
                phone: '0117 32 86333',
                email: 'security@uwe.ac.uk',
                hours: '24/7 Security Office',
              },
              {
                name: 'Bower Ashton Campus',
                description: 'Creative industries and arts campus',
                phone: '0117 32 86333',
                email: 'security@uwe.ac.uk',
                hours: '24/7 Security Office',
              },
            ].map((campus, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: '#1976d2',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <LocationIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                      {campus.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      {campus.description}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}>
                      <PhoneIcon sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {campus.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}>
                      <EmailIcon sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {campus.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TimeIcon sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {campus.hours}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {[
              {
                question: 'How long are items kept before disposal?',
                answer: 'All items are held for 3 months before being disposed of or donated to charity. Valuable items may be held longer for additional verification.',
              },
              {
                question: 'What information do I need to provide when reporting a lost item?',
                answer: 'Please provide a detailed description, approximate location where it was lost, date and time, and any identifying features. Photos are highly recommended.',
              },
              {
                question: 'Is there a fee for using the Lost & Found service?',
                answer: 'No, the Lost & Found service is completely free for all UWE students and staff members.',
              },
              {
                question: 'How do I claim a found item?',
                answer: 'You will need to provide valid ID and proof of ownership. Contact the campus security office where the item is stored to arrange collection.',
              },
              {
                question: 'Can I report items lost outside of campus?',
                answer: 'Yes, you can report items lost anywhere, but our collection points are only available at UWE campus locations.',
              },
            ].map((faq, index) => (
              <Accordion key={index} sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* Contact CTA Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            p: 6,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Need Help or Have Questions?
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Our dedicated support team is here to help you with any questions about the Lost & Found portal or assistance with recovering your items.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PhoneIcon />}
              sx={{
                backgroundColor: 'white',
                color: '#1976d2',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Call Security: 0117 32 86333
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<EmailIcon />}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                },
              }}
            >
              Email: security@uwe.ac.uk
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs; 