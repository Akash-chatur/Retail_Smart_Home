import React, { useState } from 'react';
import { useUser } from '../UserManagement/UserContext';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './signup.css';  

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { addUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addUser(username, password, 'Customer')) {
      setError('');
      alert('User registered successfully!');
      //navigate('/products'); // Navigate to products page
    } else {
      setError('Username already exists');
    }
  };

  return (
    <Box className='singup-box' component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography className='signup-text' component="h1" variant="h4" align="center" gutterBottom>
        Sign up to start shopping
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        className='user-label'
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default Signup;