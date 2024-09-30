import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Typography, Select, MenuItem, Dialog, DialogContent, DialogActions,
  Box, Stepper, Step, StepLabel, Snackbar, Alert, FormControl, InputLabel, FormHelperText,
  SelectChangeEvent
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
  const [storeLocations, setStoreLocations] = useState<{ storeId: string; street: string; city: string; state: string; zipcode: string }[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  const steps = ['Personal Information', 'Delivery Method', 'Payment Details'];

  // Fetch store locations from the backend
  useEffect(() => {
    const fetchStoreLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const response = await fetch('http://localhost:8082/MyServletProject/LocationServlet');
        const data = await response.json();
        setStoreLocations(data);
      } catch (error) {
        console.error('Error fetching store locations:', error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchStoreLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (activeStep !== steps.length - 1) {
      return;
    }
  
    if (!validateCurrentStep()) {
      return;
    }
  
    const confirmation = `CONF-${Date.now()}`;
    const purchaseDate = new Date().toISOString(); // Get the current date
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 14); // Set delivery date 14 days later
  
    // Calculate order details
    const shippingCost = personalInfo.deliveryMethod === 'home' ? 10.00 : 0; // Example shipping cost
    const discount = 0; // Example discount, can be calculated based on some logic
    const quantity = 1; // Assuming each order is for one item; adjust as necessary
    const totalSales = cart.reduce((total, item) => total + item.price, 0); // Sum up the price of all items in cart
  
    if (user) {
      console.log("sent request = ",JSON.stringify({
        user_id: user.id,
        userName: personalInfo.name,
        customerAddress: personalInfo.address,
        creditCard: personalInfo.creditCard,
        orderId: confirmation,
        purchaseDate,
        shipDate: deliveryDate.toISOString(), // Convert to ISO string for backend
        productId: cart[0].id,
        productName: cart[0].name, // Make sure this field exists in your CartItem type
        productDescription: 'Smart LED bulb with multicolor and dimmable features',
        productType: cart[0].name,
        quantity,
        price: cart[0].price, // Assuming price is the same for all products; adjust if needed
        shippingCost,
        discount,
        totalSales,
        zipcode: personalInfo.zip,
        storeId: personalInfo.deliveryMethod === 'store' ? personalInfo.storeLocation : null, // Include store ID only for in-store pickup
        storeAddress: personalInfo.deliveryMethod === 'store' ? `${personalInfo.storeLocation}, ${storeLocations.find(store => store.street === personalInfo.storeLocation)?.city}, ${storeLocations.find(store => store.street === personalInfo.storeLocation)?.state}, ${storeLocations.find(store => store.street === personalInfo.storeLocation)?.zipcode}` : null, // Construct store address if needed
      }))
      //try {
        const response = await fetch('http://localhost:8082/MyServletProject/OrderServlet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'placeOrder',
            user_id: user.id,
        userName: personalInfo.name,
        customerAddress: '555 E 33rd Pl',
        creditCard: personalInfo.creditCard,
        orderId: confirmation,
        purchaseDate,
        shipDate: deliveryDate.toISOString(), // Convert to ISO string for backend
        productId: cart[0].id,
        productName: cart[0].name, // Make sure this field exists in your CartItem type
        productDescription: 'Smart LED bulb with multicolor and dimmable features',
        productType: 'Smart Doorbells',
        quantity,
        price: cart[0].price, // Assuming price is the same for all products; adjust if needed
        shippingCost,
        discount,
        totalSales,
        zipcode: personalInfo.zip,
        storeId: personalInfo.deliveryMethod === 'store' ? personalInfo.storeLocation : null, // Include store ID only for in-store pickup
        storeAddress: personalInfo.deliveryMethod === 'store' ? `${personalInfo.storeLocation}, ${storeLocations.find(store => store.street === personalInfo.storeLocation)?.city}, ${storeLocations.find(store => store.street === personalInfo.storeLocation)?.state}, ${storeLocations.find(store => store.street === personalInfo.storeLocation)?.zipcode}` : null, // Construct store address if needed
      }),
        });
  
        try{
        const result = await response.json();
        console.log("test result = ",result);
        if (result == "Order placed successfully.") {
          console.log("inside if")
          const rebateItems = cart.filter(product => 'manufacturerRebate' in product && product.manufacturerRebate);
          setOrderInfo({ confirmation, deliveryDate: deliveryDate.toDateString() });

          if (rebateItems.length > 0) {
            setRebateProducts(rebateItems);
            setOpenRebateDialog(true);
          } else {
            setConfirmationMessage(`Order placed! Confirmation: ${confirmation}, Delivery Date: ${deliveryDate.toDateString()}`);
            setOpenRebateDialog(true);
          }
          clearCart();
        } else {
          console.log("inside else")
          alert(result);
        }
     } catch (error) {
      console.log("inside catch")
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

  const handleSelectChange = (
    e: SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prevInfo) => ({ ...prevInfo, [name as string]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name as string]: '' }));
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep(prevStep => prevStep + 1);
      setShowToast(false);
    }
  };

  const handleBack = () => setActiveStep(prevStep => prevStep - 1);

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
              sx={{ mb: 2 }}
            />
          </>
        )}
        {activeStep === 1 && (
          <>
            <FormControl fullWidth error={!!errors.deliveryMethod}>
              <InputLabel>Delivery Method</InputLabel>
              <Select
                value={personalInfo.deliveryMethod}
                onChange={handleSelectChange}
                name="deliveryMethod"
              >
                <MenuItem value="home">Home Delivery</MenuItem>
                <MenuItem value="store">Store Pickup</MenuItem>
</Select>
              <FormHelperText>{errors.deliveryMethod}</FormHelperText>
            </FormControl>

            {personalInfo.deliveryMethod === 'store' && (
              <Select
                value={personalInfo.storeLocation}
                onChange={handleSelectChange}
                name="storeLocation"
                disabled={isLoadingLocations}
              >
                {storeLocations.map((store) => (
                  <MenuItem key={store.storeId} value={store.street}>
                    {store.street} - {store.city} - {store.state} ({store.zipcode})
                  </MenuItem>
                ))}
              </Select>
            )}
          </>
        )}
        {activeStep === steps.length - 1 && (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="creditCard"
              label="Credit Card"
              name="creditCard"
              autoComplete="creditCard"
              value={personalInfo.creditCard}
              onChange={handleChange}
              error={!!errors.creditCard}
              helperText={errors.creditCard}
              sx={{ mb: 2 }}
            />
          </>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button type="submit" variant="contained" color="primary">
            Place Order
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained" color="primary">
            Next
          </Button>
        )}
      </Box>

      <Snackbar
        open={showToast}
        autoHideDuration={6000}
        onClose={() => setShowToast(false)}
      >
        <Alert onClose={() => setShowToast(false)} severity="warning">
          {toastMessage}
        </Alert>
      </Snackbar>

      <Dialog open={openRebateDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Order Confirmation
          </Typography>
          <Typography>{confirmationMessage}</Typography>
          {rebateProducts.length > 0 && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                You have the following rebate items:
              </Typography>
              {rebateProducts.map(product => (
                <Typography key={product.id}>{product.name}</Typography>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderForm;
