import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  ContactSupport as SupportIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from '@mui/icons-material';

const FAQ: React.FC = () => {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleEmailButtonClick = () => {
    setEmailDialogOpen(true);
  };

  const handleEmailDialogClose = () => {
    setEmailDialogOpen(false);
    setEmailForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleEmailFormChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleEmailSubmit = () => {
    if (!emailForm.name || !emailForm.email || !emailForm.subject || !emailForm.message) {
      setSnackbarMessage('Please fill in all fields');
      setSnackbarOpen(true);
      return;
    }

    // Create mailto link
    const mailtoLink = `mailto:security@uwe.ac.uk?subject=${encodeURIComponent(emailForm.subject)}&body=${encodeURIComponent(
      `Name: ${emailForm.name}\nEmail: ${emailForm.email}\n\nMessage:\n${emailForm.message}`
    )}`;
    
    // Open email client
    window.open(mailtoLink);
    
    setSnackbarMessage('Email client opened successfully');
    setSnackbarOpen(true);
    handleEmailDialogClose();
  };

  const faqCategories = [
    {
      title: 'General Questions',
      icon: <QuestionAnswerIcon />,
      color: '#1976d2',
      faqs: [
        {
          question: 'What is the UWE Lost & Found Portal?',
          answer: 'The UWE Lost & Found Portal is a digital platform designed to help students and staff recover lost items and return found belongings to their rightful owners. It connects our community through a secure, efficient system.',
        },
        {
          question: 'Who can use the Lost & Found service?',
          answer: 'The service is available to all UWE students, staff, and faculty members. You need a valid UWE email address to register and use the platform.',
        },
        {
          question: 'Is there a cost to use the service?',
          answer: 'No, the Lost & Found service is completely free for all UWE community members. There are no hidden fees or charges.',
        },
        {
          question: 'How secure is my personal information?',
          answer: 'We take privacy and security seriously. All personal information is encrypted and stored securely. We only share necessary information to facilitate item recovery.',
        },
      ],
    },
    {
      title: 'Reporting Items',
      icon: <HelpIcon />,
      color: '#4CAF50',
      faqs: [
        {
          question: 'How do I report a lost item?',
          answer: 'Click on "Lost Something?" button, fill out the form with detailed description, location where it was lost, date/time, and upload photos if available. The more details you provide, the better the chances of recovery.',
        },
        {
          question: 'What information should I include when reporting?',
          answer: 'Include a detailed description, specific location where it was lost, approximate date and time, any identifying features, brand/model if applicable, and photos if possible.',
        },
        {
          question: 'Can I report items lost outside of campus?',
          answer: 'Yes, you can report items lost anywhere, but our collection points are only available at UWE campus locations. Items found off-campus can still be reported and matched.',
        },
        {
          question: 'How do I report a found item?',
          answer: 'Click on "Found Something?" button, provide details about the item, location where it was found, and upload photos. Our system will try to match it with reported lost items.',
        },
      ],
    },
    {
      title: 'Collection & Recovery',
      icon: <SupportIcon />,
      color: '#FF9800',
      faqs: [
        {
          question: 'How do I claim a found item?',
          answer: 'When a match is found, you will be notified via email. Contact the campus security office where the item is stored, bring valid ID and proof of ownership to collect your item.',
        },
        {
          question: 'What ID do I need to collect an item?',
          answer: 'You need a valid UWE student/staff ID and may be asked to provide additional proof of ownership, such as describing unique features or providing purchase receipts.',
        },
        {
          question: 'How long are items kept before disposal?',
          answer: 'Items are held for 3 months before being disposed of or donated to charity. Valuable items may be held longer for additional verification.',
        },
        {
          question: 'Where are items stored?',
          answer: 'Items are securely stored at campus security offices. Each campus has a designated storage area with 24/7 security monitoring.',
        },
      ],
    },
  ];

  const quickHelpTopics = [
    {
      title: 'Need Immediate Help?',
      description: 'Contact campus security directly for urgent matters',
      action: 'Call Security',
      phone: '0117 32 86333',
      icon: <PhoneIcon />,
    },
    {
      title: 'Technical Support',
      description: 'Having trouble with the website or app?',
      action: 'Email Support',
      email: 'security@uwe.ac.uk',
      icon: <EmailIcon />,
    },
    {
      title: 'General Inquiries',
      description: 'Questions about policies or procedures',
      action: 'Contact Us',
      email: 'lostfound@uwe.ac.uk',
      icon: <SupportIcon />,
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
            Frequently Asked Questions
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
            Find answers to common questions about our Lost & Found service
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Quick Help Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Quick Help
          </Typography>
          <Grid container spacing={4}>
            {quickHelpTopics.map((topic, index) => (
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
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      bgcolor: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      color: 'white',
                    }}
                  >
                    {topic.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                    {topic.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
                    {topic.description}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: '#1976d2',
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      },
                    }}
                  >
                    {topic.action}
                  </Button>
                  {(topic.phone || topic.email) && (
                    <Typography variant="body2" sx={{ color: '#666', mt: 2 }}>
                      {topic.phone || topic.email}
                    </Typography>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Categories */}
        {faqCategories.map((category, categoryIndex) => (
          <Box key={categoryIndex} sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: category.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 3,
                  color: 'white',
                }}
              >
                {category.icon}
              </Box>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 700, color: '#333' }}>
                {category.title}
              </Typography>
            </Box>

            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              {category.faqs.map((faq, faqIndex) => (
                <Accordion 
                  key={faqIndex} 
                  sx={{ 
                    mb: 2, 
                    borderRadius: 3, 
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                    '&:before': {
                      display: 'none',
                    },
                    '&.Mui-expanded': {
                      margin: '0 0 16px 0',
                    },
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      borderRadius: 3,
                      '&.Mui-expanded': {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>
        ))}

        {/* Contact CTA Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            p: 6,
            textAlign: 'center',
            color: 'white',
            mt: 8,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Still Have Questions?
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Our support team is here to help you with any questions not covered in our FAQ section.
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
              Call: 0117 32 86333
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<EmailIcon />}
              onClick={handleEmailButtonClick}
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

      {/* Email Dialog */}
      <Dialog 
        open={emailDialogOpen} 
        onClose={handleEmailDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          py: 3,
          fontSize: '1.5rem',
          fontWeight: 700,
        }}>
          <EmailIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Contact UWE Security
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="body1" sx={{ mb: 3, color: '#666', textAlign: 'center' }}>
            Fill out the form below and we'll open your email client to send your message to our security team.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Name"
                value={emailForm.name}
                onChange={handleEmailFormChange('name')}
                variant="outlined"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Email"
                type="email"
                value={emailForm.email}
                onChange={handleEmailFormChange('email')}
                variant="outlined"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={emailForm.subject}
                onChange={handleEmailFormChange('subject')}
                variant="outlined"
                required
                placeholder="e.g., FAQ Question - Lost Item Policy"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                value={emailForm.message}
                onChange={handleEmailFormChange('message')}
                variant="outlined"
                multiline
                rows={6}
                required
                placeholder="Please provide details about your question or inquiry..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleEmailDialogClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEmailSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              px: 4,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
          >
            <EmailIcon sx={{ mr: 1 }} />
            Open Email Client
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarMessage.includes('successfully') ? 'success' : 'warning'}
          sx={{ borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FAQ;
