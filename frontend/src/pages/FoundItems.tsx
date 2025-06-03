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
  const [foundItems, setFoundItems] = useState<FoundItemData[]>([]);

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