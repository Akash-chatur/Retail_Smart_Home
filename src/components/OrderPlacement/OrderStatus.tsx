import React from 'react';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useOrder } from './OrderContext';
import { useAuth } from '../../context/AuthContext';

const OrderStatus: React.FC = () => {
  const { orders, cancelOrder } = useOrder();
  const { user } = useAuth();

  const userOrders = orders.filter(order => order.userId === user?.id);

  return (
    <>
      <Typography variant="h4" gutterBottom>Order Status</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Confirmation</TableCell>
              <TableCell>Delivery Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.confirmation}</TableCell>
                <TableCell>{order.deliveryDate}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="secondary" onClick={() => cancelOrder(order.id)}>
                    Cancel Order
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        component={RouterLink}
        to="/products"
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
      >
        Back to Products
      </Button>
    </>
  );
};

export default OrderStatus;