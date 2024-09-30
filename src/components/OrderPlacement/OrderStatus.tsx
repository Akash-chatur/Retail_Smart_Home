import React, { useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useOrder } from './OrderContext';
import { useAuth } from '../../context/AuthContext';

const OrderStatus: React.FC = () => {
  const { orders, cancelOrder, deleteOrder, refreshOrders } = useOrder();
  const { user } = useAuth();
  const [canceledOrders, setCanceledOrders] = React.useState<Set<number>>(new Set());

  useEffect(() => {
    refreshOrders(); // Refresh orders when component mounts
  }, []);

  const userOrders = orders.filter(order => order.userId === user?.id);

  const handleCancelOrder = async (orderId: number) => {
    try {
      const response = await fetch('http://localhost:8082/MyServletProject/OrderServlet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'cancel', orderId })
      });

      const result = await response.json();
      console.log("cancel result = ",result)
      
      if (result === 'Order canceled successfully.') {
          setCanceledOrders(new Set(canceledOrders).add(orderId));
      } else {
          console.error('Failed to cancel order:', result.message);
      }
      
    } catch (error) {
      console.error('Error canceling order:', error);
    }
    
    refreshOrders(); // Refresh the orders after cancellation
  };

  const handleDeleteOrder = async (orderId: number) => {
    try {
      const response = await fetch('http://localhost:8082/MyServletProject/OrderServlet', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId })
      });

      const result = await response.json();
      
      if (result.status === 'success') {
          setCanceledOrders(prev => {
              const newCanceledOrders = new Set(prev);
              newCanceledOrders.delete(orderId); // Remove the order from canceled orders
              return newCanceledOrders;
          });
          refreshOrders(); // Refresh the orders after deletion
      } else {
          console.error('Failed to delete order:', result.message);
      }
      
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
          Order Status
      </Typography>
      
      {userOrders.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={4}>
              <Alert severity="info" sx={{ mb: 2 }}>
                  You have no orders yet.
              </Alert>
              <Button component={RouterLink} to="/products" variant="contained" color="primary">
                  Order Something
              </Button>
          </Box>
      ) : (
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
      )}
      
      {userOrders.length !== 0 ? (
          <Button component={RouterLink} to="/products" variant="contained" color="primary" sx={{ mt: 3 }}>
              Back to Products
          </Button>) : null}
    </>
  );
};

export default OrderStatus;