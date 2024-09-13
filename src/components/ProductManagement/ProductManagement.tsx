import React, { useState } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Accessory {
  id: number;
  name: string;
  price: number;
}

interface WarrantyOption {
  duration: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
  accessories: Accessory[];
  warrantyOptions?: WarrantyOption[];
  specialDiscount?: number;
  manufacturerRebate?: number;
}

const initialProducts: Product[] = [
    {
      id: 1,
      name: "Ring Doorbell",
      type: "Smart Doorbells",
      price: 99.99,
      description: "HD video doorbell with two-way talk",
      accessories: [
        { id: 1, name: "Chime Pro", price: 49.99 },
        { id: 2, name: "Solar Charger", price: 39.99 }
      ],
      warrantyOptions: [
        { duration: "1 Year", price: 19.99 },
        { duration: "2 Years", price: 29.99 }
      ],
      specialDiscount: 10
    },
    {
      id: 2,
      name: "August Smart Lock",
      type: "Smart Doorlocks",
      price: 149.99,
      description: "Keyless entry smart lock with remote access",
      accessories: [
        { id: 3, name: "Door Hardware Kit", price: 29.99 }
      ],
      warrantyOptions: [
        { duration: "1 Year", price: 24.99 },
        { duration: "2 Years", price: 39.99 }
      ],
      manufacturerRebate: 15
    },
    {
      id: 3,
      name: "Amazon Echo",
      type: "Smart Speakers",
      price: 79.99,
      description: "Voice-controlled smart speaker with Alexa",
      accessories: [
        { id: 4, name: "Philips Hue Light Bulb", price: 14.99 },
        { id: 5, name: "Smart Plug", price: 24.99 }
      ],
      warrantyOptions: [
        { duration: "1 Year", price: 9.99 },
        { duration: "2 Years", price: 14.99 }
      ]
    },
    {
      id: 4,
      name: "Philips Hue",
      type: "Smart Lightings",
      price: 59.99,
      description: "Smart LED bulb with customizable colors",
      accessories: [],
      warrantyOptions: [
        { duration: "1 Year", price: 9.99 }
      ],
      specialDiscount: 5
    },
    {
      id: 5,
      name: "Nest Thermostat",
      type: "Smart Thermostats",
      price: 249.99,
      description: "Smart thermostat with energy-saving features",
      accessories: [
        { id: 6, name: "Sensor Starter Pack", price: 99.99 }
      ],
      warrantyOptions: [
        { duration: "1 Year", price: 29.99 },
        { duration: "2 Years", price: 49.99 },
        { duration: "3 Years", price: 69.99 }
      ],
      manufacturerRebate: 25
    },
    {
      id: 6,
      name: "Arlo Pro 3",
      type: "Smart Doorbells",
      price: 199.99,
      description: "Wireless home security camera system with HDR",
      accessories: [
        { id: 7, name: "Solar Panel Charger", price: 49.99 },
        { id: 8, name: "Extra Battery", price: 39.99 }
      ],
      warrantyOptions: [
        { duration: "1 Year", price: 29.99 },
        { duration: "2 Years", price: 49.99 }
      ]
    },
    {
      id: 7,
      name: "Yale Assure Lock",
      type: "Smart Doorlocks",
      price: 279.99,
      description: "Touchscreen deadbolt with smart home integration",
      accessories: [
        { id: 9, name: "Wi-Fi Bridge", price: 59.99 }
      ],
      warrantyOptions: [
        { duration: "1 Year", price: 39.99 },
        { duration: "2 Years", price: 69.99 }
      ],
      specialDiscount: 20
    },
    {
      id: 8,
      name: "Google Nest Mini",
      type: "Smart Speakers",
      price: 49.99,
      description: "Compact smart speaker with Google Assistant",
      accessories: [
        { id: 10, name: "Wall Mount", price: 14.99 }
      ],
      warrantyOptions: [
        { duration: "1 Year", price: 7.99 }
      ],
      manufacturerRebate: 5
    },
    {
      id: 9,
      name: "Lutron Caseta",
      type: "Smart Lightings",
      price: 159.99,
      description: "Smart dimmer switch starter kit",
      accessories: [
        { id: 11, name: "Pico Remote Control", price: 19.99 },
        { id: 12, name: "Smart Bridge Pro", price: 99.99 }
      ],
      warrantyOptions: [
        { duration: "1 Year", price: 19.99 },
        { duration: "2 Years", price: 34.99 }
      ]
    },
    {
      id: 10,
      name: "Ecobee SmartThermostat",
      type: "Smart Thermostats",
      price: 249.99,
      description: "Voice-enabled smart thermostat with room sensors",
      accessories: [
        { id: 13, name: "Additional Room Sensor", price: 79.99 },
        { id: 14, name: "Haven Temperature Sensor", price: 39.99 }
      ],
      warrantyOptions: [
        { duration: "1 Year", price: 29.99 },
        { duration: "2 Years", price: 49.99 },
        { duration: "3 Years", price: 69.99 }
      ],
      specialDiscount: 15,
      manufacturerRebate: 20
    }
  ];

  

const productTypes = [
  "Smart Doorbells",
  "Smart Doorlocks",
  "Smart Speakers",
  "Smart Lightings",
  "Smart Thermostats"
];

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [newAccessory, setNewAccessory] = useState<Accessory>({ id: 0, name: '', price: 0 });
  const [newWarranty, setNewWarranty] = useState<WarrantyOption>({ duration: '', price: 0 });

  const handleOpen = (product: Product | null = null) => {
    setCurrentProduct(product || {
      id: 0,
      name: '',
      type: '',
      price: 0,
      description: '',
      accessories: [],
      warrantyOptions: [],
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProduct(null);
    setNewAccessory({ id: 0, name: '', price: 0 });
    setNewWarranty({ duration: '', price: 0 });
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
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAddAccessory = () => {
    if (currentProduct && newAccessory.name && newAccessory.price) {
      setCurrentProduct({
        ...currentProduct,
        accessories: [...currentProduct.accessories, { ...newAccessory, id: Date.now() }]
      });
      setNewAccessory({ id: 0, name: '', price: 0 });
    }
  };

  const handleRemoveAccessory = (accessoryId: number) => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        accessories: currentProduct.accessories.filter(a => a.id !== accessoryId)
      });
    }
  };

  const handleAddWarranty = () => {
    if (currentProduct && newWarranty.duration && newWarranty.price) {
      setCurrentProduct({
        ...currentProduct,
        warrantyOptions: [...(currentProduct.warrantyOptions || []), newWarranty]
      });
      setNewWarranty({ duration: '', price: 0 });
    }
  };

  const handleRemoveWarranty = (duration: string) => {
    if (currentProduct && currentProduct.warrantyOptions) {
      setCurrentProduct({
        ...currentProduct,
        warrantyOptions: currentProduct.warrantyOptions.filter(w => w.duration !== duration)
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Add New Product
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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