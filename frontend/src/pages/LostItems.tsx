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
} from '@mui/icons-material';
import LostItemForm, { LostItemData } from '../components/LostItemForm';
import { getLostItems, searchLostItems, addItem } from '../services/firestore';
import { Item, User } from '../types';

const LostItems: React.FC = () => {
  const [lostItems, setLostItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
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

  const fetchLostItems = async () => {
    try {
      setLoading(true);
      const items = await getLostItems();
      setLostItems(items);
      setFilteredItems(items);
      
      // Calculate statistics
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentItems = items.filter(item => new Date(item.dateLostFound) >= oneWeekAgo).length;
      const resolvedItems = items.filter(item => item.status === 'Found').length;
      
      setStats({
        totalItems: items.length,
        recentItems,
        resolvedItems,
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch lost items. Please try again later.');
      console.error('Error fetching lost items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLostItems();
  }, []);

  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        setCurrentUser(user);
        setNewItem(prev => ({
          ...prev,
          reportUserId: user.id || '',
          reportName: user.name || ''
        }));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

  const handleContactOwner = (item: Item) => {
    setSelectedItem(item);
    setContactDialogOpen(true);
  };

  const handleCloseContactDialog = () => {
    setContactDialogOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addItem(newItem);
      await fetchLostItems(); // Refresh the list after adding a new item
      handleCloseForm();
    } catch (err) {
      setError('Failed to add item. Please try again.');
      console.error('Error adding item:', err);
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
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Fade in={true} timeout={1000}>
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                Lost & Found Hub
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                Reunite with your lost belongings. Help others find theirs. Together, we make campus life easier.
              </Typography>
              
              {/* Statistics Cards */}
              <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
                <Grid item xs={12} sm={4}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 3,
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {stats.totalItems}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Total Items
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 3,
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {stats.recentItems}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      This Week
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 3,
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {stats.resolvedItems}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Resolved
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleOpenForm}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Report Lost Item
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

      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* Search and Filter Section */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          }}
        >
          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
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
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchQuery('')}
                          edge="end"
                        >
                          <CloseIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    label="Category"
                    onChange={(e) => setFilterCategory(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="all">All Items</MenuItem>
                    <MenuItem value="Lost">Lost Items</MenuItem>
                    <MenuItem value="Found">Found Items</MenuItem>
                    <MenuItem value="Electronics">Electronics</MenuItem>
                    <MenuItem value="Clothing">Clothing</MenuItem>
                    <MenuItem value="Accessories">Accessories</MenuItem>
                    <MenuItem value="Documents">Documents</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'location')}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="location">Location</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Stack direction="row" spacing={1} sx={{ height: '100%' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    startIcon={<SortIcon />}
                    sx={{ borderRadius: 2, flex: 1 }}
                  >
                    {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                  </Button>
                  <Tooltip title={viewMode === 'grid' ? 'List View' : 'Grid View'}>
                    <IconButton
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      sx={{ borderRadius: 2 }}
                    >
                      {viewMode === 'grid' ? <ListViewIcon /> : <GridViewIcon />}
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
          <Chip
            icon={<TrendingUpIcon />}
            label={`${stats.recentItems} this week`}
            color="primary"
            variant="outlined"
          />
        </Box>

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
          <Grid container spacing={3}>
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
        <DialogTitle>Report Lost Item</DialogTitle>
        <form onSubmit={handleSubmit}>
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
                <TextField
                  fullWidth
                  label="Image URL"
                  value={newItem.imageUrl}
                  onChange={(e) =>
                    setNewItem({ ...newItem, imageUrl: e.target.value })
                  }
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
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
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LostItems; 