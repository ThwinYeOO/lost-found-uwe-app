import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Fade,
  Slide,
} from '@mui/material';
import { addItem } from '../services/firestore';
import { Item } from '../types';
import {
  Add as AddIcon,
  PhotoCamera as CameraIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  ContactPhone as ContactIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface ReportData {
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  time: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  images: File[];
  additionalInfo: string;
}

const EasyReport: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [reportData, setReportData] = useState<ReportData>({
    type: 'lost',
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    time: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
    },
    images: [],
    additionalInfo: '',
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Accessories' },
    { value: 'books', label: 'Books & Stationery' },
    { value: 'jewelry', label: 'Jewelry & Watches' },
    { value: 'bags', label: 'Bags & Backpacks' },
    { value: 'keys', label: 'Keys & ID Cards' },
    { value: 'sports', label: 'Sports Equipment' },
    { value: 'other', label: 'Other Items' },
  ];

  const locations = [
    'Frenchay Campus - Library',
    'Frenchay Campus - Main Building',
    'Frenchay Campus - Cafeteria',
    'Frenchay Campus - Sports Center',
    'Glenside Campus - Main Building',
    'Glenside Campus - Library',
    'City Campus - Main Building',
    'City Campus - Library',
    'Bower Ashton Campus - Main Building',
    'Other Location',
  ];

  const steps = [
    'Report Type',
    'Item Details',
    'Location & Time',
    'Contact Information',
    'Additional Details',
    'Review & Submit',
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setReportData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ReportData] as any),
          [child]: value,
        },
      }));
    } else {
      setReportData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setReportData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5), // Max 5 images
    }));
  };

  const handleRemoveImage = (index: number) => {
    setReportData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Get current user from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert('You need to login to report items. Redirecting to login page...');
        navigate('/login');
        return;
      }
      const currentUser = JSON.parse(storedUser);

      // Create item data for database
      const itemData: Omit<Item, 'id'> = {
        name: reportData.title,
        description: reportData.description,
        type: reportData.type === 'lost' ? 'Lost' : 'Found', // Use proper case for backend
        status: reportData.type === 'lost' ? 'Lost' : 'Found', // Use proper case for backend
        locationLostFound: reportData.location,
        dateLostFound: new Date(`${reportData.date}T${reportData.time}`),
        phoneNumber: reportData.contactInfo.phone,
        reportUserId: currentUser.id,
        reportName: currentUser.name,
        imageUrl: reportData.images.length > 0 ? URL.createObjectURL(reportData.images[0]) : '',
      };

      // Submit to database
      await addItem(itemData);
      
      setIsSubmitting(false);
      setShowSuccessDialog(true);
      
      // Reset form
      setReportData({
        type: 'lost',
        title: '',
        description: '',
        category: '',
        location: '',
        date: '',
        time: '',
        contactInfo: {
          name: '',
          email: '',
          phone: '',
        },
        images: [],
        additionalInfo: '',
      });
      setActiveStep(0);
    } catch (error) {
      console.error('Error submitting report:', error);
      setIsSubmitting(false);
      // You could add error handling here, like showing an error message
      alert('Failed to submit report. Please try again.');
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              What would you like to report?
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: reportData.type === 'lost' ? '2px solid' : '1px solid',
                    borderColor: reportData.type === 'lost' ? 'primary.main' : 'divider',
                    bgcolor: reportData.type === 'lost' ? 'rgba(33, 150, 243, 0.05)' : 'background.paper',
                  }}
                  onClick={() => handleInputChange('type', 'lost')}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <WarningIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Lost Item
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Report an item you've lost and need help finding
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: reportData.type === 'found' ? '2px solid' : '1px solid',
                    borderColor: reportData.type === 'found' ? 'primary.main' : 'divider',
                    bgcolor: reportData.type === 'found' ? 'rgba(33, 150, 243, 0.05)' : 'background.paper',
                  }}
                  onClick={() => handleInputChange('type', 'found')}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <CheckIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Found Item
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Report an item you've found and want to return
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Tell us about the item
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Item Title"
                  value={reportData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., iPhone 13 Pro, Blue Backpack"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={reportData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Brand/Model (if applicable)"
                  value={reportData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  placeholder="e.g., Apple, Samsung, Nike"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Detailed Description"
                  multiline
                  rows={4}
                  value={reportData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description of the item, including any unique features, colors, or identifying marks..."
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              When and where?
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={reportData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    label="Location"
                  >
                    {locations.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={reportData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  value={reportData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              How can we contact you?
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={reportData.contactInfo.name}
                  onChange={(e) => handleInputChange('contactInfo.name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={reportData.contactInfo.email}
                  onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={reportData.contactInfo.phone}
                  onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                  placeholder="+44 7xxx xxx xxx"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Add photos and additional information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'rgba(33, 150, 243, 0.05)',
                  }}
                >
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<UploadIcon />}
                      sx={{ mb: 2 }}
                    >
                      Upload Photos
                    </Button>
                  </label>
                  <Typography variant="body2" color="text.secondary">
                    Upload up to 5 photos (JPG, PNG, max 5MB each)
                  </Typography>
                </Box>
              </Grid>
              
              {reportData.images.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Uploaded Photos ({reportData.images.length}/5):
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {reportData.images.map((image, index) => (
                      <Paper
                        key={index}
                        elevation={2}
                        sx={{
                          position: 'relative',
                          p: 1,
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 100,
                            height: 100,
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CameraIcon color="disabled" />
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'rgba(0,0,0,0.7)',
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        );

      case 5:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review your report
            </Typography>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Report Type
                  </Typography>
                  <Chip
                    label={reportData.type === 'lost' ? 'Lost Item' : 'Found Item'}
                    color={reportData.type === 'lost' ? 'warning' : 'success'}
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">
                    {categories.find(c => c.value === reportData.category)?.label}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Title
                  </Typography>
                  <Typography variant="body1">{reportData.title}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">{reportData.description}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">{reportData.location}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1">
                    {new Date(reportData.date).toLocaleDateString()} at {reportData.time}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact Information
                  </Typography>
                  <Typography variant="body1">
                    {reportData.contactInfo.name} - {reportData.contactInfo.email}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                By submitting this report, you agree to our terms of service and privacy policy. 
                Your contact information will be shared with potential matches.
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return 'Unknown step';
    }
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
            Easy Report
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
            Report lost or found items in just a few simple steps
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 6 }, px: { xs: 1, sm: 2, md: 4 } }}>
        <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2, md: 4 }, borderRadius: { xs: 2, md: 3 } }}>
          <Stepper 
            activeStep={activeStep} 
            orientation="vertical"
            sx={{
              '& .MuiStepLabel-root': {
                padding: { xs: '8px 0', md: '16px 0' },
              },
              '& .MuiStepContent-root': {
                paddingLeft: { xs: '16px', md: '24px' },
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Box sx={{ mb: 2 }}>
                    {getStepContent(index)}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box>
                      {activeStep === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          startIcon={isSubmitting ? <LinearProgress /> : <CheckIcon />}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Report'}
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
        </Paper>

        {/* Help Section */}
        <Paper elevation={1} sx={{ p: 4, mt: 4, borderRadius: 3, bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <HelpIcon color="primary" />
            Need Help?
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Be specific with descriptions"
                    secondary="Include colors, brands, and unique features"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CameraIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Add clear photos"
                    secondary="Multiple angles help with identification"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Accurate location details"
                    secondary="Specific building or area information"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ContactIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Keep contact info updated"
                    secondary="We'll notify you of potential matches"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Success Dialog */}
      <Dialog 
        open={showSuccessDialog} 
        onClose={() => setShowSuccessDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            mx: { xs: 2, sm: 0 },
            my: { xs: 2, sm: 0 },
            borderRadius: { xs: 2, md: 3 },
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <CheckIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Report Submitted Successfully!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            Your {reportData.type} item report has been submitted and is now visible to the community.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            You will receive notifications if there are any potential matches or updates.
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
    </Box>
  );
};

export default EasyReport;
