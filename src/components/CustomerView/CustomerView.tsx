import React, { useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Tabs, Tab, Dialog, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink } from 'react-router-dom';
import { Product, Accessory, WarrantyOption } from '../../types/Product';
import initialProducts from '../../data/products.json';

interface CustomerViewProps {
  addToCart: (item: Product | Accessory | WarrantyOption) => void;
}

const productTypes = [
  "All",
  "Smart Doorbells",
  "Smart Doorlocks",
  "Smart Speakers",
  "Smart Lightings",
  "Smart Thermostats"
];

const CustomerView: React.FC<CustomerViewProps> = ({ addToCart }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      return JSON.parse(storedProducts);
    } else {
      localStorage.setItem('products', JSON.stringify(initialProducts));
      return initialProducts;
    }
  });

  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const handleTypeChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedType(newValue);
    setSelectedProduct(null);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const filteredProducts = selectedType === "All" ? products : products.filter(product => product.type === selectedType);

  return (
    <>
      <Button
        component={RouterLink}
        to="/order-status"
        variant="outlined"
        color="secondary"
        sx={{ mb: 3 }}
      >
        View Order Status
      </Button>
      <Tabs
        value={selectedType}
        onChange={handleTypeChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        {productTypes.map((type) => (
          <Tab key={type} label={type} value={type} />
        ))}
      </Tabs>
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card onClick={() => handleProductClick(product)}>
              <CardMedia
                component="img"
                height="140"
                image={product.imageUrl || 'https://via.placeholder.com/140'}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                {product.specialDiscount ? (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${(product.price - product.specialDiscount).toFixed(2)} ({((product.specialDiscount / product.price) * 100).toFixed(0)}% off)
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                )}
                {product.manufacturerRebate && (
                  <Typography variant="body2" color="secondary">
                    {((product.manufacturerRebate / product.price) * 100).toFixed(0)}% cashback
                  </Typography>
                )}
                <Button variant="contained" color="primary" onClick={() => addToCart(product)} sx={{ mt: 2 }}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedProduct && (
            <>
              <Typography variant="h4" gutterBottom>{selectedProduct.name}</Typography>
              <CardMedia
                component="img"
                height="300"
                image={selectedProduct.imageUrl || 'https://via.placeholder.com/300'}
                alt={selectedProduct.name}
              />
              <Typography variant="body1" sx={{ mt: 2 }}>{selectedProduct.description}</Typography>
              {selectedProduct.specialDiscount ? (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    ${selectedProduct.price.toFixed(2)}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${(selectedProduct.price - selectedProduct.specialDiscount).toFixed(2)} ({((selectedProduct.specialDiscount / selectedProduct.price) * 100).toFixed(0)}% off)
                  </Typography>
                </>
              ) : (
                <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
                  ${selectedProduct.price.toFixed(2)}
                </Typography>
              )}
              {selectedProduct.manufacturerRebate && (
                <Typography variant="body2" color="secondary">
                  {((selectedProduct.manufacturerRebate / selectedProduct.price) * 100).toFixed(0)}% cashback
                </Typography>
              )}
              <Button variant="contained" color="primary" onClick={() => addToCart(selectedProduct)} sx={{ mt: 2 }}>
                Add to Cart
              </Button>
              <Typography variant="h6" sx={{ mt: 4 }}>Accessories</Typography>
              <Box sx={{ display: 'flex', overflowX: 'auto', mt: 2 }}>
                {selectedProduct.accessories.map(accessory => (
                  <Box key={accessory.id} sx={{ minWidth: 150, mr: 2 }}>
                    <Card>
                      <CardContent>
                        <Typography>{accessory.name}</Typography>
                        <Typography>${accessory.price.toFixed(2)}</Typography>
                        <Button variant="outlined" color="primary" onClick={() => addToCart(accessory)}>
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
              <Typography variant="h6" sx={{ mt: 4 }}>Warranty Options</Typography>
              <Box sx={{ display: 'flex', overflowX: 'auto', mt: 2 }}>
                {selectedProduct.warrantyOptions?.map((warranty, index) => (
                  <Box key={index} sx={{ minWidth: 150, mr: 2 }}>
                    <Card>
                      <CardContent>
                        <Typography>{warranty.duration} Warranty</Typography>
                        <Typography>${warranty.price.toFixed(2)}</Typography>
                        <Button variant="outlined" color="primary" onClick={() => addToCart(warranty)}>
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerView;