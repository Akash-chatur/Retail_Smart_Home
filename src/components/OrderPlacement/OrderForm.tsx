import React, { useState } from 'react';
import { TextField, Button, Typography, Select, MenuItem, Dialog, DialogContent, DialogActions, Box, Divider } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useOrder } from './OrderContext';
import { useAuth } from '../../context/AuthContext';
import { Accessory, Product, WarrantyOption } from '../../types/Product';

type CartItem = Product | Accessory | WarrantyOption;

interface OrderFormProps {
  clearCart: () => void;
  cart: CartItem[];
}

const OrderForm: React.FC<OrderFormProps> = ({ clearCart, cart }) => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    creditCard: '',
    deliveryMethod: 'home',
    storeLocation: '',
  });
  const { addOrder } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openRebateDialog, setOpenRebateDialog] = useState(false);
  const [rebateProducts, setRebateProducts] = useState<Product[] | Accessory[] | WarrantyOption[]>([]);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [orderInfo, setOrderInfo] = useState<{ confirmation: string; deliveryDate: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const confirmation = `CONF-${Date.now()}`;
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 14);

    if (user) {
      addOrder({
        id: Date.now(),
        userId: user.id,
        confirmation,
        deliveryDate: delivery.toDateString(),
        status: 'Processing',
      });

      const rebateItems = cart.filter(product =>
        'manufacturerRebate' in product && product.manufacturerRebate
      );

      setOrderInfo({ confirmation, deliveryDate: delivery.toDateString() });

      if (rebateItems.length > 0) {
        setRebateProducts(rebateItems);
        setOpenRebateDialog(true);  // Open the rebate dialog if rebate items exist
      } else {
        // No rebate items, show the confirmation dialog
        setConfirmationMessage(`Order placed! Confirmation: ${confirmation}, Delivery Date: ${delivery.toDateString()}`);
        setOpenRebateDialog(true);  // Open the dialog for confirmation
      }

      clearCart(); // Clear the cart after placing the order
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const storeLocations = [
    { id: 1, name: 'Store 1', zip: '12345' },
    { id: 2, name: 'Store 2', zip: '23456' },
    // Add more store locations
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>Order Details</Typography>
      <TextField label="Name" name="name" value={personalInfo.name} onChange={handleChange} fullWidth required /><br /><br />
      <TextField label="Address" name="address" value={personalInfo.address} onChange={handleChange} fullWidth required /><br /><br />
      <TextField label="City" name="city" value={personalInfo.city} onChange={handleChange} fullWidth required /><br /><br />
      <TextField label="State" name="state" value={personalInfo.state} onChange={handleChange} fullWidth required /><br /><br />
      <TextField label="Zip" name="zip" value={personalInfo.zip} onChange={handleChange} fullWidth required /><br /><br />
      <TextField label="Credit Card" name="creditCard" value={personalInfo.creditCard} onChange={handleChange} fullWidth required /><br /><br />
      <Select name="deliveryMethod" value={personalInfo.deliveryMethod} onChange={handleChange} fullWidth><br /><br />
        <MenuItem value="home">Home Delivery</MenuItem>
        <MenuItem value="store">Store Pickup</MenuItem>
      </Select>
      {personalInfo.deliveryMethod === 'store' && (
        <Select name="storeLocation" value={personalInfo.storeLocation} onChange={handleChange} fullWidth>
          {storeLocations.map((store) => (
            <MenuItem key={store.id} value={store.name}>{store.name} ({store.zip})</MenuItem>
          ))}
        </Select>
      )}<br /><br />
      <Button type="submit" variant="contained" color="primary">Place Order</Button><br /><br />
      <Button component={RouterLink} to="/cart" variant="outlined" color="secondary" sx={{ mr: 2 }}>
        Back to Cart
      </Button>
      <Button component={RouterLink} to="/products" variant="outlined" color="secondary">
        Back to Products
      </Button>

      {/* Dialog for Rebate Products or Confirmation */}
      <Dialog open={openRebateDialog} onClose={() => setOpenRebateDialog(false)}>
        <DialogContent>
          {rebateProducts.length > 0 ? (
            <>
              <Typography variant="h6" gutterBottom>Order Placed Successfully!</Typography>
              <Typography variant="body1" gutterBottom>
                Confirmation: {orderInfo?.confirmation}, Delivery Date: {orderInfo?.deliveryDate}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Manufacturer Rebate Details</Typography>
              <Box sx={{ mb: 2 }}>
                {rebateProducts.map(product => (
                  'manufacturerRebate' in product && (
                    <Box key={product.id} sx={{ mb: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2">
                        Cashback: ${product.manufacturerRebate}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </>
          ) : (
            <Typography variant="h6" gutterBottom>{confirmationMessage}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenRebateDialog(false);
            if (!rebateProducts.length) {
              navigate('/order-status');
            }
          }} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

    </form>
  );
};

export default OrderForm;
