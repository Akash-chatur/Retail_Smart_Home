import React from 'react';
import { Typography, Button } from '@mui/material';
import { useOrder } from './OrderContext';

const OrderStatus: React.FC = () => {

const { orders, cancelOrder } = useOrder();

return (
    <>
      <Typography variant="h4" gutterBottom>Order Status</Typography>
      {orders.map((order) => (
        <div key={order.confirmation}>
          <Typography variant="h6">Confirmation: {order.confirmation}</Typography>
          <Typography>Delivery Date: {order.deliveryDate}</Typography>
          <Typography>Status: {order.status}</Typography>
          <Button variant="outlined" onClick={() => cancelOrder(order.confirmation)}>Cancel Order</Button>
        </div>
      ))}
    </>
  );
};


export default OrderStatus;