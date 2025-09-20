import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
  useMediaQuery,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';

interface MobileAppLayoutProps {
  children: React.ReactNode;
}

const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Check authentication state
  const isLoggedIn = !!localStorage.getItem('user');
  const currentUser: User | null = isLoggedIn ? JSON.parse(localStorage.getItem('user')!) : null;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    handleClose();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/lost-items') return 1;
    if (path === '/found-items') return 2;
    if (path === '/profile' || path === '/user-profile') return 3;
    return 0;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/lost-items');
        break;
      case 2:
        navigate('/found-items');
        break;
      case 3:
        navigate(isLoggedIn ? '/profile' : '/login');
        break;
    }
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Lost Items', icon: <SearchIcon />, path: '/lost-items' },
    { text: 'Found Items', icon: <AddIcon />, path: '/found-items' },
    { text: 'Profile', icon: <PersonIcon />, path: isLoggedIn ? '/profile' : '/login' },
    { text: 'Messages', icon: <MessageIcon />, path: '/messages' },
    { text: 'Help', icon: <HelpIcon />, path: '/help' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Mobile App Header */}
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: '#d32f2f',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: '56px', px: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            UWE Lost & Found
          </Typography>

          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {isLoggedIn ? (
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                {currentUser?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{ ml: 1 }}
            >
              <LoginIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile App Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: '#f5f5f5',
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
          },
        }}
      >
        <Box sx={{ p: 2, backgroundColor: '#d32f2f', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Menu
            </Typography>
            <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          {isLoggedIn && currentUser && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                {currentUser.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {currentUser.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {currentUser.email}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.08)',
                },
                ...(location.pathname === item.path && {
                  backgroundColor: 'rgba(211, 47, 47, 0.12)',
                  '& .MuiListItemIcon-root': {
                    color: '#d32f2f',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#d32f2f',
                    fontWeight: 600,
                  },
                }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        {isLoggedIn && (
          <>
            <Divider sx={{ my: 1 }} />
            <List>
              <ListItem
                onClick={handleLogout}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  mx: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </>
        )}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: '56px', // Account for fixed AppBar
          pb: '80px', // Account for fixed BottomNavigation
          minHeight: 'calc(100vh - 136px)',
          backgroundColor: '#fafafa',
        }}
      >
        {children}
      </Box>

      {/* Mobile App Bottom Navigation */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar,
          borderTop: '1px solid #e0e0e0',
        }}
        elevation={3}
      >
        <BottomNavigation
          value={getCurrentTab()}
          onChange={handleTabChange}
          showLabels
          sx={{
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 0 8px',
              '&.Mui-selected': {
                color: '#d32f2f',
              },
            },
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Lost"
            icon={<SearchIcon />}
          />
          <BottomNavigationAction
            label="Found"
            icon={<AddIcon />}
          />
          <BottomNavigationAction
            label="Profile"
            icon={<PersonIcon />}
          />
        </BottomNavigation>
      </Paper>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MobileAppLayout;
