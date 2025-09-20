import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Alert,
  Divider,
  Avatar,
  LinearProgress,
  Fade,
  Slide,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
  VerifiedUser as VerifiedIcon,
  PrivacyTip as PrivacyIcon,
  Security as EncryptionIcon,
  AdminPanelSettings as AdminIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  Policy as PolicyIcon,
  Gavel as GavelIcon,
  School as SchoolIcon,
  ContactSupport as SupportIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

const SecurePlatform: React.FC = () => {
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const securityFeatures = [
    {
      icon: <EncryptionIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'End-to-End Encryption',
      description: 'All data is encrypted using industry-standard AES-256 encryption',
      details: 'Your personal information and item details are protected with military-grade encryption both in transit and at rest.',
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'User Verification',
      description: 'All users are verified through UWE email addresses',
      details: 'Only verified UWE students and staff can access the platform, ensuring a trusted community.',
    },
    {
      icon: <PrivacyIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Privacy Protection',
      description: 'Your personal information is never shared without consent',
      details: 'We follow strict privacy guidelines and only share necessary information to facilitate item recovery.',
    },
    {
      icon: <AdminIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Admin Monitoring',
      description: '24/7 monitoring by campus security and IT administrators',
      details: 'All activities are monitored to ensure platform integrity and user safety.',
    },
  ];

  const complianceStandards = [
    {
      standard: 'GDPR Compliance',
      description: 'Full compliance with General Data Protection Regulation',
      status: 'Certified',
      color: 'success' as const,
    },
    {
      standard: 'ISO 27001',
      description: 'Information Security Management System certification',
      status: 'Certified',
      color: 'success' as const,
    },
    {
      standard: 'SOC 2 Type II',
      description: 'Security, availability, and confidentiality controls',
      status: 'Audited',
      color: 'info' as const,
    },
    {
      standard: 'UWE Security Policy',
      description: 'Compliance with university security standards',
      status: 'Active',
      color: 'primary' as const,
    },
  ];

  const securityMeasures = [
    {
      category: 'Data Protection',
      measures: [
        'Personal data is encrypted using AES-256 encryption',
        'Regular security audits and penetration testing',
        'Secure data centers with 24/7 monitoring',
        'Automatic data backup and disaster recovery',
      ],
    },
    {
      category: 'Access Control',
      measures: [
        'Multi-factor authentication for admin accounts',
        'Role-based access control system',
        'Regular access reviews and updates',
        'Secure session management',
      ],
    },
    {
      category: 'Network Security',
      measures: [
        'HTTPS encryption for all communications',
        'Firewall protection and intrusion detection',
        'Regular security updates and patches',
        'DDoS protection and traffic monitoring',
      ],
    },
    {
      category: 'User Safety',
      measures: [
        'Report and block functionality for inappropriate content',
        'Moderation of all user-generated content',
        'Secure communication channels between users',
        'Privacy controls for personal information',
      ],
    },
  ];

  const incidentResponse = [
    {
      step: '1',
      title: 'Detection',
      description: 'Automated monitoring detects potential security issues',
      icon: <WarningIcon />,
    },
    {
      step: '2',
      title: 'Assessment',
      description: 'Security team evaluates the severity and impact',
      icon: <InfoIcon />,
    },
    {
      step: '3',
      title: 'Response',
      description: 'Immediate action taken to contain and resolve the issue',
      icon: <SecurityIcon />,
    },
    {
      step: '4',
      title: 'Recovery',
      description: 'System restored and security measures strengthened',
      icon: <CheckIcon />,
    },
  ];

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
            Secure Platform
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
            Your data and privacy are protected with enterprise-grade security measures
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Security Overview */}
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 4 }}>
            Security Features
          </Typography>
          <Typography variant="h6" sx={{ color: '#666', maxWidth: '800px', mx: 'auto', lineHeight: 1.6, mb: 6 }}>
            Our platform implements multiple layers of security to protect your personal information and ensure a safe environment for the UWE community.
          </Typography>
          
          <Grid container spacing={4}>
            {securityFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {feature.details}
                    </Typography>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Compliance Standards */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Compliance & Certifications
          </Typography>
          <Grid container spacing={3}>
            {complianceStandards.map((standard, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Slide direction="up" in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                      },
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      <ShieldIcon sx={{ fontSize: 48, color: `${standard.color}.main` }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {standard.standard}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {standard.description}
                    </Typography>
                    <Chip
                      label={standard.status}
                      color={standard.color}
                      variant="filled"
                      size="small"
                    />
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Security Measures */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Security Measures
          </Typography>
          <Grid container spacing={4}>
            {securityMeasures.map((category, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
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
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SecurityIcon color="primary" />
                      {category.category}
                    </Typography>
                    <List dense>
                      {category.measures.map((measure, measureIndex) => (
                        <ListItem key={measureIndex} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <CheckIcon color="success" />
                          </ListItemIcon>
                          <ListItemText primary={measure} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Incident Response */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Incident Response Process
          </Typography>
          <Grid container spacing={4}>
            {incidentResponse.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: 'white',
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {step.step}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Security FAQ
          </Typography>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {[
              {
                question: 'How is my personal information protected?',
                answer: 'All personal information is encrypted using AES-256 encryption and stored in secure, access-controlled databases. We follow strict data protection protocols and never share your information without explicit consent.',
              },
              {
                question: 'Who has access to my data?',
                answer: 'Only authorized UWE staff members with specific security clearance can access user data, and only when necessary for platform operation or legal compliance. All access is logged and monitored.',
              },
              {
                question: 'What happens if there\'s a security breach?',
                answer: 'We have a comprehensive incident response plan. Users will be notified within 24 hours of any confirmed breach, and we work with cybersecurity experts to contain and resolve the issue immediately.',
              },
              {
                question: 'How often is the platform security tested?',
                answer: 'We conduct regular security audits, penetration testing, and vulnerability assessments. Our security team also monitors the platform 24/7 for any suspicious activity.',
              },
              {
                question: 'Can I delete my data from the platform?',
                answer: 'Yes, you have full control over your data. You can request data deletion at any time, and we will remove your information within 30 days, except where required by law.',
              },
            ].map((faq, index) => (
              <Accordion 
                key={index} 
                expanded={expandedAccordion === `panel${index}`}
                onChange={handleAccordionChange(`panel${index}`)}
                sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}
              >
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

        {/* Contact Security Team */}
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
            Security Concerns?
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: '600px', mx: 'auto' }}>
            If you have any security concerns or notice suspicious activity, please contact our security team immediately.
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

export default SecurePlatform;
