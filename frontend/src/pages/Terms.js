import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Terms = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Terms of Service
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          1. Acceptance of Terms
        </Typography>
        <Typography paragraph>
          By accessing and using the UWE Lost & Found Portal, you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. User Responsibilities
        </Typography>
        <Typography paragraph>
          Users are responsible for:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" paragraph>
            Providing accurate information when reporting lost or found items
          </Typography>
          <Typography component="li" paragraph>
            Maintaining the confidentiality of their account credentials
          </Typography>
          <Typography component="li" paragraph>
            Using the platform in accordance with UWE's code of conduct
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          3. Item Reporting
        </Typography>
        <Typography paragraph>
          When reporting items:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" paragraph>
            Provide accurate and detailed descriptions
          </Typography>
          <Typography component="li" paragraph>
            Include relevant location information
          </Typography>
          <Typography component="li" paragraph>
            Update the status when items are claimed or returned
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          4. Prohibited Activities
        </Typography>
        <Typography paragraph>
          Users must not:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" paragraph>
            Submit false or misleading information
          </Typography>
          <Typography component="li" paragraph>
            Use the platform for commercial purposes without authorization
          </Typography>
          <Typography component="li" paragraph>
            Attempt to access other users' personal information
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          5. Modifications
        </Typography>
        <Typography paragraph>
          UWE reserves the right to modify these terms at any time. Users will be notified of significant changes.
        </Typography>

        <Typography variant="h6" gutterBottom>
          6. Contact
        </Typography>
        <Typography paragraph>
          For questions about these terms, please contact us through the Contact Us page.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Terms; 