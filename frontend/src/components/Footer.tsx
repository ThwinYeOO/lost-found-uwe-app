import React from 'react';
import { 
  Box, 
  Container, 
  Link, 
  Typography, 
  Grid, 
  Divider,
  IconButton,
  Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Lost Items', path: '/lost' },
    { label: 'Found Items', path: '/found' },
    { label: 'About Us', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Team', path: '/team' },
    { label: 'Contact', path: '/contact' },
  ];

  const supportLinks = [
    { label: 'Help Center', path: '/faq' },
    { label: 'Report Issue', path: '/contact' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Cookie Settings', path: '/cookies' },
  ];

  const campusInfo = [
    { name: 'Frenchay Campus', phone: '0117 32 86333' },
    { name: 'Glenside Campus', phone: '0117 32 86333' },
    { name: 'City Campus', phone: '0117 32 86333' },
    { name: 'Bower Ashton', phone: '0117 32 86333' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        backgroundColor: '#1a1a1a',
        color: 'white',
        py: 6,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={{ xs: 3, sm: 4, md: 4 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  component="img"
                  src="/uwe-logo.png"
                  alt="UWE Bristol Logo"
                  sx={{
                    height: { xs: '32px', sm: '36px', md: '40px' },
                    width: 'auto',
                    marginRight: { xs: '8px', sm: '10px', md: '12px' },
                    objectFit: 'contain',
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                  UWE Lost & Found
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.6 }}>
                Connecting our community through a secure, efficient platform for recovering lost items and helping fellow students.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<SecurityIcon />} 
                  label="Secure" 
                  size="small" 
                  sx={{ backgroundColor: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50' }}
                />
                <Chip 
                  icon={<SupportIcon />} 
                  label="24/7 Support" 
                  size="small" 
                  sx={{ backgroundColor: 'rgba(33, 150, 243, 0.2)', color: '#2196F3' }}
                />
                <Chip 
                  icon={<SchoolIcon />} 
                  label="UWE Community" 
                  size="small" 
                  sx={{ backgroundColor: 'rgba(156, 39, 176, 0.2)', color: '#9C27B0' }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'white',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {supportLinks.map((link) => (
                <Link
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'white',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.8)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  security@uwe.ac.uk
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.8)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  +44 (0) 117 32 86333
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.8)', mt: 0.5 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Frenchay Campus<br />
                  Coldharbour Lane<br />
                  Bristol BS16 1QY
                </Typography>
              </Box>
            </Box>

            {/* Social Media */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  <TwitterIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            © {currentYear} University of the West of England. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Lost & Found Portal v2.0 | Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 