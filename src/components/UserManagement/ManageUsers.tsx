import React, { useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem } from '@mui/material';
import { useUser } from './UserContext';

const ManageUsers: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useUser();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: 0, username: '', password: '', role: 'Customer' as 'Customer' | 'Store Manager' | 'Salesman' });

  const handleOpen = (user = { id: 0, username: '', password: '', role: 'Customer' as 'Customer' | 'Store Manager' | 'Salesman' }) => {
    setCurrentUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser({ id: 0, username: '', password: '', role: 'Customer' });
  };

  const handleSave = () => {
    if (currentUser.id === 0) {
      addUser(currentUser.username, currentUser.password, currentUser.role);
    } else {
      updateUser(currentUser);
    }
    handleClose();
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Manage Users</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
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
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(user)}>Edit</Button>
                  <Button onClick={() => deleteUser(user.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageUsers;