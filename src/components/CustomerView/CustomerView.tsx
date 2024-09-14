import React, { useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { Product } from '../../types/Product';
import { initialProducts } from '../../data/products';

interface CustomerViewProps {
  addToCart: (product: Product) => void;
}

const CustomerView: React.FC<CustomerViewProps> = ({ addToCart }) => {
  const [products] = useState<Product[]>(initialProducts);

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card>
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
              <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
                ${product.price.toFixed(2)}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => addToCart(product)} sx={{ mt: 2 }}>
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
export default CustomerView;