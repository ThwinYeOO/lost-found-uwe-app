import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Privacy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Privacy Policy
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          1. Information We Collect
        </Typography>
        <Typography paragraph>
          We collect the following types of information:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" paragraph>
            Personal information (name, email, student ID)
          </Typography>
          <Typography component="li" paragraph>
            Lost and found item details
          </Typography>
          <Typography component="li" paragraph>
            Communication records
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          2. How We Use Your Information
        </Typography>
        <Typography paragraph>
          Your information is used to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" paragraph>
            Process lost and found item reports
          </Typography>
          <Typography component="li" paragraph>
            Facilitate item returns
          </Typography>
          <Typography component="li" paragraph>
            Communicate with you about your reports
          </Typography>
          <Typography component="li" paragraph>
            Improve our services
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          3. Information Sharing
        </Typography>
        <Typography paragraph>
          We may share your information with:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" paragraph>
            UWE staff and administrators
          </Typography>
          <Typography component="li" paragraph>
            Law enforcement when required by law
          </Typography>
          <Typography component="li" paragraph>
            Other users only with your consent
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          4. Data Security
        </Typography>
        <Typography paragraph>
          We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Your Rights
        </Typography>
        <Typography paragraph>
          You have the right to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" paragraph>
            Access your personal information
          </Typography>
          <Typography component="li" paragraph>
            Request corrections to your data
          </Typography>
          <Typography component="li" paragraph>
            Delete your account and associated data
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          6. Contact
        </Typography>
        <Typography paragraph>
          For privacy-related inquiries, please contact us through the Contact Us page.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Privacy; 