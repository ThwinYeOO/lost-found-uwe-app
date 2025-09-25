import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  Alert,
  Fade,
  Slide,
} from '@mui/material';
import { getItems } from '../services/firestore';
import { Item } from '../types';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  dateFound: string;
  image: string;
  status: 'lost' | 'found';
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  tags: string[];
  views: number;
  isVerified: boolean;
}

const QuickSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    status: '',
    sortBy: 'relevance'
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [activeTab, setActiveTab] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const allItems = await getItems(activeTab === 0 ? 'Lost' : 'Found');
      
      // Filter items based on search query and filters
      let filteredItems = allItems.filter(item => {
        const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.type.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = !filters.category || item.type === filters.category;
        const matchesLocation = !filters.location || item.locationLostFound.toLowerCase().includes(filters.location.toLowerCase());
        
        return matchesQuery && matchesCategory && matchesLocation;
      });
      
      // Sort results
      filteredItems.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date':
            return new Date(b.dateLostFound).getTime() - new Date(a.dateLostFound).getTime();
          case 'title':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
      
      // Convert to SearchResult format
      const results: SearchResult[] = filteredItems.map(item => ({
        id: item.id || '',
        title: item.name,
        description: item.description,
        category: item.type,
        location: item.locationLostFound,
        dateFound: item.dateLostFound ? new Date(item.dateLostFound).toLocaleDateString() : '',
        image: item.imageUrl || '/placeholder-item.jpg',
        status: item.type.toLowerCase() as 'lost' | 'found',
        contactInfo: {
          name: item.reportName || 'Anonymous',
          email: 'contact@uwe.ac.uk',
          phone: item.phoneNumber || '+44 117 32 81000'
        },
        tags: [item.type, item.locationLostFound],
        views: Math.floor(Math.random() * 100),
        isVerified: true
      }));
      
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search items. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search on Enter key
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Accessories' },
    { value: 'books', label: 'Books & Stationery' },
    { value: 'jewelry', label: 'Jewelry & Watches' },
    { value: 'bags', label: 'Bags & Backpacks' },
    { value: 'keys', label: 'Keys & Access Cards' },
    { value: 'other', label: 'Other' },
  ];

  const locations = [
    'Frenchay Campus',
    'Glenside Campus',
    'City Campus',
    'Bower Ashton Campus',
    'Library',
    'Cafeteria',
    'Sports Center',
    'Student Union',
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchResults([]);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
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
            Quick Search
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              opacity: 0.9, 
              maxWidth: '800px', 
              mx: 'auto',
              fontWeight: 300,
              mb: 4,
            }}
          >
            Find lost items or check if someone found your belongings
          </Typography>

          {/* Search Bar */}
          <Box sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for lost or found items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                },
              }}
            />
          </Box>

          {/* Search Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            {loading ? 'Searching...' : 'Search Items'}
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                px: 4,
              },
            }}
          >
            <Tab label="Lost Items" />
            <Tab label="Found Items" />
          </Tabs>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FilterIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Filters
            </Typography>
            <Button
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              sx={{ ml: 'auto' }}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </Box>

          {showFilters && (
            <Fade in={showFilters}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      label="Category"
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.slice(1).map((category) => (
                        <MenuItem key={category.value} value={category.value}>
                          {category.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Location</InputLabel>
                    <Select
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      label="Location"
                    >
                      <MenuItem value="">All Locations</MenuItem>
                      {locations.map((location) => (
                        <MenuItem key={location} value={location}>
                          {location}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      label="Sort By"
                    >
                      <MenuItem value="relevance">Relevance</MenuItem>
                      <MenuItem value="date">Date</MenuItem>
                      <MenuItem value="title">Title</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Fade>
          )}
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
        )}

        {/* Results Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : searchResults.length > 0 ? (
          <Grid container spacing={3}>
            {searchResults.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Slide direction="up" in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.image}
                      alt={item.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h3" sx={{ flexGrow: 1, fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                        <Chip
                          label={item.status}
                          color={item.status === 'lost' ? 'error' : 'success'}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {item.location}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <TimeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {item.dateFound}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {item.tags.map((tag, tagIndex) => (
                          <Chip
                            key={tagIndex}
                            label={tag}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ViewIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {item.views} views
                          </Typography>
                        </Box>
                        {item.isVerified && (
                          <CheckIcon fontSize="small" color="success" />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        ) : searchQuery && !loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No items found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search terms or filters
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Start your search
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter keywords to find lost or found items
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default QuickSearch;