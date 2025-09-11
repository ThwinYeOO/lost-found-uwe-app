import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

const Team: React.FC = () => {
  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Project Director',
      department: 'IT Services',
      email: 'sarah.johnson@uwe.ac.uk',
      phone: '0117 32 86333',
      bio: 'Leading the development and implementation of the Lost & Found portal with over 10 years of experience in digital transformation.',
      avatar: '/team-photo.jpg',
    },
    {
      name: 'Michael Chen',
      role: 'Lead Developer',
      department: 'Software Engineering',
      email: 'michael.chen@uwe.ac.uk',
      phone: '0117 32 86334',
      bio: 'Full-stack developer specializing in React and Node.js, responsible for the technical architecture and user experience.',
      avatar: '/team-photo.jpg',
    },
    {
      name: 'Emma Williams',
      role: 'UX/UI Designer',
      department: 'Digital Design',
      email: 'emma.williams@uwe.ac.uk',
      phone: '0117 32 86335',
      bio: 'User experience designer focused on creating intuitive and accessible interfaces for the UWE community.',
      avatar: '/team-photo.jpg',
    },
    {
      name: 'James Thompson',
      role: 'Security Coordinator',
      department: 'Campus Security',
      email: 'james.thompson@uwe.ac.uk',
      phone: '0117 32 86336',
      bio: 'Campus security specialist ensuring the safe storage and verification of all lost and found items.',
      avatar: '/team-photo.jpg',
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Community Manager',
      department: 'Student Services',
      email: 'lisa.rodriguez@uwe.ac.uk',
      phone: '0117 32 86337',
      bio: 'Student services coordinator managing community engagement and user support for the platform.',
      avatar: '/team-photo.jpg',
    },
    {
      name: 'David Park',
      role: 'Data Analyst',
      department: 'Analytics',
      email: 'david.park@uwe.ac.uk',
      phone: '0117 32 86338',
      bio: 'Data analyst responsible for platform analytics, matching algorithms, and performance optimization.',
      avatar: '/team-photo.jpg',
    },
  ];

  const departments = [
    {
      name: 'IT Services',
      description: 'Responsible for technical infrastructure and platform maintenance',
      icon: <SchoolIcon />,
      color: '#1976d2',
      members: 3,
    },
    {
      name: 'Campus Security',
      description: 'Handles item storage, verification, and collection processes',
      icon: <SecurityIcon />,
      color: '#f44336',
      members: 2,
    },
    {
      name: 'Student Services',
      description: 'Manages user support and community engagement',
      icon: <SupportIcon />,
      color: '#4CAF50',
      members: 2,
    },
  ];

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
            Meet Our Team
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
            The dedicated professionals behind the UWE Lost & Found Portal
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Team Overview */}
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 4 }}>
            Our Team
          </Typography>
          <Typography variant="h6" sx={{ color: '#666', maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}>
            Our diverse team of professionals from IT Services, Campus Security, and Student Services work together to ensure the Lost & Found portal provides the best possible experience for the UWE community.
          </Typography>
        </Box>

        {/* Departments */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Departments
          </Typography>
          <Grid container spacing={4}>
            {departments.map((dept, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: dept.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      color: 'white',
                    }}
                  >
                    {dept.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                    {dept.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
                    {dept.description}
                  </Typography>
                  <Chip 
                    label={`${dept.members} Members`} 
                    color="primary" 
                    variant="outlined"
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team Members */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Team Members
          </Typography>
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar
                      src={member.avatar}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 3,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      <PeopleIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                    
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                      {member.name}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ color: '#1976d2', mb: 1, fontWeight: 500 }}>
                      {member.role}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                      {member.department}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
                      {member.bio}
                    </Typography>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Box sx={{ textAlign: 'left' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmailIcon sx={{ fontSize: 16, color: '#666', mr: 2 }} />
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {member.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 16, color: '#666', mr: 2 }} />
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {member.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Team Section */}
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
            Get in Touch with Our Team
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Have questions about the Lost & Found portal or need technical support? Our team is here to help.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<EmailIcon />}
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
              Email Team
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PhoneIcon />}
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
              Call: 0117 32 86333
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Team;
