import React, { useState } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import LostItemForm, { LostItemData } from '../components/LostItemForm';

const LostItems: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lostItems, setLostItems] = useState<LostItemData[]>([
    {
      itemName: 'MacBook Pro',
      category: 'Electronics',
      location: 'Frenchay Campus',
      dateLost: new Date('2024-03-15'),
      description: 'Silver MacBook Pro 13-inch with Touch Bar. Last seen in the library.',
      contactInfo: 'john.doe@uwe.ac.uk',
      status: 'Lost',
    },
    {
      itemName: 'Student ID Card',
      category: 'Documents',
      location: 'Glenside Campus',
      dateLost: new Date('2024-03-18'),
      description: 'UWE student ID card with name "Jane Smith".',
      contactInfo: 'jane.smith@uwe.ac.uk',
      status: 'Lost',
    },
    {
      itemName: 'Black Backpack',
      category: 'Accessories',
      location: 'City Campus',
      dateLost: new Date('2024-03-20'),
      description: 'Nike black backpack with laptop compartment. Contains textbooks and stationery.',
      contactInfo: 'mike.wilson@uwe.ac.uk',
      status: 'Lost',
    },
  ]);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = (data: LostItemData) => {
    // TODO: Add API call to save the lost item
    setLostItems((prev) => [...prev, data]);
  };

  const filteredItems = lostItems.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      item.location.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower)
    );
  });

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

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by item name, category, location, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.itemName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Category: {item.category}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Location: {item.location}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Date Lost: {item.dateLost.toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Contact: {item.contactInfo}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <LostItemForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </Container>
  );
};

export default LostItems; 