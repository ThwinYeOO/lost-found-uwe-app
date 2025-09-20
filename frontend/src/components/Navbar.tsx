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
  PhoneAndroid as MobileIcon,
  Computer as DesktopIcon,
} from '@mui/icons-material';
import ChatHistory from './ChatHistory';
import { User } from '../types';
import { useAdmin } from '../contexts/AdminContext';
import { useMobileApp } from '../contexts/MobileAppContext';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAdmin, adminUser, logout: adminLogout, login: adminLogin } = useAdmin();
  const { showMobileApp, toggleMobileApp } = useMobileApp();
  
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
          background: 'linear-gradient(135deg, #c62828 0%, #d32f2f 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ 
            minHeight: { xs: '44px', md: '70px' }, 
            py: { xs: 0.25, md: 1 },
            px: { xs: 0.5, md: 2 },
          }}>
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
                    height: isSmallMobile ? '28px' : isMobile ? '32px' : '45px',
                    width: 'auto',
                    marginRight: isSmallMobile ? '6px' : isMobile ? '8px' : '16px',
                    objectFit: 'contain',
                    display: isMobile ? 'none' : 'block',
                  }}
                />
                <Typography
                  variant="h5"
                  component="span"
                  sx={{
                    fontWeight: 500,
                    background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.2px',
                    fontSize: { xs: '0.75rem', sm: '0.75rem', md: '1rem' },
                    display: { xs: 'block', sm: 'block' },
                    lineHeight: 1.1,
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

            {/* Mobile App Toggle Button */}
            {!isMobile && (
              <Tooltip title={showMobileApp ? "Switch to Desktop View" : "Switch to Mobile App View"} arrow>
                <IconButton
                  onClick={toggleMobileApp}
                  sx={{
                    color: 'white',
                    mr: 2,
                    backgroundColor: showMobileApp ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {showMobileApp ? <DesktopIcon /> : <MobileIcon />}
                </IconButton>
              </Tooltip>
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
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.5, sm: 0.75, md: 1 },
              flexWrap: 'nowrap'
            }}>
              {isLoggedIn ? (
                <>
                  {/* Chat Button - Hide on very small mobile to save space */}
                  {!isSmallMobile && (
                    <Tooltip title="Messages" arrow>
                      <IconButton
                        onClick={() => setChatHistoryOpen(true)}
                        sx={{
                          color: 'white',
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          minHeight: { xs: 36, sm: 38, md: 40 },
                          minWidth: { xs: 36, sm: 38, md: 40 },
                          p: { xs: 0.5, sm: 0.75, md: 1 },
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.2)',
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <MessageIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {/* Profile Button */}
                  <Tooltip title="Account" arrow>
                    <IconButton
                      onClick={handleMenu}
                      sx={{
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        minHeight: { xs: 36, sm: 38, md: 40 },
                        minWidth: { xs: 36, sm: 38, md: 40 },
                        p: { xs: 0.5, sm: 0.75, md: 1 },
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.2)',
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      <AccountCircle sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Button
                  component={RouterLink}
                  to="/login"
                  startIcon={<LoginIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />}
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    px: { xs: 1.5, sm: 2, md: 3 },
                    py: { xs: 0.5, sm: 0.75, md: 1 },
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                    minHeight: { xs: 36, sm: 38, md: 40 },
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  Login
                </Button>
              )}

              {/* Mobile Menu Button - Always show on mobile */}
              {isMobile && (
                <Tooltip title="Menu" arrow>
                  <IconButton
                    onClick={handleMobileDrawerToggle}
                    sx={{
                      color: 'white',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      minHeight: { xs: 36, sm: 38 },
                      minWidth: { xs: 36, sm: 38 },
                      p: { xs: 0.5, sm: 0.75 },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <MenuIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </IconButton>
                </Tooltip>
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
                background: 'rgba(198, 40, 40, 0.1)',
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
                  background: 'rgba(198, 40, 40, 0.1)',
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
            background: 'linear-gradient(135deg, #c62828 0%, #d32f2f 100%)',
            color: 'white',
            width: { xs: '85vw', sm: 320, md: 360 },
            maxWidth: 360,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
            Menu
          </Typography>
          <IconButton 
            onClick={handleMobileDrawerClose} 
            sx={{ 
              color: 'white',
              minHeight: 44,
              minWidth: 44,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        <List sx={{ py: 1 }}>
          {/* Chat option for small mobile when chat button is hidden */}
          {isLoggedIn && isSmallMobile && (
            <ListItem
              onClick={() => {
                setChatHistoryOpen(true);
                handleMobileDrawerClose();
              }}
              sx={{
                color: 'white',
                py: 2,
                px: 2,
                minHeight: 56,
                cursor: 'pointer',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
                '&:active': {
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItem>
          )}
          
          {navigationItems.map((item) => (
            <ListItem
              key={item.path}
              component={RouterLink}
              to={item.path}
              onClick={handleMobileDrawerClose}
              sx={{
                color: 'white',
                py: 2,
                px: 2,
                minHeight: 56,
                background: isActiveRoute(item.path) 
                  ? 'rgba(255, 255, 255, 0.15)' 
                  : 'transparent',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
                '&:active': {
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 48 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActiveRoute(item.path) ? 600 : 400,
                  fontSize: '1rem',
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
                  py: 2,
                  px: 2,
                  minHeight: 56,
                  background: isActiveRoute('/admin') 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'transparent',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:active': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 48 }}>
                  <AdminIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Admin Dashboard"
                  primaryTypographyProps={{
                    fontWeight: isActiveRoute('/admin') ? 600 : 400,
                    fontSize: '1rem',
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