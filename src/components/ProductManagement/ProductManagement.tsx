import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Box, Typography, Avatar, Chip, FormControl, IconButton, InputLabel,
  MenuItem, Select, Tooltip, Divider, Grid, Card, CardContent, CardMedia,
  CardActions, Fade, Zoom, Snackbar, Alert, LinearProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Product, Accessory, WarrantyOption } from '../../types/Product';
import initialProducts from '../../data/products.json';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textAlign: 'center',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

const productTypes = [
  "Smart Doorbells", "Smart Doorlocks", "Smart Speakers",
  "Smart Lightings", "Smart Thermostats"
];

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : initialProducts;
  });
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [newAccessory, setNewAccessory] = useState<Accessory>({ id: 0, name: '', price: 0 });
  const [newWarranty, setNewWarranty] = useState<WarrantyOption>({ id: 0, name: '', duration: '', price: 0 });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleOpen = (product: Product | null = null) => {
    setCurrentProduct(product || {
      id: 0, name: '', type: '', price: 0, description: '',
      accessories: [], warrantyOptions: [], imageUrl: '', category: ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProduct(null);
    setNewAccessory({ id: 0, name: '', price: 0 });
    setNewWarranty({ id: 0, name: '', duration: '', price: 0 });
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      if (currentProduct) {
        if (currentProduct.id === 0) {
          setProducts([...products, { ...currentProduct, id: Date.now() }]);
          showSnackbar('Product added successfully', 'success');
        } else {
          setProducts(products.map(p => p.id === currentProduct.id ? currentProduct : p));
          showSnackbar('Product updated successfully', 'success');
        }
      }
      handleClose();
      setLoading(false);
    }, 1000);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    showSnackbar('Product deleted successfully', 'success');
  };

  const handleAddAccessory = () => {
    if (currentProduct && newAccessory.name && newAccessory.price) {
      setCurrentProduct({
        ...currentProduct,
        accessories: [...currentProduct.accessories, { ...newAccessory, id: Date.now() }],
      });
      setNewAccessory({ id: 0, name: '', price: 0 });
    }
  };

  const handleRemoveAccessory = (accessoryId: number) => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        accessories: currentProduct.accessories.filter(a => a.id !== accessoryId),
      });
    }
  };

  const handleAddWarranty = () => {
    if (currentProduct && newWarranty.duration && newWarranty.price) {
      setCurrentProduct({
        ...currentProduct,
        warrantyOptions: [...(currentProduct.warrantyOptions || []), newWarranty],
      });
      setNewWarranty({ id: 0, name: '', duration: '', price: 0 });
    }
  };

  const handleRemoveWarranty = (duration: string) => {
    if (currentProduct && currentProduct.warrantyOptions) {
      setCurrentProduct({
        ...currentProduct,
        warrantyOptions: currentProduct.warrantyOptions.filter(w => w.duration !== duration),
      });
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const renderGridView = () => (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Zoom in={true} style={{ transitionDelay: '100ms' }}>
            <StyledCard>
              <CardMedia
                component="img"
                height="140"
                image={product.imageUrl || 'https://via.placeholder.com/140'}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.type} - ${product.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleOpen(product)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(product.id)}>Delete</Button>
              </CardActions>
            </StyledCard>
          </Zoom>
        </Grid>
      ))}
    </Grid>
  );

  const renderTableView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Image</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Price</StyledTableCell>
            <StyledTableCell>Description</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Avatar src={product.imageUrl || 'https://via.placeholder.com/40'} />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleOpen(product)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => handleDelete(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add New Product
        </Button>
        <Box>
          <Button
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('grid')}
            sx={{ mr: 1 }}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
        </Box>
      </Box>

      <Fade in={true}>
        <Box>
          {viewMode === 'grid' ? renderGridView() : renderTableView()}
        </Box>
      </Fade>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentProduct?.id === 0 ? 'Add New Product' : 'Edit Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={currentProduct?.name || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct!, name: e.target.value })}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  value={currentProduct?.type || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct!, type: e.target.value })}
                >
                  {productTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={currentProduct?.price || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct!, price: parseFloat(e.target.value) })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={currentProduct?.description || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct!, description: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Image URL"
                value={currentProduct?.imageUrl || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct!, imageUrl: e.target.value })}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Accessories</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Accessory Name"
                value={newAccessory.name}
                onChange={(e) => setNewAccessory({ ...newAccessory, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Accessory Price"
                type="number"
                value={newAccessory.price || ''}
                onChange={(e) => setNewAccessory({ ...newAccessory, price: parseFloat(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button fullWidth variant="contained" onClick={handleAddAccessory}>Add</Button>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            {currentProduct?.accessories?.map(acc => (
              <Chip
                key={acc.id}
                label={`${acc.name} - $${acc.price}`}
                onDelete={() => handleRemoveAccessory(acc.id)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Warranty Options</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Warranty Duration"
                value={newWarranty.duration}
                onChange={(e) => setNewWarranty({ ...newWarranty, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Warranty Price"
                type="number"
                value={newWarranty.price || ''}
                onChange={(e) => setNewWarranty({ ...newWarranty, price: parseFloat(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button fullWidth variant="contained" onClick={handleAddWarranty}>Add</Button>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            {currentProduct?.warrantyOptions?.map(warranty => (
              <Chip
                key={warranty.duration}
                label={`${warranty.duration} - $${warranty.price}`}
                onDelete={() => handleRemoveWarranty(warranty.duration)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity as any}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {loading && <LinearProgress />}
    </Box>
  );
};

export default ProductManagement;