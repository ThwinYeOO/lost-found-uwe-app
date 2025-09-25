import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AppRouter from './components/AppRouter';
import { AdminProvider } from './contexts/AdminContext';

// Create theme with mobile-first approach
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    // Mobile-optimized typography
    h1: {
      fontSize: '2rem',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
      '@media (min-width:960px)': {
        fontSize: '3rem',
      },
    },
    h2: {
      fontSize: '1.75rem',
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
      '@media (min-width:960px)': {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontSize: '1.5rem',
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
      '@media (min-width:960px)': {
        fontSize: '2rem',
      },
    },
    body1: {
      fontSize: '1rem',
      '@media (min-width:600px)': {
        fontSize: '1.1rem',
      },
    },
  },
  components: {
    // Mobile-optimized button components
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: '44px',
          '@media (min-width:600px)': {
            minHeight: '36px',
          },
        },
      },
    },
    // Mobile-optimized icon button components
    MuiIconButton: {
      styleOverrides: {
        root: {
          minHeight: '44px',
          minWidth: '44px',
          '@media (min-width:600px)': {
            minHeight: '40px',
            minWidth: '40px',
          },
        },
      },
    },
    // Mobile-optimized dialog components
    MuiDialog: {
      styleOverrides: {
        paper: {
          margin: '16px',
          '@media (min-width:600px)': {
            margin: '32px',
          },
        },
      },
    },
    // Mobile-optimized text field components
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontSize: '16px', // Prevents zoom on iOS
            '@media (min-width:600px)': {
              fontSize: '1rem',
            },
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <AdminProvider>
          <Router>
            <AppRouter />
          </Router>
        </AdminProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App; 