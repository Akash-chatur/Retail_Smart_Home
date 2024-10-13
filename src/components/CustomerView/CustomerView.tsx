import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, CardMedia, Typography, Button, Tabs, Tab, Dialog,
  DialogContent, IconButton, Box, Chip, Divider, Rating, Stack, Slide,
  DialogActions, CircularProgress,
  InputAdornment,
  TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link as RouterLink } from 'react-router-dom';
import { Product, Accessory, WarrantyOption, Review } from '../../types/Product';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReviewComponent from '../CustomerReview/ReviewComponent';
import Autocomplete from '@mui/material/Autocomplete';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [openViewReviewsDialog, setOpenViewReviewsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch product suggestions from ProductServlet based on the search term
  const fetchProductSuggestions = async (search: string) => {
    try {
      const response = await fetch(`http://localhost:8082/MyServletProject/ProductServlet?action=suggestions&keyword=${search}`);
      const data = await response.json();
      // Assuming that the API returns an array of product names
      setSuggestions(data.map((product: Product) => product.name));
    } catch (error) {
      console.error('Error fetching product suggestions:', error);
    }
  };

  // Fetch products based on the search term when it changes
  useEffect(() => {
    const fetchProductsBySearch = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8082/MyServletProject/ProductServlet?action=search&keyword=${searchTerm}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchProductsBySearch();
    } else {
      fetchProducts(); // If searchTerm is empty, fetch all products
    }
  }, [searchTerm]);


  // Fetch suggestions based on the search term
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim()) {
        try {
          const response = await fetch(`http://localhost:8082/MyServletProject/ProductServlet?action=suggestions&keyword=${searchTerm}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setSuggestions(data); // Set suggestions with matching product names
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]); // Clear suggestions if searchTerm is empty
      }
    };

    fetchSuggestions();
  }, [searchTerm]);


  // Fetch all products if no search term is specified
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8082/MyServletProject/ProductServlet?action=search&keyword=`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("data fetched = ", data);
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
      setLoading(false);
    }
  };

  const handleTypeChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedType(newValue);
    setSelectedProduct(null);
  };

  const handleSearchChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log("newValue = ",newValue)
    setSearchTerm(newValue);
    fetchProductSuggestions(newValue);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
    fetchReviews(product.name);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (item: Product | Accessory | WarrantyOption) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const handleOpenReviewDialog = () => {
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
  };

  const handleOpenViewReviewsDialog = () => {
    setOpenViewReviewsDialog(true);
  };

  const handleCloseViewReviewsDialog = () => {
    setOpenViewReviewsDialog(false);
  };

  const fetchReviews = async (productModelName: string) => {
    try {
      const response = await fetch(`http://localhost:8082/MyServletProject/RatingServlet?ProductModelName=${productModelName}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const reviews = await response.json();
        setReviews(reviews);
      } else {
        console.error('Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const filteredProducts = selectedType === "All" ? products : products.filter(product => product.type === selectedType);
  console.log("filtered products = ", filteredProducts)

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <ToastContainer />
      <Button
        component={RouterLink}
        to="/order-status"
        variant="contained"
        color="secondary"
        sx={{ mb: 3, borderRadius: 2, paddingX: 4 }}
      >
        View Order Status
      </Button>

      {/* Search Bar */}
      <Autocomplete
  options={suggestions}
  freeSolo
  inputValue={searchTerm}
  onInputChange={(event, newValue) => {
    setSearchTerm(newValue);
    handleSearchChange(event, newValue);
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      variant="outlined"
      placeholder="Search products..."
      fullWidth
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  )}
  renderOption={(props, option) => (
    <Box component="li" {...props}>
      {option}
    </Box>
  )}
/>

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
          <Tab key={type} label={type} value={type} sx={{ textTransform: 'none' }} />
        ))}
      </Tabs>

      <Grid container spacing={4}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              onClick={() => handleProductClick(product)}
              sx={{
                maxWidth: 345,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 5,
                }
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={process.env.PUBLIC_URL + product.imageUrl}
                alt={product.name}
                sx={{ objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>

                {product.specialDiscount ? (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', mt: 1 }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ${(product.price - product.specialDiscount).toFixed(2)}
                      <Chip label={`${((product.specialDiscount / product.price) * 100).toFixed(0)}% off`} size="small" sx={{ ml: 1 }} />
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h6" color="text.primary" sx={{ mt: 2, fontWeight: 'bold' }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                )}
                {product.manufacturerRebate !== undefined && product.manufacturerRebate > 0 && (
                  <Typography variant="body2" color="secondary" sx={{ mt: 1 }}>
                    {((product.manufacturerRebate / product.price) * 100).toFixed(0)}% cashback
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(product)}
                  sx={{ mt: 2, borderRadius: 2 }}
                  fullWidth
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" TransitionComponent={Slide} >
        <DialogContent sx={{ position: 'relative' }}>
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
              {/* Carousel for Product Images */}
              <Carousel
                showArrows
                showThumbs={false}
                infiniteLoop
                autoPlay
                interval={3000}
                transitionTime={500}
              //sx={{ borderRadius: 3, mb: 4 }}
              >
                {Array.isArray(selectedProduct.imageUrl) ? (
                  selectedProduct.imageUrl.map((imgUrl: string, index: number) => (
                    <CardMedia
                      key={index}
                      component="img"
                      height="350"
                      image={process.env.PUBLIC_URL + imgUrl}
                      alt={selectedProduct.name}
                      sx={{ objectFit: 'cover', borderRadius: 2 }}
                    />
                  ))
                ) : (
                  [ // Wrap the single element in an array
                    <CardMedia
                      key={selectedProduct.id} // Assuming each product has a unique id
                      component="img"
                      height="350"
                      image={process.env.PUBLIC_URL + selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      sx={{ objectFit: 'cover', borderRadius: 2 }}
                    />
                  ]
                )}
              </Carousel>

              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mt: 2 }}>
                {selectedProduct.name}
              </Typography>

              <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 3, textAlign: 'justify' }}>
                {selectedProduct.description}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                Price: ${selectedProduct.price.toFixed(2)}
              </Typography>

              {selectedProduct.manufacturerRebate && (
                <Typography variant="body2" color="secondary" sx={{ mb: 3 }}>
                  {((selectedProduct.manufacturerRebate / selectedProduct.price) * 100).toFixed(0)}% cashback
                </Typography>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddToCart(selectedProduct)}
                sx={{ mt: 2, borderRadius: 3, '&:hover': { backgroundColor: '#1976d2' } }}
                fullWidth
              >
                Add to Cart
              </Button>

              <Divider sx={{ mt: 4, mb: 2 }} />

              <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
                Manage Your Experience
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenReviewDialog}
                  sx={{ borderRadius: 1, flex: 1, mr: 1, '&:hover': { backgroundColor: '#1976d2' } }}
                >
                  Write Review
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleOpenViewReviewsDialog}
                  sx={{ borderRadius: 1, flex: 1, ml: 1, '&:hover': { borderColor: '#1976d2', color: '#1976d2' } }}
                >
                  View Reviews
                </Button>
              </Box>

              <Divider sx={{ mt: 4, mb: 2 }} />


              {/* Accessories Section */}
              <Typography variant="h6" sx={{ mb: 2 }}>Accessories</Typography>
              <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2 }}>
                {selectedProduct.accessories.map(accessory => (
                  <Card key={accessory.id} sx={{ minWidth: 150 }}>
                    <CardContent>
                      <Typography variant="body1">{accessory.name}</Typography>
                      <Typography>${accessory.price.toFixed(2)}</Typography>
                      <Button variant="outlined" color="primary" onClick={() => handleAddToCart(accessory)} sx={{ mt: 1 }}>
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Warranty Section */}
              <Typography variant="h6" sx={{ mt: 4 }}>Warranty Options</Typography>
              <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2 }}>
                {selectedProduct.warrantyOptions?.map(warranty => (
                  <Card key={warranty.id} sx={{ minWidth: 150 }}>
                    <CardContent>
                      <Typography variant="body1">{warranty.duration} Warranty</Typography>
                      <Typography>${warranty.price.toFixed(2)}</Typography>
                      <Button variant="outlined" color="primary" onClick={() => handleAddToCart(warranty)} sx={{ mt: 1 }}>
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Review Dialog */}
              {selectedProduct && (
                <ReviewComponent
                  open={openReviewDialog}
                  onClose={handleCloseReviewDialog}
                  productDetails={{
                    ProductId: selectedProduct.id,
                    ProductModelName: selectedProduct.name,
                    ProductCategory: selectedProduct.type ? selectedProduct.type : ' ',
                    ProductPrice: selectedProduct.price,
                    StoreID: "SmartPortables of Chicago",
                    StoreZip: "60616",
                    StoreCity: "Chicago",
                    StoreState: "IL",
                    ProductOnSale: selectedProduct.onSale ? selectedProduct.onSale : true,
                    ManufacturerName: selectedProduct.manufacturer ? selectedProduct.manufacturer : "Manufacturer",
                    ManufacturerRebate: !!selectedProduct.manufacturerRebate,
                  }}
                />
              )}

              {/* View Reviews Dialog */}
              <Dialog open={openViewReviewsDialog} onClose={handleCloseViewReviewsDialog}>
                <DialogContent>
                  <Typography variant="h6">Reviews for {selectedProduct?.name}</Typography>
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Rating value={review.ReviewRating} readOnly /> {/* Use ReviewRating here */}
                        <Typography variant="body2">{review.ReviewText}</Typography> {/* Display the review text */}
                        <Divider sx={{ my: 1 }} />
                      </Box>
                    ))
                  ) : (
                    <Typography>No reviews available.</Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseViewReviewsDialog}>Close</Button>
                </DialogActions>
              </Dialog>


            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerView;