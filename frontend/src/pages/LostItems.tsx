import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
} from '@mui/material';

const LostItems: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Lost Items
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Button variant="contained" color="primary">
          Report Lost Item
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Example lost item card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://via.placeholder.com/140"
              alt="Lost item"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Lost Item Title
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Description of the lost item. This is where you would put details about the item.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Location: UWE Frenchay Campus
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date Lost: 2024-03-20
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LostItems; 