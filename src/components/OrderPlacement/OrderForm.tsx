import React, { useState } from 'react';
import { TextField, Button, Typography, Select, MenuItem } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useOrder } from './OrderContext';

const OrderForm: React.FC = () => {
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
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const confirmation = `CONF-${Date.now()}`;
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 14);

    addOrder({
      confirmation,
      deliveryDate: delivery.toDateString(),
      status: 'Processing',
    });

    alert(`Order placed! Confirmation: ${confirmation}, Delivery Date: ${delivery.toDateString()}`);
    navigate('/order-status');
  };

  const storeLocations = [
    { id: 1, name: 'Store 1', zip: '12345' },
    { id: 2, name: 'Store 2', zip: '23456' },
    // Add more store locations
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5">Order Details</Typography>
      <TextField label="Name" name="name" value={personalInfo.name} onChange={handleChange} fullWidth required /><br/><br/>
      <TextField label="Address" name="address" value={personalInfo.address} onChange={handleChange} fullWidth required /><br/><br/>
      <TextField label="City" name="city" value={personalInfo.city} onChange={handleChange} fullWidth required /><br/><br/>
      <TextField label="State" name="state" value={personalInfo.state} onChange={handleChange} fullWidth required /><br/><br/>
      <TextField label="Zip" name="zip" value={personalInfo.zip} onChange={handleChange} fullWidth required /><br/><br/>
      <TextField label="Credit Card" name="creditCard" value={personalInfo.creditCard} onChange={handleChange} fullWidth required /><br/><br/>
      <Select name="deliveryMethod" value={personalInfo.deliveryMethod} onChange={handleChange} fullWidth><br/><br/>
        <MenuItem value="home">Home Delivery</MenuItem>
        <MenuItem value="store">Store Pickup</MenuItem>
      </Select>
      {personalInfo.deliveryMethod === 'store' && (
        <Select name="storeLocation" value={personalInfo.storeLocation} onChange={handleChange} fullWidth>
          {storeLocations.map((store) => (
            <MenuItem key={store.id} value={store.name}>{store.name} ({store.zip})</MenuItem>
          ))}
        </Select>
      )}<br/><br/>
      <Button type="submit" variant="contained" color="primary">Place Order</Button><br/><br/>
      <Button component={RouterLink} to="/cart" variant="outlined" color="secondary" sx={{ mr: 2 }}>
        Back to Cart
      </Button>
      <Button component={RouterLink} to="/products" variant="outlined" color="secondary">
        Back to Products
      </Button>
    </form>
  );
};

export default OrderForm;