import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrderProvider } from './components/OrderPlacement/OrderContext';
import { UserProvider } from './components/UserManagement/UserContext';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import ProductManagement from './components/ProductManagement/ProductManagement';
import CustomerView from './components/CustomerView/CustomerView';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import OrderForm from './components/OrderPlacement/OrderForm';
import OrderStatus from './components/OrderPlacement/OrderStatus';
import ManageUsers from './components/UserManagement/ManageUsers';
import { Accessory, Product, WarrantyOption } from './types/Product';

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

type CartItem = Product | Accessory | WarrantyOption;

const AuthenticatedApp: React.FC = () => {
  const { user, logout } = useAuth();
  const [cart, setCart] = React.useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const clearCart = () => setCart([]);
  const addToCart = (item: CartItem) => {
    setCart([...cart, item]);
  };
  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
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
            {user?.role === 'Salesman' && (
              <Route path="/manage-users" element={<ManageUsers />} />
            )}
            {user?.role === 'Customer' && (
              <>
                <Route path="/products" element={<CustomerView addToCart={addToCart} />} />
                <Route path="/cart" element={<ShoppingCart cart={cart} removeFromCart={removeFromCart} />} />
                <Route path="/order" element={<OrderForm clearCart={clearCart} />} />
                <Route path="/order-status" element={<OrderStatus />} />
              </>
            )}
            <Route path="*" element={<Navigate to={user?.role === 'Customer' ? "/products" : user?.role === 'Salesman' ? "/manage-users" : "/manage-products"} />} />
          </Routes>
        </Box>
      </Container>
    </Box>
  );
};

const UnauthenticatedApp: React.FC = () => {
  const [showLogin, setShowLogin] = React.useState(true);

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
  <Router>
    <AuthProvider>
      <OrderProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </OrderProvider>
    </AuthProvider>
  </Router>
);

export default AppWithAuth;