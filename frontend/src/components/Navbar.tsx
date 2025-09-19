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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip,
  Fade,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  AccountCircle, 
  Message as MessageIcon, 
  AdminPanelSettings as AdminIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Help as HelpIcon,
  Group as GroupIcon,
  ContactMail as ContactIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import ChatHistory from './ChatHistory';
import { User } from '../types';
import { useAdmin } from '../contexts/AdminContext';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleMobileDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { label: 'Lost Items', path: '/lost', icon: <SearchIcon /> },
    { label: 'Found Items', path: '/found', icon: <SearchIcon /> },
    { label: 'About Us', path: '/about', icon: <HomeIcon /> },
    { label: 'FAQ', path: '/faq', icon: <HelpIcon /> },
    { label: 'Team', path: '/team', icon: <GroupIcon /> },
    { label: 'Contact Us', path: '/contact', icon: <ContactIcon /> },
  ];

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: '70px', py: 1 }}>
            {/* Logo and Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <img
                  src="/uwe-logo.png"
                  alt="UWE Bristol Logo"
                  style={{
                    height: '45px',
                    width: 'auto',
                    marginRight: '16px',
                    objectFit: 'contain',
                  }}
                />
                <Typography
                  variant="h5"
                  component="span"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.5px',
                  }}
                >
                  UWE Lost & Found
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mr: 2 }}>
                {navigationItems.map((item) => (
                  <Tooltip key={item.path} title={item.label} arrow>
                    <Button
                      component={RouterLink}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        color: 'white',
                        fontWeight: isActiveRoute(item.path) ? 600 : 400,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        background: isActiveRoute(item.path) 
                          ? 'rgba(255, 255, 255, 0.15)' 
                          : 'transparent',
                        backdropFilter: isActiveRoute(item.path) ? 'blur(10px)' : 'none',
                        border: isActiveRoute(item.path) 
                          ? '1px solid rgba(255, 255, 255, 0.2)' 
                          : '1px solid transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  </Tooltip>
                ))}
              </Box>
            )}

            {/* Admin Button */}
            {isAdmin && !isMobile && (
              <Chip
                icon={<AdminIcon />}
                label="Admin"
                component={RouterLink}
                to="/admin"
                clickable
                sx={{
                  mr: 2,
                  background: 'linear-gradient(45deg, #ff6b6b 30%, #ee5a24 90%)',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ff5252 30%, #e74c3c 90%)',
                    transform: 'scale(1.05)',
                  },
                }}
              />
            )}

            {/* User Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isLoggedIn ? (
                <>
                  <Tooltip title="Messages" arrow>
                    <IconButton
                      onClick={() => setChatHistoryOpen(true)}
                      sx={{
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.2)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <MessageIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Account" arrow>
                    <IconButton
                      onClick={handleMenu}
                      sx={{
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.2)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <AccountCircle />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Button
                  component={RouterLink}
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  Login
                </Button>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  onClick={handleMobileDrawerToggle}
                  sx={{
                    color: 'white',
                    ml: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>

        {/* User Menu */}
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
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              minWidth: 200,
            },
          }}
        >
          <MenuItem
            component={RouterLink}
            to="/profile"
            onClick={handleClose}
            sx={{
              py: 1.5,
              '&:hover': {
                background: 'rgba(30, 60, 114, 0.1)',
              },
            }}
          >
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MenuItem>
          {isAdmin && (
            <MenuItem
              component={RouterLink}
              to="/admin"
              onClick={handleClose}
              sx={{
                py: 1.5,
                '&:hover': {
                  background: 'rgba(30, 60, 114, 0.1)',
                },
              }}
            >
              <ListItemIcon>
                <AdminIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Admin Dashboard" />
            </MenuItem>
          )}
          <Divider />
          <MenuItem 
            onClick={handleLogout}
            sx={{
              py: 1.5,
              color: 'error.main',
              '&:hover': {
                background: 'rgba(244, 67, 54, 0.1)',
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerClose}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white',
            width: 280,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Menu
          </Typography>
          <IconButton onClick={handleMobileDrawerClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        <List>
          {navigationItems.map((item) => (
            <ListItem
              key={item.path}
              component={RouterLink}
              to={item.path}
              onClick={handleMobileDrawerClose}
              sx={{
                color: 'white',
                py: 1.5,
                px: 2,
                background: isActiveRoute(item.path) 
                  ? 'rgba(255, 255, 255, 0.15)' 
                  : 'transparent',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActiveRoute(item.path) ? 600 : 400,
                }}
              />
            </ListItem>
          ))}
          {isAdmin && (
            <>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 1 }} />
              <ListItem
                component={RouterLink}
                to="/admin"
                onClick={handleMobileDrawerClose}
                sx={{
                  color: 'white',
                  py: 1.5,
                  px: 2,
                  background: isActiveRoute('/admin') 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'transparent',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <AdminIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Admin Dashboard"
                  primaryTypographyProps={{
                    fontWeight: isActiveRoute('/admin') ? 600 : 400,
                  }}
                />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
      
      {/* Chat History Dialog */}
      {currentUser && (
        <ChatHistory
          open={chatHistoryOpen}
          onClose={() => setChatHistoryOpen(false)}
          currentUser={currentUser}
        />
      )}
    </>
  );
};

export default Navbar; 