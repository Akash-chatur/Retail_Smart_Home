import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

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

  const storeLocations = [
    { id: 1, name: 'Store 1', zip: '12345' },
    { id: 2, name: 'Store 2', zip: '23456' },
    // Add more store locations
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setPersonalInfo({ ...personalInfo, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order submission logic
    alert('Order placed successfully!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5">Order Details</Typography>
      <TextField label="Name" name="name" value={personalInfo.name} onChange={handleChange} fullWidth required />
      <TextField label="Address" name="address" value={personalInfo.address} onChange={handleChange} fullWidth required />
      <TextField label="City" name="city" value={personalInfo.city} onChange={handleChange} fullWidth required />
      <TextField label="State" name="state" value={personalInfo.state} onChange={handleChange} fullWidth required />
      <TextField label="Zip" name="zip" value={personalInfo.zip} onChange={handleChange} fullWidth required />
      <TextField label="Credit Card" name="creditCard" value={personalInfo.creditCard} onChange={handleChange} fullWidth required />
      <Select name="deliveryMethod" value={personalInfo.deliveryMethod} onChange={handleChange} fullWidth>
        <MenuItem value="home">Home Delivery</MenuItem>
        <MenuItem value="store">Store Pickup</MenuItem>
      </Select>
      {personalInfo.deliveryMethod === 'store' && (
        <Select name="storeLocation" value={personalInfo.storeLocation} onChange={handleChange} fullWidth>
          {storeLocations.map((store) => (
            <MenuItem key={store.id} value={store.name}>{store.name} ({store.zip})</MenuItem>
          ))}
        </Select>
      )}
      <Button type="submit" variant="contained" color="primary">Place Order</Button>
    </form>
  );
};

export default OrderForm;