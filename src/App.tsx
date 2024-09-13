// src/App.tsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container, Paper, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const AuthenticatedApp: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SmartHomes
          </Typography>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to SmartHomes, {user?.username}!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Role: {user?.role}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

const UnauthenticatedApp: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          SmartHomes
        </Typography>
        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup
            color="primary"
            value={showLogin}
            exclusive
            onChange={(_, newValue) => setShowLogin(newValue)}
            aria-label="auth mode"
            fullWidth
          >
            <ToggleButton value={true}>Login</ToggleButton>
            <ToggleButton value={false}>Signup</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {showLogin ? <Login /> : <Signup />}
      </Paper>
    </Container>
  );
};

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </ThemeProvider>
  );
};

const AppWithAuth: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;