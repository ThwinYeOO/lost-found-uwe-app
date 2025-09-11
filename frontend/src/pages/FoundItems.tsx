import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, ContactPhone as ContactPhoneIcon, Email as EmailIcon } from '@mui/icons-material';
import FoundItemForm, { FoundItemData } from '../components/FoundItemForm';
import { getFoundItems, searchFoundItems, addItem } from '../services/firestore';
import { Item, User } from '../types';

const FoundItems: React.FC = () => {
  const [foundItems, setFoundItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    locationLostFound: '',
    dateLostFound: new Date(),
    imageUrl: '',
    phoneNumber: '',
    reportName: '',
    status: 'Found',
    type: 'Found',
    reportUserId: '',
  });

  const fetchFoundItems = async () => {
    try {
      setLoading(true);
      const items = await getFoundItems();
      setFoundItems(items);
      setError(null);
    } catch (err) {
      setError('Failed to fetch found items. Please try again later.');
      console.error('Error fetching found items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoundItems();
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
      await fetchFoundItems(); // Refresh the list after adding a new item
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
        await fetchFoundItems();
      } else {
        const results = await searchFoundItems(searchQuery);
        setFoundItems(results);
      }
    } catch (err) {
      console.error('Error searching found items:', err);
      setError('Failed to search items. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Found Items
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Report Found Item
        </Button>
      </Box>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search found items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {foundItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Location: {item.locationLostFound}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Date Found: {new Date(item.dateLostFound).toLocaleDateString()}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Contact: {item.phoneNumber}
                </Typography>
                {item.reportName && (
                  <Typography color="textSecondary" gutterBottom>
                    Reporter's Name: {item.reportName}
                  </Typography>
                )}
                <Typography variant="body2">{item.description}</Typography>
                {item.imageUrl && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  </Box>
                )}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ContactPhoneIcon />}
                    onClick={() => handleContactOwner(item)}
                    fullWidth
                  >
                    Contact Owner
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>Report Found Item</DialogTitle>
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
                  label="Location Found"
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
                  label="Reporter's Name"
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
                  label="Date Found"
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
                  Original Owner Information:
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
                  <strong>Location Found:</strong> {selectedItem.locationLostFound}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Date Found:</strong> {new Date(selectedItem.dateLostFound).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Description:</strong> {selectedItem.description}
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>How to contact:</strong> Use the phone number above to call or text the original owner. 
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
    </Container>
  );
};

export default FoundItems; 