import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FoundItemForm, { FoundItemData } from '../components/FoundItemForm';

const FoundItems: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [foundItems, setFoundItems] = useState<FoundItemData[]>([
    {
      itemName: 'iPhone 13',
      category: 'Electronics',
      location: 'Frenchay Campus',
      dateFound: new Date('2024-03-19'),
      description: 'Black iPhone 13 with a blue case. Found in the library study area.',
      contactInfo: 'security@uwe.ac.uk',
      status: 'Available',
    },
    {
      itemName: 'UWE Hoodie',
      category: 'Clothing',
      location: 'Glenside Campus',
      dateFound: new Date('2024-03-20'),
      description: 'UWE branded black hoodie, size M. Found in the cafeteria.',
      contactInfo: 'lost.property@uwe.ac.uk',
      status: 'Available',
    },
    {
      itemName: 'Calculus Textbook',
      category: 'Books',
      location: 'City Campus',
      dateFound: new Date('2024-03-21'),
      description: 'Calculus: Early Transcendentals, 8th Edition. Found in Room 2.15.',
      contactInfo: 'library@uwe.ac.uk',
      status: 'Available',
    },
    {
      itemName: 'Wireless Earbuds',
      category: 'Electronics',
      location: 'Bower Ashton Campus',
      dateFound: new Date('2024-03-22'),
      description: 'White Samsung Galaxy Buds in a black case. Found in the art studio.',
      contactInfo: 'security@uwe.ac.uk',
      status: 'Available',
    },
    {
      itemName: 'Student ID Card',
      category: 'Documents',
      location: 'Frenchay Campus',
      dateFound: new Date('2024-03-23'),
      description: 'UWE student ID card with name "Alex Johnson". Found near the Student Union.',
      contactInfo: 'student.services@uwe.ac.uk',
      status: 'Available',
    },
    {
      itemName: 'Laptop Charger',
      category: 'Electronics',
      location: 'Glenside Campus',
      dateFound: new Date('2024-03-24'),
      description: 'Dell laptop charger, 65W. Found in the computer lab.',
      contactInfo: 'it.support@uwe.ac.uk',
      status: 'Available',
    }
  ]);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = (data: FoundItemData) => {
    // TODO: Add API call to save the found item
    setFoundItems((prev) => [...prev, data]);
  };

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

      <Grid container spacing={3}>
        {foundItems.map((item, index) => (
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
                  Date Found: {item.dateFound.toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Contact: {item.contactInfo}
                </Typography>
                <Typography 
                  variant="body2" 
                  color={item.status === 'Available' ? 'success.main' : 'error.main'}
                  sx={{ mt: 1, fontWeight: 'bold' }}
                >
                  Status: {item.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <FoundItemForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </Container>
  );
};

export default FoundItems; 