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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [activeTab, setActiveTab] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Accessories' },
    { value: 'books', label: 'Books & Stationery' },
    { value: 'jewelry', label: 'Jewelry & Watches' },
    { value: 'bags', label: 'Bags & Backpacks' },
    { value: 'keys', label: 'Keys & ID Cards' },
    { value: 'sports', label: 'Sports Equipment' },
    { value: 'other', label: 'Other Items' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'location', label: 'Nearest Location' },
    { value: 'category', label: 'Category' },
  ];

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'iPhone 13 Pro',
      description: 'Black iPhone 13 Pro with clear case, found near the library entrance',
      category: 'electronics',
      location: 'Frenchay Campus - Library',
      dateFound: '2024-01-15',
      image: '/uploads/iphone.jpg',
      status: 'found',
      contactInfo: {
        name: 'Sarah Johnson',
        email: 'sarah.j@uwe.ac.uk',
        phone: '07123456789',
      },
      tags: ['phone', 'apple', 'black', 'library'],
      views: 45,
      isVerified: true,
    },
    {
      id: '2',
      title: 'Blue Backpack',
      description: 'Navy blue backpack with laptop compartment, contains textbooks',
      category: 'bags',
      location: 'Glenside Campus - Main Building',
      dateFound: '2024-01-14',
      image: '/uploads/backpack.jpg',
      status: 'lost',
      contactInfo: {
        name: 'Mike Chen',
        email: 'mike.chen@uwe.ac.uk',
        phone: '07987654321',
      },
      tags: ['backpack', 'blue', 'laptop', 'textbooks'],
      views: 32,
      isVerified: true,
    },
    {
      id: '3',
      title: 'Gold Watch',
      description: 'Vintage gold watch with leather strap, found in the cafeteria',
      category: 'jewelry',
      location: 'City Campus - Cafeteria',
      dateFound: '2024-01-13',
      image: '/uploads/watch.jpg',
      status: 'found',
      contactInfo: {
        name: 'Emma Williams',
        email: 'emma.w@uwe.ac.uk',
        phone: '07555666777',
      },
      tags: ['watch', 'gold', 'vintage', 'leather'],
      views: 28,
      isVerified: false,
    },
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSearchResults(mockResults);
    setIsLoading(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    }
  }, [searchQuery]);

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
              fontSize: { xs: '1.1rem', md: '1.3rem' },
            }}
          >
            Find items instantly with our advanced search functionality
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Search Section */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Search Items
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search for items, descriptions, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            >
              Advanced Filters
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleClearSearch}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            >
              Clear All
            </Button>
          </Box>
        </Paper>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Search Results ({searchResults.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip icon={<TrendingIcon />} label="Popular" variant="outlined" />
                <Chip icon={<TimeIcon />} label="Recent" variant="outlined" />
                <Chip icon={<LocationIcon />} label="Nearby" variant="outlined" />
              </Box>
            </Box>

            <Grid container spacing={3}>
              {searchResults.map((item, index) => (
                <Grid item xs={12} md={6} lg={4} key={item.id}>
                  <Fade in timeout={300 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
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
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                            {item.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {item.isVerified && (
                              <Chip
                                icon={<CheckIcon />}
                                label="Verified"
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            )}
                            <Chip
                              label={item.status === 'found' ? 'Found' : 'Lost'}
                              size="small"
                              color={item.status === 'found' ? 'success' : 'warning'}
                              variant="filled"
                            />
                          </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                          {item.description}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {item.location}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(item.dateFound).toLocaleDateString()}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
                          {item.tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {item.contactInfo.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.views} views
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small">
                              <PhoneIcon />
                            </IconButton>
                            <IconButton size="small">
                              <EmailIcon />
                            </IconButton>
                            <IconButton size="small">
                              <ShareIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Search Tips */}
        <Paper elevation={1} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon color="primary" />
            Search Tips
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Use specific keywords"
                    secondary="Try brand names, colors, or unique features"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Search by location"
                    secondary="Include campus or building names"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Use tags effectively"
                    secondary="Look for items with similar tags"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Check recent items"
                    secondary="Sort by date to see latest additions"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default QuickSearch;
