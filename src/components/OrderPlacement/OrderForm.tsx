import React, { useState } from 'react';
import {
  TextField, Button, Typography, Select, MenuItem, Dialog, DialogContent, DialogActions, Box, Divider, Card, CardContent, Grid, Stepper, Step, StepLabel, Snackbar, Alert
} from '@mui/material';
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const { addOrder } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openRebateDialog, setOpenRebateDialog] = useState(false);
  const [rebateProducts, setRebateProducts] = useState<Product[] | Accessory[] | WarrantyOption[]>([]);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [orderInfo, setOrderInfo] = useState<{ confirmation: string; deliveryDate: string } | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Personal Information', 'Delivery Method', 'Payment Details'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setToastMessage('Please fill in all required fields.');
      setShowToast(true);
      return;
    }

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
        setOpenRebateDialog(true);
      } else {
        setConfirmationMessage(`Order placed! Confirmation: ${confirmation}, Delivery Date: ${delivery.toDateString()}`);
        setOpenRebateDialog(true);
      }

      clearCart();
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!personalInfo.name.trim()) errors.name = 'Name is required';
    if (!personalInfo.address.trim()) errors.address = 'Address is required';
    if (!personalInfo.city.trim()) errors.city = 'City is required';
    if (!personalInfo.state.trim()) errors.state = 'State is required';
    if (!personalInfo.zip.trim()) errors.zip = 'Zip is required';
    if (!personalInfo.creditCard.trim()) errors.creditCard = 'Credit card information is required';
    if (personalInfo.deliveryMethod === 'store' && !personalInfo.storeLocation) errors.storeLocation = 'Store location is required for store pickup';

    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleNext = () => setActiveStep(prevStep => prevStep + 1);
  const handleBack = () => setActiveStep(prevStep => prevStep - 1);

  const storeLocations = [
    { id: 1, name: 'Store 1', zip: '12345' },
    { id: 2, name: 'Store 2', zip: '23456' },
  ];

  const handleCloseDialog = () => {
    setOpenRebateDialog(false);
    navigate('/order-status');
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>Complete Your Order</Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {activeStep === 0 && (
            <>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Personal Information</Typography>
                    <TextField 
                      label="Name" 
                      name="name" 
                      value={personalInfo.name} 
                      onChange={handleChange} 
                      fullWidth 
                      required 
                      margin="normal"
                      error={!!errors.name}
                      helperText={errors.name}
                    />
                    <TextField 
                      label="Address" 
                      name="address" 
                      value={personalInfo.address} 
                      onChange={handleChange} 
                      fullWidth 
                      required 
                      margin="normal"
                      error={!!errors.address}
                      helperText={errors.address}
                    />
                    <TextField 
                      label="City" 
                      name="city" 
                      value={personalInfo.city} 
                      onChange={handleChange} 
                      fullWidth 
                      required 
                      margin="normal"
                      error={!!errors.city}
                      helperText={errors.city}
                    />
                    <TextField 
                      label="State" 
                      name="state" 
                      value={personalInfo.state} 
                      onChange={handleChange} 
                      fullWidth 
                      required 
                      margin="normal"
                      error={!!errors.state}
                      helperText={errors.state}
                    />
                    <TextField 
                      label="Zip" 
                      name="zip" 
                      value={personalInfo.zip} 
                      onChange={handleChange} 
                      fullWidth 
                      required 
                      margin="normal"
                      error={!!errors.zip}
                      helperText={errors.zip}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {activeStep === 1 && (
            <>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Delivery Method</Typography>
                    <Select 
                      name="deliveryMethod" 
                      value={personalInfo.deliveryMethod} 
                      onChange={handleChange} 
                      fullWidth
                    >
                      <MenuItem value="home">Home Delivery</MenuItem>
                      <MenuItem value="store">Store Pickup</MenuItem>
                    </Select>
                    {personalInfo.deliveryMethod === 'store' && (
                      <Select 
                        name="storeLocation" 
                        value={personalInfo.storeLocation} 
                        onChange={handleChange} 
                        fullWidth
                        error={!!errors.storeLocation}
                      >
                        {storeLocations.map(store => (
                          <MenuItem key={store.id} value={store.name}>{store.name} ({store.zip})</MenuItem>
                        ))}
                      </Select>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {activeStep === 2 && (
            <>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Payment Details</Typography>
                    <TextField 
                      label="Credit Card" 
                      name="creditCard" 
                      value={personalInfo.creditCard} 
                      onChange={handleChange} 
                      fullWidth 
                      required 
                      margin="normal"
                      error={!!errors.creditCard}
                      helperText={errors.creditCard}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              {activeStep > 0 && (
                <Button onClick={handleBack} variant="outlined">Back</Button>
              )}
              {activeStep < steps.length - 1 ? (
                <Button onClick={handleNext} variant="contained" color="primary">Next</Button>
              ) : (
                <Button type="submit" variant="contained" color="primary">Place Order</Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar for form validation */}
      <Snackbar open={showToast} autoHideDuration={4000} onClose={() => setShowToast(false)}>
        <Alert onClose={() => setShowToast(false)} severity="error" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>

      {/* Rebate Dialog */}
      <Dialog open={openRebateDialog} onClose={handleCloseDialog}>
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
          <Button onClick={handleCloseDialog} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderForm;
