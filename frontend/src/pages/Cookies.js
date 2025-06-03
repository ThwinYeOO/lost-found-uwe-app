import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Switch, FormControlLabel, Button } from '@mui/material';

const Cookies = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always enabled
    analytics: true,
    preferences: true,
    marketing: false
  });

  const handleToggle = (cookieType) => {
    if (cookieType === 'essential') return; // Essential cookies cannot be disabled
    setCookiePreferences(prev => ({
      ...prev,
      [cookieType]: !prev[cookieType]
    }));
  };

  const handleSavePreferences = () => {
    // In a real application, this would save preferences to localStorage or a cookie
    alert('Cookie preferences saved!');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Cookie Management
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          About Cookies
        </Typography>
        <Typography paragraph>
          Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience and enable certain features to work properly.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Cookie Preferences
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={cookiePreferences.essential}
                disabled
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="subtitle1">Essential Cookies</Typography>
                <Typography variant="body2" color="text.secondary">
                  Required for the website to function properly. Cannot be disabled.
                </Typography>
              </Box>
            }
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={cookiePreferences.analytics}
                onChange={() => handleToggle('analytics')}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="subtitle1">Analytics Cookies</Typography>
                <Typography variant="body2" color="text.secondary">
                  Help us understand how visitors interact with our website.
                </Typography>
              </Box>
            }
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={cookiePreferences.preferences}
                onChange={() => handleToggle('preferences')}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="subtitle1">Preference Cookies</Typography>
                <Typography variant="body2" color="text.secondary">
                  Remember your settings and preferences for a better experience.
                </Typography>
              </Box>
            }
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={cookiePreferences.marketing}
                onChange={() => handleToggle('marketing')}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="subtitle1">Marketing Cookies</Typography>
                <Typography variant="body2" color="text.secondary">
                  Used to deliver relevant advertisements and track marketing campaign performance.
                </Typography>
              </Box>
            }
          />
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSavePreferences}
            size="large"
          >
            Save Preferences
          </Button>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          More Information
        </Typography>
        <Typography paragraph>
          For more information about how we use cookies and your data, please visit our Privacy Policy page.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Cookies; 