import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box, Paper, ToggleButton, ToggleButtonGroup, TextField, InputAdornment, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import { OrderProvider } from './components/OrderPlacement/OrderContext';
import { UserProvider } from './components/UserManagement/UserContext';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import ProductManagement from './components/ProductManagement/ProductManagement';
import CustomerView from './components/CustomerView/CustomerView';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import OrderForm from './components/OrderPlacement/OrderForm';
import OrderStatus from './components/OrderPlacement/OrderStatus';
import ManageUsers from './components/UserManagement/ManageUsers';
import { Accessory, Product, WarrantyOption } from './types/Product';
import initialProducts from './data/products.json';
import Trending from './components/Trending/Trending';
import Inventory from './components/Inventory/Inventory';
import SalesReport from './components/SalesReport/SalesReport';
import CustomerService from './components/CustomerService/CustomerService';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

export type CartItem = (Product | Accessory | WarrantyOption) & {
  quantity: number;
};

const AuthenticatedApp: React.FC = () => {
  const { user, logout } = useAuth();
  const [cart, setCart] = React.useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  interface RecommendedProduct {
    name: string;
    price: number;
    category: string;
    shortDescription: string;
    embedding?: number[]; 
    reviews?: string[];
  }

  interface SearchResult {
    review: string;
    productName: string;
    embeddingScore: number;
  }
  
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false)

  
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  
  // Function to generate embeddings
  const generateEmbedding = async (text: string): Promise<number[]> => {
    const apiKey = "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"; // Secure this key in the backend if possible.
  
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/embeddings",
        {
          model: "text-embedding-3-small", 
          input: text,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      return response.data.data[0].embedding; // Extract embedding
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw error;
    }
  };
  
  // Store data in Elasticsearch
  const storeInElasticsearch = async (index: string, id: string, body: any) => {
    try {
      const response = await axios.post(`http://localhost:3001/elasticsearch/${index}/${id}`, body);
      console.log(`Stored in Elasticsearch: ${index}/${id}`, response);
    } catch (error) {
      console.error(`Error storing in Elasticsearch (${index}/${id}):`, error);
    }
  };
  
  // Function to generate reviews for a given product
  const generateReviews = async (productName: string): Promise<string[]> => {
    const apiKey = "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"; // Replace with your actual API key
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Generate 5 unique reviews for the following SmartHome product: "${productName}". Each review should be 50-100 words long and should include details like product performance, usability, and features. Ensure the reviews are diverse in tone, from positive to neutral to critical.
             
              `,
            },
          ],
        }),
      });
  
      const data = await response.json();
      const reviews = data.choices[0].message.content.trim().split("\n");
  
      return reviews; // Return reviews as an array
    } catch (error) {
      console.error("Error generating reviews:", error);
      throw error;
    }
  };
  
  // Generate products with embeddings and reviews
  const generateProductsWithEmbeddingsAndReviews = async (): Promise<RecommendedProduct[]> => {
    const apiKey = "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";
  
    try {
      const productResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Generate 10 SmartHome product records in JSON format with the following fields:
                - Product Name
                - Price (in USD)
                - Category
                - Short Description (100 words max)
                
                Categories: Smart Doorbells, Smart Doorlocks, Smart Speakers, Smart Lightings, Smart Thermostats (generate 2 in each catergory).
                give me to the point in json array format response and nothing else`,
            },
          ],
        }),
      });
  
      const data = await productResponse.json();
      console.log("test data = ",data)
      const cleanedContent = data.choices[0].message.content
      .replace(/```json/g, '')  // Remove the opening "```json"
      .replace(/```/g, '')      // Remove the closing "```"
      .trim();                  // Remove any extra spaces or line breaks
      const productRecords: RecommendedProduct[] = JSON.parse(cleanedContent);

       // Map the keys to camelCase
       const mappedProductRecords: RecommendedProduct[] = productRecords.map((product: any) => ({
        name: product["Product Name"],
        price: product["Price"],
        category: product["Category"],
        shortDescription: product["Short Description"],
    }));
  
      const productsWithEmbeddingsAndReviews = await Promise.all(
        mappedProductRecords.map(async (product, index) => {
          const productEmbedding = await generateEmbedding(`${product.name}. ${product.shortDescription}`);
          const reviews = await generateReviews(product.name);

          // Store product embedding in Elasticsearch
          await storeInElasticsearch("products", `product-${index}`, {
              name: product.name,
              category: product.category,
              price: product.price,
              shortDescription: product.shortDescription,
              embedding: productEmbedding,
          });
  
          //Store review embeddings in Elasticsearch
          reviews.forEach(async (review, reviewIndex) => {
            const reviewEmbedding = await generateEmbedding(review);
            await storeInElasticsearch("reviews", `review-${index}-${reviewIndex}`, {
              productName: product.name,
              review,
              embedding: reviewEmbedding,
            });
          });
  
          return { ...product, productEmbedding, reviews };
        })
      );
  
      return productsWithEmbeddingsAndReviews;
    } catch (error) {
      console.error("Error generating products with embeddings:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const productData = await generateProductsWithEmbeddingsAndReviews();
        setRecommendedProducts(productData); // products are of type Product[]

      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchRecommendedProducts();
    console.log("use effect recommended products = ", recommendedProducts)
  }, []);
  


  const [searchQuery, setSearchQuery] = useState('');

  const [recommendedProduct, setRecommendedProduct] = useState('');

  const handleSearch = async () => {
    console.log(`Searching for: ${searchQuery}`);
    
    try {
      const response = await axios.post('http://localhost:3001/search-reviews', { query: searchQuery });
      console.log('Search Results:', response.data);
      setSearchResults(response.data); 
      setSearchOpen(true);
      console.log("search open ",searchOpen)
    } catch (error) {
      console.error('Error searching reviews:', error);
    }
  };
  
  const handleCloseSearch = () => {
    setSearchOpen(false);
  };

  const handleCloseProduct = () => {
    setProductOpen(false);
  };


  const handleRecommendations = async () => {
    console.log(`Recommending for: ${recommendedProduct}`);
  
  try {
    const response = await axios.post('http://localhost:3001/recommendations', { query: recommendedProduct });
    console.log('Recommended Products:', response.data);
    setRecommendedProducts(response.data); 
    setProductOpen(true);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
  }

  const clearCart = () => setCart([]);

  const addToCart = (item: Product | Accessory | WarrantyOption) => {
    const newItem = { ...item, quantity: 1 };
    setCart(prevCart => [...prevCart, newItem]);
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  let storedProducts: Product[] = [];

React.useEffect(() => {
  const productsFromStorage = localStorage.getItem('products');
  if (productsFromStorage) {
    storedProducts = JSON.parse(productsFromStorage) as Product[];
  } else {
    localStorage.setItem('products', JSON.stringify(initialProducts));
    storedProducts = initialProducts;
  }
}, []);

return (
  <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          RetailStore
        </Typography>
        {user?.role === 'Customer' && (
          <>
            <Button color="inherit" component={Link} to="/trending">Trending</Button>
            <Button color="inherit" component={Link} to="/customer-service">Customer Service</Button>
            <Button color="inherit" component={Link} to="/cart">Cart ({cart.length})</Button>
          </>
        )}
        {user?.role === 'Store Manager' && (
          <>
            <Button color="inherit" component={Link} to="/inventory">Inventory</Button>
            <Button color="inherit" component={Link} to="/sales-report">Sales Report</Button>
          </>
        )}
        <Button color="inherit" onClick={logout}>Logout</Button>
      </Toolbar>
    </AppBar>

    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          HEY !, {user?.username} Welcome Back
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4 }}>
          {/* Search Reviews Input */}
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search Reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" color="secondary" onClick={handleSearch}>
            Search Reviews
          </Button>

          {/* Recommend Product Input */}
          <TextField
            size="small"
            variant="outlined"
            placeholder="Recommend Product..."
            value={recommendedProduct}
            onChange={(e) => setRecommendedProduct(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" color="secondary" onClick={handleRecommendations}>
            Recommend Product
          </Button>
        </Box>

        {/* Search Results Dialog */}
        <Dialog open={searchOpen} onClose={handleCloseSearch}>
          <DialogTitle>Search Results</DialogTitle>
          <DialogContent>
            <List>
              {searchResults.map((result, index) => (
                <ListItem key={index}>
                  <div style={{ width: '100%' }}>
                    <Typography variant="h6">Product Name: {result.productName}</Typography>
                    <Typography variant="body1" paragraph>Product Review: {result.review}</Typography>
                  </div>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSearch} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Recommended Products Dialog */}
        <Dialog open={productOpen} onClose={handleCloseProduct}>
          <DialogTitle>Recommended Products</DialogTitle>
          <DialogContent>
            <List>
              {recommendedProducts.map((result, index) => (
                <ListItem key={index}>
                  <div style={{ width: '100%' }}>
                    <Typography variant="h6">Category: {result.category}</Typography>
                    <Typography variant="body1" paragraph>Device Name: {result.name}</Typography>
                    <Typography variant="body1" paragraph>Price: {result.price}</Typography>
                    <Typography variant="body1" paragraph>Description: {result.shortDescription}</Typography>
                  </div>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseProduct} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Route-based Content */}
        <Routes>
          {user?.role === 'Store Manager' && (
            <>
              <Route path="/manage-products" element={<ProductManagement />} />
              <Route path="/sales-report" element={<SalesReport />} />
              <Route path="/inventory" element={<Inventory />} />
            </>
          )}
          {user?.role === 'Salesman' && (
            <Route path="/manage-users" element={<ManageUsers />} />
          )}
          {user?.role === 'Customer' && (
            <>
              <Route path="/trending" element={<Trending />} />
              <Route path="/products" element={<CustomerView addToCart={addToCart} />} />
              <Route path="/cart" element={<ShoppingCart cart={cart} removeFromCart={removeFromCart} updateCartQuantity={updateCartQuantity} />} />
              <Route path="/order" element={<OrderForm clearCart={clearCart} cart={cart} />} />
              <Route path="/order-status" element={<OrderStatus />} />
              <Route path="/customer-service" element={<CustomerService />} />
            </>
          )}
          <Route path="*" element={<Navigate to={user?.role === 'Customer' ? "/products" : user?.role === 'Salesman' ? "/manage-users" : "/manage-products"} />} />
        </Routes>
      </Box>
    </Container>
  </Box>
);

};

const UnauthenticatedApp: React.FC = () => {
  const [showLogin, setShowLogin] = React.useState(true);

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          SmartHome
        </Typography>
        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup
            color="primary"
            value={showLogin}
            exclusive
            onChange={(_, newValue) => setShowLogin(newValue)}
            aria-label="auth mode"
            fullWidth
          >
            <ToggleButton value={true}>Login</ToggleButton>
            <ToggleButton value={false}>Signup</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {showLogin ? <Login /> : <Signup />}
      </Paper>
    </Container>
  );
};

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </ThemeProvider>
  );
};

const AppWithAuth: React.FC = () => (
  <Router>
    <AuthProvider>
      <OrderProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </OrderProvider>
    </AuthProvider>
  </Router>
);

export default AppWithAuth;