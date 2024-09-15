import React, { useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useOrder } from './OrderContext';
import { useAuth } from '../../context/AuthContext';

const OrderStatus: React.FC = () => {
  const { orders, cancelOrder, deleteOrder } = useOrder();
  const { user } = useAuth();
  const [canceledOrders, setCanceledOrders] = useState<Set<number>>(new Set());

  const userOrders = orders.filter(order => order.userId === user?.id);

  const handleCancelOrder = (orderId: number) => {
    cancelOrder(orderId);
    setCanceledOrders(new Set(canceledOrders).add(orderId));
  };

  const handleDeleteOrder = (orderId: number) => {
    deleteOrder(orderId);
    setCanceledOrders(prev => {
      const updated = new Set(prev);
      updated.delete(orderId);
      return updated;
    });
  };

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
                  {canceledOrders.has(order.id) ? (
                    <Button variant="outlined" color="secondary" onClick={() => handleDeleteOrder(order.id)}>
                      Delete Order
                    </Button>
                  ) : (
                    <Button variant="outlined" color="secondary" onClick={() => handleCancelOrder(order.id)}>
                      Cancel Order
                    </Button>
                  )}
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