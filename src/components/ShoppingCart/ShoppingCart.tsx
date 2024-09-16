import React from 'react';
import {
  Typography, Grid, Card, CardContent, CardActions, IconButton, Button, Divider, Box, Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type CartItem = {
  id: number;
  name: string;
  price: number;
  specialDiscount?: number;
  quantity: number;
};

interface ShoppingCartProps {
  cart: CartItem[];
  removeFromCart: (itemId: number) => void;
  updateCartQuantity: (itemId: number, newQuantity: number) => void; 
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cart, removeFromCart, updateCartQuantity }) => {
  // Calculate total with discounts and quantities applied
  const total = cart.reduce((sum, item) => {
    const price = item.specialDiscount ? item.price - item.specialDiscount : item.price;
    return sum + (price * (item.quantity || 0));
}, 0);


  // Handle item removal with toast
  const handleRemoveFromCart = (item: CartItem) => {
    removeFromCart(item.id);
    toast.success(`${item.name} has been removed from the cart!`);
  };

  // Handle quantity change
  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(item);
    } else {
      updateCartQuantity(item.id, newQuantity);
    }
  };

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 1200, px: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ShoppingCartIcon sx={{ fontSize: 36, mr: 2 }} />
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        {cart.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3, boxShadow: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Your cart is empty.
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Add some products to start shopping!
              </Typography>
              <Button
                component={RouterLink}
                to="/products"
                variant="contained"
                color="primary"
                sx={{ mt: 3, borderRadius: 2 }}
              >
                Go to Products Page
              </Button>
            </Card>
          </Grid>
        ) : (
          <>
            {cart.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: 5 },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.name || 'No description available.'}
                    </Typography>

                    {'specialDiscount' in item && item.specialDiscount ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: 'line-through' }}
                        >
                          ${item.price.toFixed(2)}
                        </Typography>
                        <Chip
                          label={`${((item.specialDiscount / item.price) * 100).toFixed(0)}% off`}
                          size="small"
                        />
                        <Typography variant="h6" color="primary">
                          ${(item.price - item.specialDiscount).toFixed(2)}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="h6" color="text.primary">
                        ${item.price.toFixed(2)}
                      </Typography>
                    )}

                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                      <Button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        variant="outlined"
                        sx={{ minWidth: '40px' }}
                      >
                        -
                      </Button>
                      <Typography variant="body1" sx={{ mx: 2 }}>
                        {item.quantity}
                      </Typography>
                      <Button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        variant="outlined"
                        sx={{ minWidth: '40px' }}
                      >
                        +
                      </Button>
                    </Box>
                  </CardContent>

                  <CardActions>
                    <IconButton onClick={() => handleRemoveFromCart(item)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}

            {/* Order Summary Section */}
            <Grid item xs={12}>
              <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Order Summary
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </Typography>

                  <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <span>Shipping</span>
                    <span>Free</span>
                  </Typography>

                  <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <span>Tax</span>
                    <span>${(total * 0.07).toFixed(2)}</span>
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography
                    variant="h6"
                    sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}
                  >
                    <span>Total</span>
                    <span>${(total * 1.07).toFixed(2)}</span>
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/products"
                    variant="outlined"
                    color="primary"
                    sx={{ borderRadius: 2, mr: 2 }}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/order"
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 2 }}
                  >
                    Proceed to Checkout
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      {/* Toast Container for notifications */}
      <ToastContainer />
    </Box>
  );
};

export default ShoppingCart;
