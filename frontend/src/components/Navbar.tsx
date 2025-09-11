import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AccountCircle, Message as MessageIcon, AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import ChatHistory from './ChatHistory';
import { User } from '../types';
import { useAdmin } from '../contexts/AdminContext';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, adminUser, logout: adminLogout, login: adminLogin } = useAdmin();
  
  // Check authentication state based on localStorage
  const isLoggedIn = !!localStorage.getItem('user');
  const currentUser: User | null = isLoggedIn ? JSON.parse(localStorage.getItem('user')!) : null;

  // Sync admin context when user logs in
  useEffect(() => {
    console.log('Navbar - currentUser:', currentUser);
    console.log('Navbar - isAdmin:', isAdmin);
    if (currentUser) {
      if (currentUser.role === 'admin' && !isAdmin) {
        console.log('Navbar - Logging in admin user:', currentUser);
        adminLogin(currentUser);
      } else if (currentUser.role !== 'admin' && isAdmin) {
        console.log('Navbar - Non-admin user detected, clearing admin context');
        adminLogin(currentUser); // This will clear admin context
      }
    } else if (isAdmin) {
      console.log('Navbar - No user logged in, clearing admin context');
      adminLogin({} as User); // This will clear admin context
    }
  }, [currentUser, isAdmin, adminLogin]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data from localStorage
    adminLogout(); // Clear admin context
    handleClose(); // Close the menu
    navigate('/login'); // Redirect to login page
  };

  const handleAdminLogout = () => {
    adminLogout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img
              src="/uwe-logo.png"
              alt="UWE Bristol Logo"
              style={{
                height: '40px',
                width: 'auto',
                marginRight: '12px',
                objectFit: 'contain'
              }}
            />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              UWE Lost & Found
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/lost"
            >
              Lost Items
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/found"
            >
              Found Items
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/about"
            >
              About Us
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/faq"
            >
              FAQ
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/team"
            >
              Team
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/contact"
            >
              Contact Us
            </Button>
            {isAdmin && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/admin"
                startIcon={<AdminIcon />}
              >
                Admin
              </Button>
            )}
            {isLoggedIn ? (
              <>
                <IconButton
                  size="large"
                  aria-label="chat history"
                  onClick={() => setChatHistoryOpen(true)}
                  color="inherit"
                  sx={{ mr: 1 }}
                >
                  <MessageIcon />
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={handleClose}
                  >
                    Profile
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem
                      component={RouterLink}
                      to="/admin"
                      onClick={handleClose}
                    >
                      <AdminIcon sx={{ mr: 1 }} />
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Chat History Dialog */}
      {currentUser && (
        <ChatHistory
          open={chatHistoryOpen}
          onClose={() => setChatHistoryOpen(false)}
          currentUser={currentUser}
        />
      )}
    </AppBar>
  );
};

export default Navbar; 