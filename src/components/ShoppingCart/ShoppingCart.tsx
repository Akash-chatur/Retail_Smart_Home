import React from 'react';
import { Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Product } from '../../types/Product';

interface ShoppingCartProps {
  cart: Product[];
  removeFromCart: (productId: number) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cart, removeFromCart }) => {
  const total = cart.reduce((sum, product) => sum + product.price, 0);

  return (
    <>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <List>
        {cart.map((product) => (
          <ListItem key={product.id}>
            <ListItemText
              primary={product.name}
              secondary={`$${product.price.toFixed(2)}`}
            />
            <Button onClick={() => removeFromCart(product.id)}>Remove</Button>
          </ListItem>
        ))}
      </List>
      <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
      <Button
        component={RouterLink}
        to="/products"
        variant="outlined"
        color="primary"
        sx={{ mr: 2 }}
      >
        Continue Shopping
      </Button>
      <Button
        component={RouterLink}
        to="/order"
        variant="contained"
        color="primary"
      >
        Proceed to Checkout
      </Button>
    </>
  );
};

export default ShoppingCart;