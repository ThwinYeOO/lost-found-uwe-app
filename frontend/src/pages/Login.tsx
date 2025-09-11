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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Box>
            {/* Back Button */}
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{
                mb: 3,
                color: 'white',
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
                  borderRadius: 4,
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {/* Header Section */}
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      p: 4,
                      textAlign: 'center',
                      color: 'white',
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <img
                        src="/uwe-logo.png"
                        alt="UWE Bristol Logo"
                        style={{
                          height: '50px',
                          width: 'auto',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                      Welcome Back
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Sign in to your UWE Lost & Found account
                    </Typography>
                  </Box>

                  {/* Form Section */}
                  <Box sx={{ p: 4 }}>
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
                              <Email sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          mb: 3,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
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
                              <Lock sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleTogglePasswordVisibility}
                                edge="end"
                                disabled={loading}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          mb: 3,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
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
                          py: 1.5,
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                          },
                          '&:disabled': {
                            background: 'rgba(0,0,0,0.12)',
                            color: 'rgba(0,0,0,0.26)',
                          },
                          transition: 'all 0.3s ease-in-out',
                        }}
                      >
                        {loading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </Box>

                    <Divider sx={{ my: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        OR
                      </Typography>
                    </Divider>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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