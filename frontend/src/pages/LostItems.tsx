import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Chip,
  Paper,
  Fade,
  Skeleton,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  Stack,
  LinearProgress,
  Zoom,
  Slide,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ContactPhone as ContactPhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import LostItemForm, { LostItemData } from '../components/LostItemForm';
import ChatBox from '../components/ChatBox';
import { getLostItems, searchLostItems, addItem, uploadItemImage } from '../services/firestore';
import { Item, User } from '../types';
import { useNavigate } from 'react-router-dom';

const LostItems: React.FC = () => {
  console.log('=== LostItems component rendering ===');
  const navigate = useNavigate();
  const [lostItems, setLostItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'location'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    recentItems: 0,
    resolvedItems: 0,
    claimedItems: 0,
  });
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    locationLostFound: '',
    dateLostFound: new Date(),
    imageUrl: '',
    phoneNumber: '',
    reportName: '',
    status: 'Lost',
    type: 'Lost',
    reportUserId: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'file' | 'url'>('file');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchLostItems = async () => {
    console.log('=== fetchLostItems function called ===');
    try {
      setLoading(true);
      console.log('Starting to fetch lost items...');
      const items = await getLostItems();
      console.log('Fetched items:', items);
      console.log('Number of items:', items.length);
      setLostItems(items);
      setFilteredItems(items);
      
      // Calculate statistics
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentItems = items.filter(item => new Date(item.dateLostFound || 0) >= oneWeekAgo).length;
      const resolvedItems = items.filter(item => item.status === 'Resolved').length;
      const claimedItems = items.filter(item => item.status === 'Claimed').length;
      
      setStats({
        totalItems: items.length,
        recentItems,
        resolvedItems,
        claimedItems,
      });
      
      setError(null);
      console.log('Items set successfully, loading set to false');
    } catch (err) {
      setError('Failed to fetch lost items. Please try again later.');
      console.error('Error fetching lost items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('LostItems useEffect triggered - calling fetchLostItems');
    fetchLostItems();
  }, []);

  // Add refresh when page becomes visible (user navigates back from admin dashboard)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing lost items...');
        fetchLostItems();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh when the page regains focus
    const handleFocus = () => {
      console.log('Page gained focus, refreshing lost items...');
      fetchLostItems();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        setNewItem(prev => ({
          ...prev,
          reportUserId: user.id || '',
          reportName: user.name || ''
        }));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleOpenForm = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setOpenForm(true);
  };
  const handleCloseForm = () => {
    setOpenForm(false);
    setNewItem({
      name: '',
      description: '',
      locationLostFound: '',
      dateLostFound: new Date(),
      imageUrl: '',
      phoneNumber: '',
      reportName: '',
      status: 'Lost',
      type: 'Lost',
      reportUserId: '',
    });
    setSelectedFile(null);
    setImageUrl('');
    setImagePreviewUrl('');
    setImageInputMode('file');
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('=== FILE SELECTION DEBUG ===');
    console.log('File input event triggered');
    console.log('Event target:', e.target);
    console.log('Files array:', e.target.files);
    console.log('Files length:', e.target.files?.length);
    
    const file = e.target.files?.[0];
    console.log('Selected file:', file);
    
    if (file) {
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      });
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.log('Invalid file type:', file.type);
        alert('Please select an image file');
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        console.log('File too large:', file.size);
        alert('File size must be less than 5MB');
        return;
      }
      
      console.log('File validation passed, setting selectedFile state');
      setSelectedFile(file);
      console.log('File set successfully in state');
    } else {
      console.log('No file selected or file is null/undefined');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setNewItem({ ...newItem, imageUrl: '' });
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (url && isValidImageUrl(url)) {
      setImagePreviewUrl(url);
    } else {
      setImagePreviewUrl('');
    }
  };

  const isValidImageUrl = (url: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('data:image/') ||
           lowerUrl.includes('imgur.com') ||
           lowerUrl.includes('cloudinary.com') ||
           lowerUrl.includes('amazonaws.com');
  };

  const handleImageModeChange = (mode: 'file' | 'url') => {
    setImageInputMode(mode);
    // Clear the other input when switching modes
    if (mode === 'file') {
      setImageUrl('');
      setImagePreviewUrl('');
    } else {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleContactOwner = (item: Item) => {
    setSelectedItem(item);
    setContactDialogOpen(true);
  };

  const handleCloseContactDialog = () => {
    setContactDialogOpen(false);
    setSelectedItem(null);
  };

  const handleOpenChatDialog = () => {
    setChatDialogOpen(true);
    setContactDialogOpen(false);
  };

  const handleCloseChatDialog = () => {
    setChatDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Debug: Show what we're about to submit
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Selected file:', selectedFile);
    console.log('New item data:', newItem);
    console.log('Is authenticated:', isAuthenticated);
    
    try {
      setUploading(true);
      
      // Prepare item data
      let itemData = { ...newItem };
      
      // Handle image based on input mode
      if (imageInputMode === 'file' && selectedFile) {
        console.log('=== FILE UPLOAD DEBUG ===');
        console.log('Selected file exists:', !!selectedFile);
        console.log('File name:', selectedFile.name);
        console.log('File size:', selectedFile.size, 'bytes');
        console.log('File type:', selectedFile.type);
        console.log('Starting image upload process...');
        
        try {
          const uploadedImageUrl = await uploadItemImage(selectedFile);
          console.log('Image upload successful!');
          console.log('Image URL length:', uploadedImageUrl.length);
          console.log('Image URL preview:', uploadedImageUrl.substring(0, 50) + '...');
          itemData.imageUrl = uploadedImageUrl;
          console.log('Image URL added to itemData:', !!itemData.imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          throw uploadError;
        }
      } else if (imageInputMode === 'url' && imageUrl) {
        console.log('=== URL IMAGE DEBUG ===');
        console.log('Using provided image URL:', imageUrl);
        itemData.imageUrl = imageUrl;
        console.log('Image URL added to itemData:', !!itemData.imageUrl);
      } else {
        console.log('=== NO IMAGE PROVIDED ===');
        console.log('Input mode:', imageInputMode);
        console.log('Selected file:', selectedFile);
        console.log('Image URL:', imageUrl);
        console.log('This means no image will be added');
      }
      
      console.log('Final item data to submit:', itemData);
      await addItem(itemData);
      console.log('Item added successfully to database');
      await fetchLostItems(); // Refresh the list after adding a new item
      handleCloseForm();
    } catch (err) {
      console.error('Error in form submission:', err);
      setError('Failed to add item. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!searchQuery.trim()) {
        await fetchLostItems();
      } else {
        const results = await searchLostItems(searchQuery);
        setLostItems(results);
        setFilteredItems(results);
      }
    } catch (err) {
      console.error('Error searching lost items:', err);
      setError('Failed to search items. Please try again.');
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...lostItems];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.locationLostFound.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.type === filterCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.dateLostFound).getTime() - new Date(b.dateLostFound).getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'location':
          comparison = a.locationLostFound.localeCompare(b.locationLostFound);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredItems(filtered);
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchQuery, filterCategory, sortBy, sortOrder, lostItems]);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Lost': 'error',
      'Found': 'success',
      'Electronics': 'primary',
      'Clothing': 'secondary',
      'Accessories': 'warning',
      'Documents': 'info',
    };
    return colors[category] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Skeleton variant="rectangular" width="70%" height={56} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" width="30%" height={56} sx={{ borderRadius: 2 }} />
            </Box>
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h5" color="error" gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button variant="contained" onClick={fetchLostItems} startIcon={<RefreshIcon />}>
              Try Again
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* 3D Explosive Hero Section */}
      <Box
        sx={{
          minHeight: '80vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          color: 'white',
          py: { xs: 6, sm: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%),
              url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
            `,
            animation: 'explosiveFloat 8s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/uwe-campus.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            zIndex: 1,
          },
        }}
      >
        {/* 3D Floating Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            left: '8%',
            width: 120,
            height: 120,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
            borderRadius: '50%',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(255,255,255,0.3)',
            animation: 'explosiveFloat 6s ease-in-out infinite',
            zIndex: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            right: '12%',
            width: 80,
            height: 80,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))',
            borderRadius: '50%',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(255,255,255,0.3)',
            animation: 'explosiveFloat 7s ease-in-out infinite reverse',
            zIndex: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '15%',
            width: 100,
            height: 100,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
            borderRadius: '50%',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(255,255,255,0.3)',
            animation: 'explosiveFloat 9s ease-in-out infinite',
            zIndex: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            right: '20%',
            width: 60,
            height: 60,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
            borderRadius: '50%',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(255,255,255,0.3)',
            animation: 'explosiveFloat 5s ease-in-out infinite reverse',
            zIndex: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        />
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 4 }, position: 'relative', zIndex: 3 }}>
          <Fade in={true} timeout={1000}>
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 3 }}>
              {/* 3D Explosive Title */}
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 900,
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
                  background: 'linear-gradient(45deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  px: { xs: 1, sm: 2, md: 0 },
                  animation: 'explosiveGlow 3s ease-in-out infinite alternate',
                  letterSpacing: '-0.02em',
                }}
              >
                Lost & Found Hub
              </Typography>
              
              {/* 3D Glassmorphism Subtitle */}
              <Box
                sx={{
                  display: 'inline-block',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(25px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 6,
                  px: 4,
                  py: 2,
                  mb: 4,
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                  animation: 'explosivePulse 4s ease-in-out infinite',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 0,
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontWeight: 600,
                    lineHeight: 1.4,
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  Reunite with your lost belongings. Help others find theirs. Together, we make campus life easier.
                </Typography>
              </Box>
              
              {/* 3D Explosive Statistics Cards */}
              <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 4, sm: 6 }, justifyContent: 'center', px: { xs: 1, sm: 0 } }}>
                <Grid item xs={6} sm={3}>
                  <Paper
                    sx={{
                      p: { xs: 3, sm: 4 },
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: 4,
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        background: 'rgba(255, 255, 255, 0.25)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transition: 'left 0.6s',
                      },
                      '&:hover::before': {
                        left: '100%',
                      },
                    }}
                  >
                    <Typography variant="h2" sx={{ 
                      fontWeight: 900, 
                      mb: { xs: 1, sm: 1.5 }, 
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                      background: 'linear-gradient(45deg, #ffffff 0%, #f0f0f0 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}>
                      {stats.totalItems}
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      opacity: 0.9, 
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontWeight: 600,
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    }}>
                      Total Items
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    sx={{
                      p: { xs: 3, sm: 4 },
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: 4,
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        background: 'rgba(255, 255, 255, 0.25)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transition: 'left 0.6s',
                      },
                      '&:hover::before': {
                        left: '100%',
                      },
                    }}
                  >
                    <Typography variant="h2" sx={{ 
                      fontWeight: 900, 
                      mb: { xs: 1, sm: 1.5 }, 
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                      background: 'linear-gradient(45deg, #4fc3f7 0%, #29b6f6 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}>
                      {stats.recentItems}
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      opacity: 0.9, 
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontWeight: 600,
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    }}>
                      This Week
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    sx={{
                      p: { xs: 3, sm: 4 },
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: 4,
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        background: 'rgba(255, 255, 255, 0.25)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transition: 'left 0.6s',
                      },
                      '&:hover::before': {
                        left: '100%',
                      },
                    }}
                  >
                    <Typography variant="h2" sx={{ 
                      fontWeight: 900, 
                      mb: { xs: 1, sm: 1.5 }, 
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                      background: 'linear-gradient(45deg, #4caf50 0%, #2e7d32 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}>
                      {stats.resolvedItems}
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      opacity: 0.9, 
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontWeight: 600,
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    }}>
                      Resolved
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    sx={{
                      p: { xs: 3, sm: 4 },
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: 4,
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        background: 'rgba(255, 255, 255, 0.25)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transition: 'left 0.6s',
                      },
                      '&:hover::before': {
                        left: '100%',
                      },
                    }}
                  >
                    <Typography variant="h2" sx={{ 
                      fontWeight: 900, 
                      mb: { xs: 1, sm: 1.5 }, 
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                      background: 'linear-gradient(45deg, #ff9800 0%, #f57c00 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}>
                      {stats.claimedItems}
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      opacity: 0.9, 
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontWeight: 600,
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    }}>
                      Claimed
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* 3D Explosive Action Button */}
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon sx={{ fontSize: 28 }} />}
                onClick={handleOpenForm}
                sx={{
                  px: { xs: 6, sm: 8 },
                  py: 3,
                  fontSize: { xs: '1.1rem', sm: '1.2rem' },
                  fontWeight: 800,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 50%, #e53935 100%)',
                  boxShadow: '0 12px 40px rgba(255, 107, 107, 0.5)',
                  textTransform: 'none',
                  minWidth: { xs: '320px', sm: 'auto' },
                  minHeight: '64px',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5252 0%, #e53935 50%, #d32f2f 100%)',
                    transform: 'translateY(-6px) scale(1.05)',
                    boxShadow: '0 20px 60px rgba(255, 107, 107, 0.7)',
                  },
                  '&:active': {
                    transform: 'translateY(-3px) scale(1.02)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    transition: 'left 0.8s',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 0,
                    height: 0,
                    background: 'rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    transition: 'all 0.6s',
                  },
                  '&:active::after': {
                    width: '300px',
                    height: '300px',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AddIcon sx={{ fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    REPORT LOST ITEM
                  </Typography>
                </Box>
              </Button>
            </Box>
          </Fade>
        </Container>
        
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
            backgroundSize: '50px 50px',
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2, md: 0 } }}>

        {/* Search and Filter Section */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: { xs: 3, sm: 4 },
            borderRadius: { xs: 2, sm: 3 },
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={{ xs: 2, sm: 2, md: 2 }} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search by item name, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchQuery('')}
                          edge="end"
                          sx={{ minHeight: 40, minWidth: 40 }}
                        >
                          <CloseIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: 2, sm: 2 },
                      bgcolor: 'white',
                      minHeight: { xs: 56, sm: 60 },
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '16px', sm: '16px' },
                        py: { xs: 2.5, sm: 2 },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    label="Category"
                    onChange={(e) => setFilterCategory(e.target.value)}
                    sx={{ 
                      borderRadius: { xs: 2, sm: 2 },
                      minHeight: { xs: 56, sm: 60 },
                      '& .MuiSelect-select': {
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      },
                    }}
                  >
                    <MenuItem value="all" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>All Items</MenuItem>
                    <MenuItem value="Lost" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Lost Items</MenuItem>
                    <MenuItem value="Found" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Found Items</MenuItem>
                    <MenuItem value="Electronics" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Electronics</MenuItem>
                    <MenuItem value="Clothing" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Clothing</MenuItem>
                    <MenuItem value="Accessories" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Accessories</MenuItem>
                    <MenuItem value="Documents" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Documents</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'location')}
                    sx={{ 
                      borderRadius: { xs: 2, sm: 2 },
                      minHeight: { xs: 56, sm: 60 },
                      '& .MuiSelect-select': {
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      },
                    }}
                  >
                    <MenuItem value="date" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Date</MenuItem>
                    <MenuItem value="name" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Name</MenuItem>
                    <MenuItem value="location" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Location</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Stack direction="row" spacing={1} sx={{ height: '100%' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    startIcon={<SortIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                    sx={{ 
                      borderRadius: { xs: 2, sm: 2 }, 
                      flex: 1,
                      minHeight: { xs: 56, sm: 60 },
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    }}
                  >
                    {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                  </Button>
                  <Tooltip title={viewMode === 'grid' ? 'List View' : 'Grid View'}>
                    <IconButton
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      sx={{ 
                        borderRadius: { xs: 2, sm: 2 },
                        minHeight: { xs: 56, sm: 60 },
                        minWidth: { xs: 56, sm: 60 },
                      }}
                    >
                      {viewMode === 'grid' ? 
                        <ListViewIcon sx={{ fontSize: { xs: 20, sm: 24 } }} /> : 
                        <GridViewIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                      }
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Results Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {filteredItems.length} {filteredItems.length === 1 ? 'Item' : 'Items'} Found
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchLostItems}
              disabled={loading}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
            <Chip
              icon={<TrendingUpIcon />}
              label={`${stats.recentItems} this week`}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Login Prompt for Unauthenticated Users */}
        {!isAuthenticated && (
          <Alert 
            severity="info" 
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => navigate('/login')}
                  sx={{ fontWeight: 600 }}
                >
                  Login
                </Button>
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => navigate('/register')}
                  sx={{ fontWeight: 600 }}
                >
                  Register
                </Button>
              </Box>
            }
          >
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>🔐 Account Required to Report Items</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                To maintain security and help you recover your items, we require users to create an account before reporting lost or found items. This helps us:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, fontSize: '0.875rem' }}>
                <li>Verify your identity and contact information</li>
                <li>Track your reported items and match them with others</li>
                <li>Send you notifications when your items are found</li>
                <li>Protect against spam and false reports</li>
                <li>Connect you with the finder through secure messaging</li>
              </Box>
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                Creating an account is free and takes less than 2 minutes!
              </Typography>
            </Box>
          </Alert>
        )}

        {/* Items Grid/List */}
        {filteredItems.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: 'grey.50',
              border: '2px dashed',
              borderColor: 'grey.300',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <VisibilityIcon sx={{ fontSize: 64, color: 'grey.400' }} />
            </Box>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {searchQuery ? 'No items found' : 'No lost items yet'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery 
                ? 'Try adjusting your search terms or filters'
                : 'Be the first to report a lost item and help others find their belongings'
              }
            </Typography>
            {!searchQuery && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenForm}
                sx={{ borderRadius: 2 }}
              >
                Report First Item
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {filteredItems.map((item, index) => (
              <Grid 
                item 
                xs={12} 
                sm={viewMode === 'list' ? 12 : 6} 
                md={viewMode === 'list' ? 12 : 4} 
                key={item.id}
              >
                <Fade in={true} timeout={300 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 8,
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    {/* Image Section */}
                    {item.imageUrl && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.imageUrl}
                        alt={item.name}
                        sx={{
                          objectFit: 'cover',
                          position: 'relative',
                        }}
                      />
                    )}
                    
                    {/* Status Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 1,
                      }}
                    >
                      <Chip
                        label={item.status}
                        color={getCategoryColor(item.status) as any}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          boxShadow: 2,
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            lineHeight: 1.2,
                            flex: 1,
                            mr: 1,
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            bgcolor: 'grey.100',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: 500,
                          }}
                        >
                          {getTimeAgo(new Date(item.dateLostFound))}
                        </Typography>
                      </Box>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4,
                        }}
                      >
                        {item.description}
                      </Typography>

                      {/* Details */}
                      <Stack spacing={1} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {item.locationLostFound}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(item.dateLostFound).toLocaleDateString()}
                          </Typography>
                        </Box>
                        {item.reportName && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {item.reportName}
                            </Typography>
                          </Box>
                        )}
                      </Stack>

                      {/* Contact Button */}
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<ContactPhoneIcon />}
                        onClick={() => handleContactOwner(item)}
                        sx={{
                          borderRadius: 2,
                          py: 1.5,
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Contact Owner
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Report Lost Item</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Item Name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location Lost"
                  value={newItem.locationLostFound}
                  onChange={(e) =>
                    setNewItem({ ...newItem, locationLostFound: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={newItem.phoneNumber}
                  onChange={(e) =>
                    setNewItem({ ...newItem, phoneNumber: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reporter Name"
                  value={newItem.reportName}
                  onChange={(e) =>
                    setNewItem({ ...newItem, reportName: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Date Lost"
                  value={newItem.dateLostFound.toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setNewItem({ ...newItem, dateLostFound: new Date(e.target.value) })
                  }
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Item Image *
                  </Typography>
                  
                  {/* Image Input Mode Tabs */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs 
                      value={imageInputMode} 
                      onChange={(e, newValue) => handleImageModeChange(newValue)}
                      aria-label="image input mode tabs"
                    >
                      <Tab label="Upload File" value="file" />
                      <Tab label="Image URL" value="url" />
                    </Tabs>
                  </Box>

                  {/* File Upload Tab */}
                  {imageInputMode === 'file' && (
                    <Box>
                      <input
                        ref={fileInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="item-image-upload"
                        type="file"
                        onChange={handleFileChange}
                        key={selectedFile ? 'file-selected' : 'no-file'}
                      />
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<AddIcon />}
                        sx={{ mb: 1 }}
                        onClick={() => {
                          console.log('=== CHOOSE IMAGE BUTTON CLICKED ===');
                          console.log('File input ref:', fileInputRef.current);
                          if (fileInputRef.current) {
                            console.log('Triggering file input click via ref');
                            fileInputRef.current.click();
                          } else {
                            console.error('File input ref is null!');
                          }
                        }}
                      >
                        Choose Image
                      </Button>
                      {selectedFile && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                          </Typography>
                          <Typography variant="caption" color="success.main">
                            ✓ File ready for upload
                          </Typography>
                          <Button
                            size="small"
                            onClick={handleRemoveFile}
                            sx={{ mt: 0.5 }}
                          >
                            Remove
                          </Button>
                        </Box>
                      )}
                      {!selectedFile && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            No image selected
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* URL Input Tab */}
                  {imageInputMode === 'url' && (
                    <Box>
                      <TextField
                        fullWidth
                        label="Image URL"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        sx={{ mb: 1 }}
                        helperText="Enter a direct link to an image (jpg, png, gif, etc.)"
                      />
                      
                      {/* Image Preview */}
                      {imagePreviewUrl && (
                        <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                          <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                            ✓ Image Preview
                          </Typography>
                          <Box
                            component="img"
                            src={imagePreviewUrl}
                            alt="Preview"
                            sx={{
                              maxWidth: '100%',
                              maxHeight: '200px',
                              objectFit: 'contain',
                              borderRadius: 1,
                            }}
                            onError={(e) => {
                              console.error('Image failed to load:', imagePreviewUrl);
                              setImagePreviewUrl('');
                            }}
                          />
                        </Box>
                      )}
                      
                      {imageUrl && !imagePreviewUrl && (
                        <Typography variant="caption" color="error.main" sx={{ mt: 1, display: 'block' }}>
                          Invalid image URL or image failed to load
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : null}
            >
              {uploading ? 'Uploading...' : 
               (selectedFile || (imageInputMode === 'url' && imageUrl)) ? 'Submit with Image' : 'Submit'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Contact Owner Dialog */}
      <Dialog open={contactDialogOpen} onClose={handleCloseContactDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Contact Item Owner</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedItem.name}
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Owner Information:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ContactPhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Phone: {selectedItem.phoneNumber}
                  </Typography>
                </Box>
                {selectedItem.reportName && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Name: {selectedItem.reportName}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Item Details:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Location Lost:</strong> {selectedItem.locationLostFound}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Date Lost:</strong> {new Date(selectedItem.dateLostFound).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Description:</strong> {selectedItem.description}
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>How to contact:</strong> Use the phone number above to call or text the owner if you found this item. 
                  Make sure to mention the item name and where you found it.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContactDialog}>
            Close
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleOpenChatDialog}
            startIcon={<MessageIcon />}
          >
            Start Chat
          </Button>
        </DialogActions>
      </Dialog>

      {/* 3D Explosive CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes explosiveFloat {
            0%, 100% {
              transform: translateY(0px) rotate(0deg) scale(1);
            }
            25% {
              transform: translateY(-15px) rotate(2deg) scale(1.05);
            }
            50% {
              transform: translateY(-25px) rotate(0deg) scale(1.1);
            }
            75% {
              transform: translateY(-15px) rotate(-2deg) scale(1.05);
            }
          }
          
          @keyframes explosiveGlow {
            0% {
              text-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }
            100% {
              text-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.2);
            }
          }
          
          @keyframes explosivePulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
            }
            50% {
              transform: scale(1.02);
              box-shadow: 0 16px 50px rgba(0, 0, 0, 0.3);
            }
          }
          
          @keyframes explosiveShimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          @keyframes explosiveBounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0) scale(1);
            }
            40% {
              transform: translateY(-10px) scale(1.05);
            }
            60% {
              transform: translateY(-5px) scale(1.02);
            }
          }
        `
      }} />

      {/* Chat Dialog */}
      {selectedItem && currentUser && (
        <ChatBox
          recipient={{
            id: selectedItem.reportUserId,
            name: selectedItem.reportName || 'Unknown User',
            email: '', // We don't have email in Item interface
            phoneNumber: selectedItem.phoneNumber,
            uweId: '',
            avatar: undefined,
            role: 'user',
            isActive: true,
            createdAt: new Date(),
            lastLogin: new Date()
          }}
          currentUser={currentUser}
          open={chatDialogOpen}
          onClose={handleCloseChatDialog}
        />
      )}
    </Box>
  );
};

export default LostItems; 