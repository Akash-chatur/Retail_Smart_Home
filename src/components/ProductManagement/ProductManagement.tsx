import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Avatar,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Product, Accessory, WarrantyOption } from '../../types/Product';
import { initialProducts } from '../../data/products';
const productTypes = [
  "Smart Doorbells",
  "Smart Doorlocks",
  "Smart Speakers",
  "Smart Lightings",
  "Smart Thermostats"
];

const ProductManagement: React.FC = () => {
  
  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      return JSON.parse(storedProducts);
    } else {
      localStorage.setItem('products', JSON.stringify(initialProducts));
      return initialProducts;
    }
  });
  
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [newAccessory, setNewAccessory] = useState<Accessory>({ id: 0, name: '', price: 0 });
  const [newWarranty, setNewWarranty] = useState<WarrantyOption>({ id: 0, name: '', duration: '', price: 0 });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleOpen = (product: Product | null = null) => {
    setCurrentProduct(product || {
      id: 0,
      name: '',
      type: '',
      price: 0,
      description: '',
      accessories: [],
      warrantyOptions: [],
      imageUrl: '',
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
    if (currentProduct) {
      if (currentProduct.id === 0) {
        // Add new product
        setProducts([...products, { ...currentProduct, id: Date.now() }]);
      } else {
        // Update existing product
        setProducts(products.map(p => p.id === currentProduct.id ? currentProduct : p));
      }
      handleClose();
    }
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Product Management</Typography>
      <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Add New Product
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Accessories</TableCell>
              <TableCell>Warranty Options</TableCell>
              <TableCell>Special Discount</TableCell>
              <TableCell>Manufacturer Rebate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Avatar src={product.imageUrl} alt={product.name} />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>
                  {product.accessories.map(acc => (
                    <Chip key={acc.id} label={`${acc.name} - $${acc.price.toFixed(2)}`} sx={{ m: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell>
                  {product.warrantyOptions?.map(warranty => (
                    <Chip key={warranty.duration} label={`${warranty.duration} - $${warranty.price.toFixed(2)}`} sx={{ m: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell>{product.specialDiscount ? `$${product.specialDiscount.toFixed(2)}` : 'N/A'}</TableCell>
                <TableCell>{product.manufacturerRebate ? `$${product.manufacturerRebate.toFixed(2)}` : 'N/A'}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(product)}>Edit</Button>
                  <Button onClick={() => handleDelete(product.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{currentProduct?.id === 0 ? 'Add New Product' : 'Edit Product'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={currentProduct?.name || ''}
            onChange={(e) => setCurrentProduct({ ...currentProduct!, name: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
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
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={currentProduct?.price || ''}
            onChange={(e) => setCurrentProduct({ ...currentProduct!, price: parseFloat(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={currentProduct?.description || ''}
            onChange={(e) => setCurrentProduct({ ...currentProduct!, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            value={currentProduct?.imageUrl || ''}
            onChange={(e) => setCurrentProduct({ ...currentProduct!, imageUrl: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Special Discount"
            type="number"
            fullWidth
            value={currentProduct?.specialDiscount || ''}
            onChange={(e) => setCurrentProduct({ ...currentProduct!, specialDiscount: parseFloat(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Manufacturer Rebate"
            type="number"
            fullWidth
            value={currentProduct?.manufacturerRebate || ''}
            onChange={(e) => setCurrentProduct({ ...currentProduct!, manufacturerRebate: parseFloat(e.target.value) })}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>Accessories</Typography>
          {currentProduct?.accessories.map(acc => (
            <Box key={acc.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography>{acc.name} - ${acc.price.toFixed(2)}</Typography>
              <IconButton onClick={() => handleRemoveAccessory(acc.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TextField
              label="Accessory Name"
              value={newAccessory.name}
              onChange={(e) => setNewAccessory({ ...newAccessory, name: e.target.value })}
              sx={{ mr: 1 }}
            />
            <TextField
              label="Price"
              type="number"
              value={newAccessory.price || ''}
              onChange={(e) => setNewAccessory({ ...newAccessory, price: parseFloat(e.target.value) })}
              sx={{ mr: 1 }}
            />
            <IconButton onClick={handleAddAccessory} color="primary">
              <AddIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>Warranty Options</Typography>
          {currentProduct?.warrantyOptions?.map(warranty => (
            <Box key={warranty.duration} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography>{warranty.duration} - ${warranty.price.toFixed(2)}</Typography>
              <IconButton onClick={() => handleRemoveWarranty(warranty.duration)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TextField
              label="Warranty Duration"
              value={newWarranty.duration}
              onChange={(e) => setNewWarranty({ ...newWarranty, duration: e.target.value })}
              sx={{ mr: 1 }}
            />
            <TextField
              label="Price"
              type="number"
              value={newWarranty.price || ''}
              onChange={(e) => setNewWarranty({ ...newWarranty, price: parseFloat(e.target.value) })}
              sx={{ mr: 1 }}
            />
            <IconButton onClick={handleAddWarranty} color="primary">
              <AddIcon />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;