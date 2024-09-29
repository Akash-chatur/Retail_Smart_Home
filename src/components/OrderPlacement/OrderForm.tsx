import React, { useState } from 'react';
import {
  TextField, Button, Typography, Select, MenuItem, Dialog, DialogContent, DialogActions,
  Box, Stepper, Step, StepLabel, Snackbar, Alert, FormControl, InputLabel, FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openRebateDialog, setOpenRebateDialog] = useState(false);
  const [rebateProducts, setRebateProducts] = useState<CartItem[]>([]);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [orderInfo, setOrderInfo] = useState<{ confirmation: string; deliveryDate: string } | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Personal Information', 'Delivery Method', 'Payment Details'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeStep !== steps.length - 1) {
      // Prevent submission if not on the last step
      return;
    }

    if (!validateCurrentStep()) {
      return;
    }

    const confirmation = `CONF-${Date.now()}`;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 14);

    if (user) {
      try {
        console.log("userId =", user.id);

        const response = await fetch('http://localhost:8082/MyServletProject/OrderServlet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            userName: personalInfo.name,  // User Name
            confirmation,
            deliveryDate: deliveryDate.toDateString(),
            status: 'Processing',
            zipcode: personalInfo.zip,  // Zipcode
            productId: cart[0].id,  // Product ID
            productName: cart[0].name,  // Product Name
            productType: cart[0].price.toString(),  // Product Type
            productDescription: cart[0].name,  // Product Description
          }),
        });

        const result = await response.json();
        if (result.status === 'success') {
          const rebateItems = cart.filter(product => 'manufacturerRebate' in product && product.manufacturerRebate);
          setOrderInfo({ confirmation, deliveryDate: deliveryDate.toDateString() });

          if (rebateItems.length > 0) {
            setRebateProducts(rebateItems);
            setOpenRebateDialog(true);
          } else {
            setConfirmationMessage(`Order placed! Confirmation: ${confirmation}, Delivery Date: ${deliveryDate.toDateString()}`);
            setOpenRebateDialog(true);
          }

          clearCart(); // Clear cart after successful order placement
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Error placing order:', error);
      }
    }
  };

  const validateCurrentStep = (): boolean => {
    let currentErrors = {};

    if (activeStep === 0) {
      currentErrors = validatePersonalInfo();
    } else if (activeStep === 1) {
      currentErrors = validateDeliveryMethod();
    } else if (activeStep === steps.length - 1) {
      currentErrors = validatePaymentDetails();
    }

    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      setToastMessage('Please fill in all required fields.');
      setShowToast(true);
      return false;
    }

    return true;
  };

  const validatePersonalInfo = () => {
    const errors: { [key: string]: string } = {};
    if (!personalInfo.name.trim()) errors.name = 'Name is required';
    if (!personalInfo.address.trim()) errors.address = 'Address is required';
    if (!personalInfo.city.trim()) errors.city = 'City is required';
    if (!personalInfo.state.trim()) errors.state = 'State is required';
    if (!personalInfo.zip.trim()) errors.zip = 'Zip is required';
    return errors;
  };

  const validateDeliveryMethod = () => {
    const errors: { [key: string]: string } = {};
    if (personalInfo.deliveryMethod === 'store' && !personalInfo.storeLocation) errors.storeLocation = 'Store location is required for store pickup';
    return errors;
  };

  const validatePaymentDetails = () => {
    const errors: { [key: string]: string } = {};
    if (!personalInfo.creditCard.trim()) errors.creditCard = 'Credit card information is required';
    return errors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name as string]: value as string });
    setErrors({ ...errors, [name as string]: '' });
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep(prevStep => prevStep + 1);
      setShowToast(false); // Clear any previous error messages
    }
  };

  const handleBack = () => setActiveStep(prevStep => prevStep - 1);

  const storeLocations = [
    { id: 1, name: '123 Main St, Springfield, IL', zip: '62701' },
    { id: 2, name: '456 Elm St, Austin, TX', zip: '78701' },
    { id: 3, name: '789 Maple Ave, Seattle, WA', zip: '98101' },
    // Add more locations as needed
  ];

  const handleCloseDialog = () => {
    setOpenRebateDialog(false);
    navigate('/order-status');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        Complete Your Order
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mb: 3 }}>
        {activeStep === 0 && (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={personalInfo.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="address"
              label="Address"
              name="address"
              autoComplete="address"
              value={personalInfo.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="city"
              label="City"
              name="city"
              autoComplete="city"
              value={personalInfo.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="state"
              label="State"
              name="state"
              autoComplete="state"
              value={personalInfo.state}
              onChange={handleChange}
              error={!!errors.state}
              helperText={errors.state}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="zip"
              label="Zip Code"
              name="zip"
              autoComplete="zip"
              value={personalInfo.zip}
              onChange={handleChange}
              error={!!errors.zip}
              helperText={errors.zip}
            />
          </>
        )}
        {activeStep === 1 && (
          <>
            <Typography variant="h6" gutterBottom>
                Delivery Method
            </Typography>
            <FormControl fullWidth sx={{ mb: personalInfo.deliveryMethod === 'store' ? undefined : 3 }} error={!!errors.deliveryMethod}>
                <InputLabel>Delivery Method</InputLabel>
                <Select
                    value={personalInfo.deliveryMethod}
                    onChange={(e) => handleChange(e as React.ChangeEvent<{ name?: string; value: unknown }>)}
                    name="deliveryMethod"
                >
                    <MenuItem value="home">Home Delivery</MenuItem>
                    <MenuItem value="store">Store Pickup</MenuItem>
                </Select>
                {!!errors.deliveryMethod && <FormHelperText>{errors.deliveryMethod}</FormHelperText>}
            </FormControl>
            {personalInfo.deliveryMethod === 'store' && (
                <FormControl fullWidth sx={{ mb:3 }} error={!!errors.storeLocation}>
                    <InputLabel>Store Location</InputLabel>
                    <Select
                        value={personalInfo.storeLocation}
                        onChange={(e) => handleChange(e as React.ChangeEvent<{ name?: string; value: unknown }>)}
                        name="storeLocation"
                    >
                        {storeLocations.map(store => (
                            <MenuItem key={store.id} value={store.name}>
                                {store.name} ({store.zip})
                            </MenuItem>
                        ))}
                    </Select>
                    {!!errors.storeLocation && <FormHelperText>{errors.storeLocation}</FormHelperText>}
                </FormControl>
            )}
          </>
        )}
        {activeStep === steps.length -1 && (
          <>
            <TextField
                margin="normal"
                required
                fullWidth
                id="creditCard"
                label="Credit Card Number"
                name="creditCard"
                autoComplete="cc-number"
                value={personalInfo.creditCard}
                onChange={handleChange}
                error={!!errors.creditCard}
                helperText={errors.creditCard}
            />
          </>
        )}
      </Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', mt :3 }}>
        {activeStep >0 &&(
           <Button onClick ={handleBack} sx={{ mt :3 }}>
             Back 
           </Button >
         )}
         {activeStep < steps.length -1 ? (
           <Button onClick ={handleNext} sx={{ mt :3 }}>
             Next 
           </Button >
         ) :(
           <Button type ="submit" fullWidth variant ="contained" sx={{ mt :3 }}>
             Place Order 
           </Button >
         )}
       </Box >
       <Snackbar open ={showToast} autoHideDuration ={6000} onClose ={() =>setShowToast(false)}>
         <Alert onClose ={() =>setShowToast(false)} severity ="error" sx={{ width :'100%'}}>
           {toastMessage }
         </Alert >
       </Snackbar >
       {/* Rebate Dialog */}
       <Dialog open ={openRebateDialog} onClose ={handleCloseDialog}>
         <DialogContent >
           {rebateProducts.length >0 ? (
             <>
               Order Placed Successfully!
               Confirmation :{orderInfo ?.confirmation }, Delivery Date :{orderInfo ?.deliveryDate }
               Manufacturer Rebate Details 
               {rebateProducts.map(product =>(
                 ('manufacturerRebate' in product && product.manufacturerRebate) ? (
                   <>
                     {product.name }
                     Cashback :${product.manufacturerRebate }
                   </>
                 ) : null
               ))}
             </>
           ) :(
             confirmationMessage 
           )}
         </DialogContent >
         <DialogActions >
           <Button onClick ={handleCloseDialog}>Close</Button >
         </DialogActions >
       </Dialog >
     </Box >
   );
};

export default OrderForm ;