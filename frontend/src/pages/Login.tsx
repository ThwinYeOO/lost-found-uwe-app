import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Link,
} from '@mui/material';
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
      
      navigate('/'); // Redirect to home or dashboard
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="emailOrName"
            label="Email Address or Name"
            name="emailOrName"
            autoComplete="email"
            autoFocus
            value={formData.emailOrName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/register')}
            >
              Don't have an account? Sign Up
            </Link>
          </Box>
          {error && <Typography color="error" align="center">{error}</Typography>}
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 