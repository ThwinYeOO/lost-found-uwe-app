import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Avatar,
  Divider,
  Fade,
  Slide,
  Zoom,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Send as SendIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Support as SupportIcon,
  Chat as ChatIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Subject as SubjectIcon,
  Message as MessageIcon,
  AttachFile as AttachFileIcon,
  Flag as PriorityIcon,
  ExpandMore as ExpandMoreIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Help as HelpIcon,
  QuestionAnswer as QuestionAnswerIcon,
  ContactSupport as ContactSupportIcon,
  Schedule as ScheduleIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';

const ContactUs = () => {
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you within 24 hours.' });
    setFormData({ name: '', email: '', subject: '', message: '', inquiryType: 'general' });
    setIsSubmitting(false);
  };

  const faqData = [
    {
      question: "How quickly will I receive a response?",
      answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our support line directly."
    },
    {
      question: "Can I report a lost item through this contact form?",
      answer: "Yes! You can use the 'Lost Item Report' inquiry type to report lost items. We'll help you create a proper listing and notify the community."
    },
    {
      question: "What information should I include in my message?",
      answer: "Please include as much detail as possible about your inquiry, including any relevant dates, locations, or specific questions you have."
    },
    {
      question: "Is there a phone number I can call?",
      answer: "Yes! You can reach us at +44 (0) 117 32 81000 during business hours (9 AM - 5 PM, Monday to Friday)."
    },
    {
      question: "Can I visit the office in person?",
      answer: "Absolutely! Our office is located at Frenchay Campus, Coldharbour Lane, Bristol BS16 1QY. We're open Monday to Friday, 9 AM - 5 PM."
    }
  ];

  const contactMethods = [
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Phone Support",
      description: "For immediate assistance",
      details: "+44 (0) 117 32 81000",
      action: "Call Now",
      color: "primary"
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: "Email Support",
      description: "Send us a detailed message",
      details: "support@uwe.ac.uk",
      action: "Email Us",
      color: "secondary"
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: "Visit Us",
      description: "Come to our office",
      details: "Frenchay Campus, Bristol",
      action: "Get Directions",
      color: "success"
    },
    {
      icon: <ChatIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: "Live Chat",
      description: "Chat with our team",
      details: "Available 9 AM - 5 PM",
      action: "Start Chat",
      color: "warning"
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box textAlign="center">
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                Get in Touch
              </Typography>
              <Typography 
                variant="h5" 
                color="text.secondary" 
                paragraph
                sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
              >
                We're here to help! Whether you've lost something, found something, or just have questions about our platform.
              </Typography>
              <Chip
                icon={<SupportIcon />}
                label="24/7 Support Available"
                color="primary"
                variant="outlined"
                sx={{ fontSize: '1rem', py: 2, px: 1 }}
              />
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Contact Methods */}
        <Box mb={8}>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, fontWeight: 600 }}>
            Choose Your Preferred Contact Method
          </Typography>
          <Grid container spacing={3}>
            {contactMethods.map((method, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Slide direction="up" in timeout={800 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[8],
                      },
                      border: `2px solid ${alpha(theme.palette[method.color].main, 0.1)}`,
                    }}
                  >
                    <CardContent>
                      <Box mb={2}>
                        {method.icon}
                      </Box>
                      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                        {method.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {method.description}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                        {method.details}
                      </Typography>
                      <Button
                        variant="outlined"
                        color={method.color}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        {method.action}
                      </Button>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Form */}
        <Box mb={8}>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, fontWeight: 600 }}>
            Send Us a Message
          </Typography>
          
          {status.message && (
            <Fade in>
              <Alert 
                severity={status.type} 
                sx={{ mb: 4, borderRadius: 2 }}
                action={
                  <IconButton
                    size="small"
                    onClick={() => setStatus({ type: '', message: '' })}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
              >
                {status.message}
              </Alert>
            </Fade>
          )}

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 4, borderRadius: 3, boxShadow: theme.shadows[4] }}>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Inquiry Type</InputLabel>
                        <Select
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleChange}
                          label="Inquiry Type"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        >
                          <MenuItem value="general">General Inquiry</MenuItem>
                          <MenuItem value="lost">Lost Item Report</MenuItem>
                          <MenuItem value="found">Found Item Report</MenuItem>
                          <MenuItem value="technical">Technical Support</MenuItem>
                          <MenuItem value="feedback">Feedback</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SubjectIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Please provide as much detail as possible about your inquiry..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                              <MessageIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                        sx={{ 
                          py: 1.5, 
                          borderRadius: 2,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                          }
                        }}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>

            {/* Contact Info Sidebar */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Card sx={{ p: 3, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <TimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Business Hours
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Monday - Friday" 
                        secondary="9:00 AM - 5:00 PM"
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Saturday" 
                        secondary="10:00 AM - 2:00 PM"
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Sunday" 
                        secondary="Closed"
                      />
                    </ListItem>
                  </List>
                </Card>

                <Card sx={{ p: 3, borderRadius: 3, bgcolor: alpha(theme.palette.secondary.main, 0.05) }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ mr: 1, color: 'secondary.main' }} />
                    Our Location
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    University of the West of England
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Frenchay Campus<br />
                    Coldharbour Lane<br />
                    Bristol BS16 1QY<br />
                    United Kingdom
                  </Typography>
                </Card>

                <Card sx={{ p: 3, borderRadius: 3, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <SecurityIcon sx={{ mr: 1, color: 'success.main' }} />
                    Quick Response
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    We typically respond to all inquiries within 24 hours during business days.
                  </Typography>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Average Response: 4 hours"
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Box>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, fontWeight: 600 }}>
            Frequently Asked Questions
          </Typography>
          <Grid container spacing={2}>
            {faqData.map((faq, index) => (
              <Grid item xs={12} key={index}>
                <Accordion 
                  sx={{ 
                    borderRadius: 2,
                    boxShadow: theme.shadows[2],
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                      margin: 0,
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ 
                      borderRadius: 2,
                      '&.Mui-expanded': {
                        minHeight: 'auto',
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactUs; 