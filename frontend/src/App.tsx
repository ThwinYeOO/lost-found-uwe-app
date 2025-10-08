import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AppRouter from './components/AppRouter';
import { AdminProvider } from './contexts/AdminContext';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationManager from './components/NotificationManager';
import { Message, User } from './types';

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        if (e.newValue) {
          try {
            setCurrentUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error('Error parsing user from storage:', error);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleViewMessage = (message: Message) => {
    // Open chat with the sender
    if ((window as any).openChatWithUser) {
      // Get sender user data
      const senderUser = {
        id: message.senderId,
        name: message.senderName || 'Unknown User',
        email: message.senderEmail || '',
        avatar: message.senderAvatar || '',
      };
      (window as any).openChatWithUser(senderUser);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <AdminProvider>
          <NotificationProvider currentUser={currentUser}>
            <Router>
              <AppRouter />
              <NotificationManager onViewMessage={handleViewMessage} />
            </Router>
          </NotificationProvider>
        </AdminProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App; 