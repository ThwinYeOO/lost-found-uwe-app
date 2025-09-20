import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Fade,
  Slide,
  Badge,
} from '@mui/material';
import {
  Support as SupportIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Subject as SubjectIcon,
  Message as MessageIcon,
  Flag as PriorityIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
  QuestionAnswer as QuestionAnswerIcon,
  ContactSupport as ContactSupportIcon,
  LiveHelp as LiveHelpIcon,
} from '@mui/icons-material';

const Support24x7: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    priority: 'medium',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const supportMethods = [
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Phone Support',
      description: 'Call our dedicated support line',
      availability: '24/7',
      contact: '+44 (0) 117 32 86333',
      responseTime: 'Immediate',
      color: 'primary',
      isAvailable: true,
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: '24/7',
      contact: 'support@uwe.ac.uk',
      responseTime: 'Within 2 hours',
      color: 'secondary',
      isAvailable: true,
    },
    {
      icon: <ChatIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Live Chat',
      description: 'Chat with our support team',
      availability: '9 AM - 5 PM',
      contact: 'Start Chat',
      responseTime: 'Immediate',
      color: 'success',
      isAvailable: true,
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Campus Visit',
      description: 'Visit our support office',
      availability: '9 AM - 5 PM',
      contact: 'Frenchay Campus',
      responseTime: 'Immediate',
      color: 'warning',
      isAvailable: false,
    },
  ];

  const supportTopics = [
    {
      category: 'Technical Issues',
      icon: <SupportIcon />,
      color: 'primary',
      issues: [
        'Website not loading properly',
        'Login problems',
        'Upload issues',
        'Search not working',
        'Mobile app problems',
      ],
    },
    {
      category: 'Account & Profile',
      icon: <PersonIcon />,
      color: 'secondary',
      issues: [
        'Account verification',
        'Profile updates',
        'Password reset',
        'Email changes',
        'Account deletion',
      ],
    },
    {
      category: 'Lost & Found',
      icon: <SchoolIcon />,
      color: 'success',
      issues: [
        'Reporting lost items',
        'Claiming found items',
        'Item verification',
        'Collection process',
        'Item status updates',
      ],
    },
    {
      category: 'Security & Privacy',
      icon: <SecurityIcon />,
      color: 'warning',
      issues: [
        'Privacy concerns',
        'Data protection',
        'Suspicious activity',
        'Account security',
        'Report abuse',
      ],
    },
  ];

  const faqData = [
    {
      question: 'What are your support hours?',
      answer: 'We provide 24/7 support through phone and email. Live chat is available Monday to Friday, 9 AM to 5 PM. Campus visits are available during business hours.',
    },
    {
      question: 'How quickly will I get a response?',
      answer: 'Phone support provides immediate assistance. Email responses typically come within 2 hours. Live chat responses are immediate during business hours.',
    },
    {
      question: 'Can I get help with technical issues?',
      answer: 'Yes, our technical support team can help with website issues, login problems, upload difficulties, and any other technical concerns you may have.',
    },
    {
      question: 'Is there a charge for support?',
      answer: 'No, all support services are completely free for UWE students and staff members.',
    },
    {
      question: 'What information should I provide when contacting support?',
      answer: 'Please provide your name, UWE email address, a detailed description of the issue, and any error messages you may have encountered.',
    },
    {
      question: 'Can I schedule a callback?',
      answer: 'Yes, you can request a callback through our contact form. We will call you back within 2 hours during business hours.',
    },
  ];

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    if (method === 'email' || method === 'chat') {
      setShowContactForm(true);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowContactForm(false);
    setShowSuccessDialog(true);
    setFormData({ name: '', email: '', subject: '', priority: 'medium', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
            24/7 Support
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
            Always here to help - Get support whenever you need it
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Support Methods */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Choose Your Support Method
          </Typography>
          <Grid container spacing={4}>
            {supportMethods.map((method, index) => (
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
                      cursor: method.isAvailable ? 'pointer' : 'not-allowed',
                      opacity: method.isAvailable ? 1 : 0.6,
                      '&:hover': method.isAvailable ? {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
                      } : {},
                    }}
                    onClick={() => method.isAvailable && handleMethodSelect(method.title.toLowerCase().replace(' ', ''))}
                  >
                    <Box sx={{ mb: 2 }}>
                      {method.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {method.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {method.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={method.availability}
                        color={method.color as any}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {method.contact}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Response: {method.responseTime}
                    </Typography>
                    {!method.isAvailable && (
                      <Chip
                        label="Currently Unavailable"
                        color="default"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Support Topics */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Common Support Topics
          </Typography>
          <Grid container spacing={4}>
            {supportTopics.map((topic, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Slide direction="up" in timeout={300 + index * 100}>
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
                        <Box sx={{ color: `${topic.color}.main` }}>
                          {topic.icon}
                        </Box>
                        {topic.category}
                      </Typography>
                      <List dense>
                        {topic.issues.map((issue, issueIndex) => (
                          <ListItem key={issueIndex} sx={{ px: 0 }}>
                            <ListItemIcon>
                              <CheckIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary={issue} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Slide>
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
            {faqData.map((faq, index) => (
              <Accordion 
                key={index} 
                sx={{ 
                  mb: 2, 
                  borderRadius: 2, 
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  '&:before': { display: 'none' },
                }}
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

        {/* Contact Form Dialog */}
        <Dialog open={showContactForm} onClose={() => setShowContactForm(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ContactSupportIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Contact Support
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleFormSubmit} sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <SubjectIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      label="Priority"
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="urgent">Urgent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                    placeholder="Please describe your issue in detail..."
                    InputProps={{
                      startAdornment: <MessageIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setShowContactForm(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleFormSubmit}
              disabled={isSubmitting}
              startIcon={isSubmitting ? <LinearProgress /> : <SendIcon />}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: 'center' }}>
            <CheckIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Message Sent Successfully!
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              Your support request has been submitted and our team will respond within 2 hours.
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              For urgent issues, please call our support line at +44 (0) 117 32 86333
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              variant="contained"
              onClick={() => setShowSuccessDialog(false)}
              sx={{ px: 4 }}
            >
              Continue
            </Button>
          </DialogActions>
        </Dialog>

        {/* Emergency Contact */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
            borderRadius: 4,
            p: 6,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Emergency Support
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: '600px', mx: 'auto' }}>
            For urgent security issues or immediate assistance, contact our emergency support line.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<PhoneIcon />}
            sx={{
              backgroundColor: 'white',
              color: '#f44336',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 700,
              borderRadius: 3,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Emergency: +44 (0) 117 32 86333
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Support24x7;
