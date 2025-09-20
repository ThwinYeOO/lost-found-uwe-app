import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Link,
  Fade,
  Zoom,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  School,
  Login as LoginIcon,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/firestore';
import { useAdmin } from '../contexts/AdminContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: adminLogin } = useAdmin();
  const [formData, setFormData] = useState({
    emailOrName: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const user = await loginUser(formData.emailOrName, formData.password);
      console.log('Login - User logged in:', user);
      
      // Store user info in localStorage/session if needed
      localStorage.setItem('user', JSON.stringify(user));
      
      // If user is admin, update admin context
      if (user.role === 'admin') {
        console.log('Login - Admin user detected, updating admin context');
        adminLogin(user);
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/'); // Redirect to home or dashboard
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'center',
        py: { xs: 1, sm: 4 },
        px: { xs: 1, sm: 2 },
        position: 'relative',
        overflow: 'auto',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
          `,
          animation: 'float 20s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 25s ease-in-out infinite reverse',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
        },
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 0, sm: 3, md: 4 }, width: '100%' }}>
        <Fade in timeout={800}>
          <Box sx={{ width: '100%' }}>
            {/* Back Button */}
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{
                mb: { xs: 2, sm: 3 },
                color: 'white',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 0.5, sm: 1 },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Back to Home
            </Button>

            {/* Main Login Card */}
            <Zoom in timeout={1000}>
              <Card
                elevation={24}
                sx={{
                  borderRadius: { xs: 3, md: 4 },
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
                    animation: 'shimmer 3s ease-in-out infinite',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 100,
                    height: 100,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'pulse 4s ease-in-out infinite',
                  },
                  '@keyframes shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                  },
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: 0.5 },
                    '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {/* Header Section */}
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                      p: { xs: 2, sm: 3, md: 4 },
                      textAlign: 'center',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="20" cy="20" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        animation: 'float 15s ease-in-out infinite',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 50, sm: 70, md: 80 },
                        height: { xs: 50, sm: 70, md: 80 },
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: { xs: 1, sm: 2 },
                        backdropFilter: 'blur(15px)',
                        border: '2px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        position: 'relative',
                        zIndex: 1,
                        '&:hover': {
                          transform: 'scale(1.05)',
                          transition: 'transform 0.3s ease',
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src="/uwe-logo.png"
                        alt="UWE Bristol Logo"
                        sx={{
                          height: { xs: '30px', sm: '50px' },
                          width: 'auto',
                          objectFit: 'contain',
                          display: { xs: 'none', md: 'block' },
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="h4" 
                      component="h1" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: { xs: 0.5, sm: 1 },
                        fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.125rem' },
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      Welcome Back
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        opacity: 0.9,
                        fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                        lineHeight: 1.6,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      Sign in to your UWE Lost & Found account
                    </Typography>
                  </Box>

                  {/* Form Section */}
                  <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    {success && (
                      <Alert
                        severity="success"
                        icon={<CheckCircle />}
                        sx={{ mb: 3, borderRadius: 2 }}
                      >
                        Login successful! Redirecting...
                      </Alert>
                    )}

                    {error && (
                      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                      </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                      <TextField
                        fullWidth
                        required
                        id="emailOrName"
                        label="Email Address or Name"
                        name="emailOrName"
                        autoComplete="email"
                        autoFocus
                        value={formData.emailOrName}
                        onChange={handleChange}
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: 'primary.main', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          mb: { xs: 2, sm: 3 },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                            },
                            '&.Mui-focused': {
                              backgroundColor: 'rgba(255,255,255,0.95)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'text.secondary',
                            fontWeight: 500,
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        required
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: 'primary.main', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleTogglePasswordVisibility}
                                edge="end"
                                disabled={loading}
                                sx={{ 
                                  color: 'primary.main',
                                  '&:hover': {
                                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                  },
                                }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          mb: { xs: 2, sm: 3 },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                            },
                            '&.Mui-focused': {
                              backgroundColor: 'rgba(255,255,255,0.95)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'text.secondary',
                            fontWeight: 500,
                          },
                        }}
                      />

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                        sx={{
                          py: { xs: 1.2, sm: 1.5 },
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            transition: 'left 0.5s',
                          },
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 50%, #e085f0 100%)',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
                            '&::before': {
                              left: '100%',
                            },
                          },
                          '&:active': {
                            transform: 'translateY(-1px)',
                          },
                          '&:disabled': {
                            background: 'rgba(0,0,0,0.12)',
                            color: 'rgba(0,0,0,0.26)',
                            boxShadow: 'none',
                            transform: 'none',
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        {loading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </Box>

                    <Divider sx={{ my: { xs: 2, sm: 3 } }}>
                      <Typography variant="body2" color="text.secondary">
                        OR
                      </Typography>
                    </Divider>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 0.5, sm: 1 } }}>
                        Don't have an account?
                      </Typography>
                      <Link
                        component="button"
                        variant="body1"
                        onClick={() => navigate('/register')}
                        sx={{
                          fontWeight: 600,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Create New Account
                      </Link>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login; 