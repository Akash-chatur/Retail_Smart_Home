import React from 'react';
import { Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Accessory, Product, WarrantyOption } from '../../types/Product';

type CartItem = Product | Accessory | WarrantyOption;

interface ShoppingCartProps {
  cart: CartItem[];
  removeFromCart: (itemId: number) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cart, removeFromCart }) => {
  // Calculate total with discounts applied
  const total = cart.reduce((sum, item) => {
    if ('specialDiscount' in item && item.specialDiscount) {
      return sum + (item.price - item.specialDiscount);
    }
    return sum + item.price;
  }, 0);

  return (
    <>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <List>
        {cart.map((item) => (
          <ListItem key={item.id}>
            <ListItemText
              primary={item.name}
              secondary={
                'specialDiscount' in item && item.specialDiscount ? (
                  <>
                    <Typography variant="body2" color="primary">
                      ${(item.price - item.specialDiscount).toFixed(2)}
                    </Typography>
                  </>
                ) : (
                  `$${item.price.toFixed(2)}`
                )
              }
            />
            <Button onClick={() => removeFromCart(item.id)}>Remove</Button>
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