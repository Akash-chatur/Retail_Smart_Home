import React, { useState } from 'react';
import { useUser } from '../UserManagement/UserContext';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { addUser } = useUser();
  const navigate = useNavigate();

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (addUser(username, password, 'Customer')) {
  //     setError('');
  //     alert('User registered successfully!');
  //     //navigate('/products'); // Navigate to products page
  //   } else {
  //     setError('Username already exists');
  //   }
  // };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log("test username = "+username);
    console.log("test password = "+password);
    
    try {
      const response = await fetch('http://localhost:8082/MyServletProject/UserServlet', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          role: 'Customer'
        })
      });
      

      const result = await response.json();
      if (result.status === 'success') {
        setError('');
        alert(result.message);
        // navigate('/products'); // Uncomment this to redirect
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred during signup');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        Sign Up
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