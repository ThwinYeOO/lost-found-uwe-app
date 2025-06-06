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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { getLostItems, searchLostItems, addItem } from '../services/firestore';
import { Item } from '../types';

const LostItems: React.FC = () => {
  const [lostItems, setLostItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItem, setNewItem] = useState({
    itemName: '',
    category: '',
    location: '',
    dateLostFound: new Date(),
    description: '',
    contactInfo: '',
    status: 'Lost',
    type: 'Lost' as const,
    userId: 'current-user-id', // TODO: Replace with actual user ID
  });

  const fetchLostItems = async () => {
    try {
      setLoading(true);
      const items = await getLostItems();
      setLostItems(items);
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

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addItem(newItem);
      await fetchLostItems(); // Refresh the list after adding a new item
      handleCloseForm();
      setNewItem({
        itemName: '',
        category: '',
        location: '',
        dateLostFound: new Date(),
        description: '',
        contactInfo: '',
        status: 'Lost',
        type: 'Lost',
        userId: 'current-user-id',
      });
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
      }
    } catch (err) {
      console.error('Error searching lost items:', err);
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Lost Items
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Report Lost Item
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search lost items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                ),
              }}
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
        {lostItems.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" color="textSecondary">
              No lost items found
            </Typography>
          </Grid>
        ) : (
          lostItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.itemName}
                  </Typography>
                  <Chip
                    label={item.category}
                    color="primary"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography color="textSecondary" gutterBottom>
                    Location: {item.location}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Date Lost: {item.dateLostFound?.toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {item.description}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Contact: {item.contactInfo}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>Report Lost Item</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Item Name"
                  value={newItem.itemName}
                  onChange={(e) =>
                    setNewItem({ ...newItem, itemName: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category"
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
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
                  value={newItem.location}
                  onChange={(e) =>
                    setNewItem({ ...newItem, location: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contact Information"
                  value={newItem.contactInfo}
                  onChange={(e) =>
                    setNewItem({ ...newItem, contactInfo: e.target.value })
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
    </Container>
  );
};

export default LostItems; 