import React, { useState } from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Select, IconButton, Snackbar, Alert, Box, Pagination
} from '@mui/material';
import { useUser } from './UserContext';
import { useOrder } from '../OrderPlacement/OrderContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const ManageUsers: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useUser();
  const { orders, addOrder, updateOrder, deleteOrder } = useOrder();
  
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: 0, username: '', password: '', role: 'Customer' as 'Customer' | 'Store Manager' | 'Salesman'
  });
  const [currentOrder, setCurrentOrder] = useState({
    id: 0, userId: 0, confirmation: '', deliveryDate: '', status: 'Processing'
  });
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  
  const handleOpenUserDialog = (user = { id: 0, username: '', password: '', role: 'Customer' as 'Customer' | 'Store Manager' | 'Salesman' }) => {
    setCurrentUser(user);
    setOpenUserDialog(true);
  };
  

  const handleOpenOrderDialog = (order = { id: 0, userId: 0, confirmation: '', deliveryDate: '', status: 'Processing' }) => {
    setCurrentOrder(order);
    setOpenOrderDialog(true);
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setCurrentUser({ id: 0, username: '', password: '', role: 'Customer' });
  };

  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false);
    setCurrentOrder({ id: 0, userId: 0, confirmation: '', deliveryDate: '', status: 'Processing' });
  };

  const handleSaveUser = () => {
    if (currentUser.id === 0) {
      addUser(currentUser.username, currentUser.password, currentUser.role);
    } else {
      updateUser(currentUser);
    }
    handleCloseUserDialog();
    setSnackbarMessage('User saved successfully!');
    setOpenSnackbar(true);
  };

  const handleSaveOrder = () => {
    if (currentOrder.id === 0) {
      addOrder({ ...currentOrder, id: Date.now() });
    } else {
      updateOrder(currentOrder);
    }
    handleCloseOrderDialog();
    setSnackbarMessage('Order saved successfully!');
    setOpenSnackbar(true);
  };

  const handleDeleteUser = (id: number) => {
    deleteUser(id);
    setSnackbarMessage('User deleted successfully!');
    setOpenSnackbar(true);
  };

  const handleDeleteOrder = (id: number) => {
    deleteOrder(id);
    setSnackbarMessage('Order deleted successfully!');
    setOpenSnackbar(true);
  };

  const userOrders = (userId: number) => orders.filter(order => order.userId === userId);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const paginatedUsers = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <>
      <Typography variant="h4" gutterBottom>Manage Users</Typography>
      <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={() => handleOpenUserDialog()} sx={{ mb: 2 }}>
        Add New User
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenUserDialog(user)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDeleteUser(user.id)}><DeleteIcon /></IconButton>
                  <Button onClick={() => setSelectedUserId(user.id)}>Manage Orders</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ p: 2 }}>
          <Pagination count={Math.ceil(users.length / rowsPerPage)} page={page} onChange={handleChangePage} />
        </Box>
      </TableContainer>

      {selectedUserId !== null && (
        <>
          <Typography variant="h6">
            {users.find(user => user.id === selectedUserId)?.username}'s Orders
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
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
                {userOrders(selectedUserId).map(order => (
                  <TableRow key={order.id}>
                    <TableCell>{order.confirmation}</TableCell>
                    <TableCell>{order.deliveryDate}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpenOrderDialog(order)}>Edit</Button>
                      <Button onClick={() => handleDeleteOrder(order.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* User Dialog */}
      <Dialog open={openUserDialog} onClose={handleCloseUserDialog}>
        <DialogTitle>{currentUser.id === 0 ? 'Add New User' : 'Edit User'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            value={currentUser.username}
            onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={currentUser.password}
            onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
          />
          <Select
            margin="dense"
            fullWidth
            value={currentUser.role}
            onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value as 'Customer' | 'Store Manager' | 'Salesman' })}
          >
            <MenuItem value="Customer">Customer</MenuItem>
            <MenuItem value="Store Manager">Store Manager</MenuItem>
            <MenuItem value="Salesman">Salesman</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>Cancel</Button>
          <Button onClick={handleSaveUser}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Order Dialog */}
      <Dialog open={openOrderDialog} onClose={handleCloseOrderDialog}>
        <DialogTitle>{currentOrder.id === 0 ? 'Add Order' : 'Edit Order'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Confirmation"
            fullWidth
            value={currentOrder.confirmation}
            onChange={(e) => setCurrentOrder({ ...currentOrder, confirmation: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Delivery Date"
            fullWidth
            value={currentOrder.deliveryDate}
            onChange={(e) => setCurrentOrder({ ...currentOrder, deliveryDate: e.target.value })}
          />
          <Select
            margin="dense"
            fullWidth
            value={currentOrder.status}
            onChange={(e) => setCurrentOrder({ ...currentOrder, status: e.target.value })}
          >
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDialog}>Cancel</Button>
          <Button onClick={handleSaveOrder}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ManageUsers;
