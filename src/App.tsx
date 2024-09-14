// src/App.tsx
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container, Paper, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ProductManagement from './components/ProductManagement/ProductManagement';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import CustomerView from './components/CustomerView/CustomerView';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import { Product } from './types/Product';
import OrderForm from './components/OrderPlacement/OrderForm';
import { OrderProvider } from './components/OrderPlacement/OrderContext';
import OrderStatus from './components/OrderPlacement/OrderStatus';

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
  
  const [cart, setCart] = useState<Product[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              SmartHomes
            </Typography>
            {user?.role === 'Customer' && (
              <Button color="inherit" component={Link} to="/cart">Cart ({cart.length})</Button>
            )}
            <Button color="inherit" onClick={logout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to SmartHomes, {user?.username}!
            </Typography>
            <Typography variant="h6" gutterBottom>
              Role: {user?.role}
            </Typography>
            <Routes>
              {user?.role === 'Store Manager' && (
                <Route path="/manage-products" element={<ProductManagement />} />
              )}
              {user?.role === 'Customer' && (
                <>
                  <Route path="/products" element={<CustomerView addToCart={addToCart} />} />
                  <Route path="/cart" element={<ShoppingCart cart={cart} removeFromCart={removeFromCart} />} />
                  <Route path="/order" element={<OrderForm />} />
                  <Route path="/order-status" element={<OrderStatus />} />
                </>
              )}
              <Route path="*" element={<Navigate to={user?.role === 'Customer' ? "/products" : "/manage-products"} />} />
            </Routes>
          </Box>
        </Container>
      </Box>
    </Router>
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
    <OrderProvider>
      <App />
    </OrderProvider>
  </AuthProvider>
);

export default AppWithAuth;