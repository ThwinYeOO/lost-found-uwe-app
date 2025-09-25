import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Fade,
  Slide,
  Badge,
} from '@mui/material';
import {
  VerifiedUser as VerifiedIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Policy as PolicyIcon,
  Gavel as GavelIcon,
  ContactSupport as SupportIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  Shield as ShieldIcon,
  AdminPanelSettings as AdminIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

const VerifiedUsers: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationData, setVerificationData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    phone: '',
    department: '',
    yearOfStudy: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const verificationSteps = [
    'Provide UWE Details',
    'Upload Documents',
    'Identity Verification',
    'Account Review',
    'Verification Complete',
  ];

  const verificationBenefits = [
    {
      icon: <ShieldIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Enhanced Security',
      description: 'Verified users have additional security features and priority support',
      details: 'Your account is protected with advanced security measures and you get priority assistance.',
    },
    {
      icon: <StarIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Priority Features',
      description: 'Access to exclusive features and early access to new functionality',
      details: 'Get first access to new features, priority in search results, and exclusive tools.',
    },
    {
      icon: <CheckIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Trusted Status',
      description: 'Build trust with other users through verified status',
      details: 'Other users can see your verified status, increasing trust in transactions.',
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Priority Support',
      description: 'Get faster response times and dedicated support channels',
      details: 'Verified users receive priority support with faster response times.',
    },
  ];

  const verificationRequirements = [
    {
      category: 'Identity Documents',
      items: [
        'Valid UWE Student/Staff ID',
        'Government-issued photo ID',
        'Proof of enrollment/employment',
      ],
    },
    {
      category: 'Contact Information',
      items: [
        'UWE email address verification',
        'Valid phone number',
        'Current address confirmation',
      ],
    },
    {
      category: 'Account Information',
      items: [
        'Complete profile information',
        'Profile photo upload',
        'Academic/Department details',
      ],
    },
  ];

  const verificationProcess = [
    {
      step: '1',
      title: 'Submit Information',
      description: 'Provide your UWE details and contact information',
      icon: <PersonIcon />,
      color: 'primary',
    },
    {
      step: '2',
      title: 'Upload Documents',
      description: 'Upload required identification documents',
      icon: <PolicyIcon />,
      color: 'secondary',
    },
    {
      step: '3',
      title: 'Identity Check',
      description: 'Our team verifies your identity and documents',
      icon: <SecurityIcon />,
      color: 'warning',
    },
    {
      step: '4',
      title: 'Account Review',
      description: 'Final review and approval of your verification',
      icon: <AdminIcon />,
      color: 'info',
    },
    {
      step: '5',
      title: 'Verification Complete',
      description: 'You receive verified status and benefits',
      icon: <CheckIcon />,
      color: 'success',
    },
  ];

  const faqData = [
    {
      question: 'How long does verification take?',
      answer: 'Verification typically takes 1-3 business days. During peak periods, it may take up to 5 business days.',
    },
    {
      question: 'What documents do I need?',
      answer: 'You need a valid UWE Student/Staff ID, government-issued photo ID, and proof of enrollment or employment.',
    },
    {
      question: 'Is verification free?',
      answer: 'Yes, verification is completely free for all UWE students and staff members.',
    },
    {
      question: 'What if my verification is rejected?',
      answer: 'If verification is rejected, you will receive an email explaining the reason and steps to resubmit.',
    },
    {
      question: 'Can I update my verified information?',
      answer: 'Yes, you can update your information at any time. Some changes may require re-verification.',
    },
    {
      question: 'What happens if I lose my verified status?',
      answer: 'Verified status can be revoked for policy violations. You can reapply after addressing the issues.',
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleVerificationSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Get current user from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('User not logged in');
      }
      const currentUser = JSON.parse(storedUser);
      
      // Create verification request data
      const verificationRequest = {
        userId: currentUser.id,
        studentId: verificationData.studentId,
        fullName: verificationData.fullName,
        email: verificationData.email,
        phone: verificationData.phone,
        department: verificationData.department,
        yearOfStudy: verificationData.yearOfStudy,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        requestId: `VERIFY-${Date.now()}`,
      };

      // Here you would typically send to your backend API
      console.log('Verification request submitted:', verificationRequest);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowVerificationDialog(false);
      setShowSuccessDialog(true);
      
      // Reset form
      setVerificationData({
        studentId: '',
        fullName: '',
        email: '',
        phone: '',
        department: '',
        yearOfStudy: '',
      });
    } catch (error) {
      console.error('Error submitting verification request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setVerificationData(prev => ({ ...prev, [field]: value }));
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
            Verified Users
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
            Join our trusted community of verified UWE students and staff
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Verification Benefits */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Benefits of Verification
          </Typography>
          <Grid container spacing={4}>
            {verificationBenefits.map((benefit, index) => (
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
                      {benefit.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {benefit.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {benefit.details}
                    </Typography>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Verification Process */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Verification Process
          </Typography>
          <Grid container spacing={4}>
            {verificationProcess.map((step, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <Slide direction="up" in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
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
                        bgcolor: `${step.color}.main`,
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
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Verification Requirements */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Verification Requirements
          </Typography>
          <Grid container spacing={4}>
            {verificationRequirements.map((category, index) => (
              <Grid item xs={12} md={4} key={index}>
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
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                      {category.category}
                    </Typography>
                    <List dense>
                      {category.items.map((item, itemIndex) => (
                        <ListItem key={itemIndex} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <CheckIcon color="success" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Get Verified CTA */}
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Paper
            elevation={3}
            sx={{
              p: 6,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)',
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
              Ready to Get Verified?
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, maxWidth: '600px', mx: 'auto' }}>
              Join thousands of verified UWE students and staff who trust our platform for their lost and found needs.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<VerifiedIcon />}
              onClick={() => setShowVerificationDialog(true)}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #7b1fa2)',
                },
              }}
            >
              Start Verification Process
            </Button>
          </Paper>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 6 }}>
            Verification FAQ
          </Typography>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {faqData.map((faq, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                  {faq.question}
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Verification Dialog */}
        <Dialog open={showVerificationDialog} onClose={() => setShowVerificationDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VerifiedIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Start Verification Process
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {verificationSteps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      {index === 0 && (
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Provide Your UWE Details
                          </Typography>
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Student/Staff ID"
                                value={verificationData.studentId}
                                onChange={(e) => handleInputChange('studentId', e.target.value)}
                                required
                                placeholder="e.g., 12345678"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Full Name"
                                value={verificationData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                required
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="UWE Email"
                                type="email"
                                value={verificationData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                required
                                placeholder="your.name@uwe.ac.uk"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Phone Number"
                                value={verificationData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="+44 7xxx xxx xxx"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <InputLabel>Department</InputLabel>
                                <Select
                                  value={verificationData.department}
                                  onChange={(e) => handleInputChange('department', e.target.value)}
                                  label="Department"
                                >
                                  <MenuItem value="computing">Computing</MenuItem>
                                  <MenuItem value="business">Business</MenuItem>
                                  <MenuItem value="engineering">Engineering</MenuItem>
                                  <MenuItem value="health">Health</MenuItem>
                                  <MenuItem value="arts">Arts</MenuItem>
                                  <MenuItem value="other">Other</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <InputLabel>Year of Study</InputLabel>
                                <Select
                                  value={verificationData.yearOfStudy}
                                  onChange={(e) => handleInputChange('yearOfStudy', e.target.value)}
                                  label="Year of Study"
                                >
                                  <MenuItem value="1">Year 1</MenuItem>
                                  <MenuItem value="2">Year 2</MenuItem>
                                  <MenuItem value="3">Year 3</MenuItem>
                                  <MenuItem value="4">Year 4</MenuItem>
                                  <MenuItem value="postgrad">Postgraduate</MenuItem>
                                  <MenuItem value="staff">Staff</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                      {index === 1 && (
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Upload Required Documents
                          </Typography>
                          <Alert severity="info" sx={{ mb: 3 }}>
                            Please upload clear photos of your UWE ID and government-issued photo ID.
                          </Alert>
                          <Box
                            sx={{
                              border: '2px dashed',
                              borderColor: 'primary.main',
                              borderRadius: 2,
                              p: 4,
                              textAlign: 'center',
                              bgcolor: 'rgba(33, 150, 243, 0.05)',
                            }}
                          >
                            <Typography variant="body1" sx={{ mb: 2 }}>
                              Drag and drop files here or click to browse
                            </Typography>
                            <Button variant="outlined" startIcon={<EditIcon />}>
                              Upload Documents
                            </Button>
                          </Box>
                        </Box>
                      )}
                      {index === 2 && (
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Identity Verification
                          </Typography>
                          <Alert severity="warning" sx={{ mb: 3 }}>
                            Our team will review your documents and verify your identity. This process typically takes 1-3 business days.
                          </Alert>
                          <Typography variant="body1">
                            You will receive an email confirmation once your verification is complete.
                          </Typography>
                        </Box>
                      )}
                      {index === 3 && (
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Account Review
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            Our team will perform a final review of your account and documents.
                          </Typography>
                          <Typography variant="body1">
                            Once approved, you will receive verified status and access to all verified user benefits.
                          </Typography>
                        </Box>
                      )}
                      {index === 4 && (
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Verification Complete
                          </Typography>
                          <Alert severity="success" sx={{ mb: 3 }}>
                            Congratulations! Your account has been verified. You now have access to all verified user benefits.
                          </Alert>
                          <Typography variant="body1">
                            You can now enjoy enhanced security, priority features, and trusted status on the platform.
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                          disabled={activeStep === 0}
                          onClick={handleBack}
                        >
                          Back
                        </Button>
                        <Box>
                          {activeStep === verificationSteps.length - 1 ? (
                            <Button
                              variant="contained"
                              onClick={handleVerificationSubmit}
                              disabled={isSubmitting}
                              startIcon={isSubmitting ? <LinearProgress /> : <CheckIcon />}
                            >
                              {isSubmitting ? 'Submitting...' : 'Submit Verification'}
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              onClick={handleNext}
                            >
                              Next
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: 'center' }}>
            <CheckIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Verification Request Submitted!
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              Your verification request has been submitted and is under review.
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              You will receive an email confirmation within 1-3 business days with the verification result.
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
      </Container>
    </Box>
  );
};

export default VerifiedUsers;
