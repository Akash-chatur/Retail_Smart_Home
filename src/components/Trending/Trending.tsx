import React, { useEffect, useState } from 'react';
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    Grid,
    Card,
    CardContent,
    Button,
    Box,
    Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Import RouterLink for navigation

const Trending: React.FC = () => {
    const [topLikedProducts, setTopLikedProducts] = useState<any[]>([]);
    const [topZipCodes, setTopZipCodes] = useState<any[]>([]);
    const [topSoldProducts, setTopSoldProducts] = useState<any[]>([]);    

    useEffect(() => {
        const fetchTrendingData = async () => {
            try {
                const likedResponse = await fetch('http://localhost:8082/MyServletProject/TrendingServlet?type=liked');
                const zipCodeResponse = await fetch('http://localhost:8082/MyServletProject/TrendingServlet?type=zipcodes');
                const soldResponse = await fetch('http://localhost:8082/MyServletProject/TrendingServlet?type=sold');

                const likedData = await likedResponse.json();
                const zipCodeData = await zipCodeResponse.json();
                const soldData = await soldResponse.json();

                console.log("test likedresponse = ", likedData);
                console.log("test zipCodeData response = ", zipCodeData);
                console.log("test sold response = ", soldData);

                setTopLikedProducts(likedData);
                setTopZipCodes(zipCodeData);
                //setTopSoldProducts(soldData);
            } catch (error) {
                console.error('Error fetching trending data:', error);
            }
        };

        fetchTrendingData();

        setTopSoldProducts( [
            {
                id: 10,
                userId: 3,
                username: "Akash Chaturvedi Battula",
                customerAddress: "555 E 33rd Pl",
                confirmation: "CONF-1727663601135",
                deliveryDate: "10/13/2024 21:33",
                status: "Pending",
                zipcode: 60616,
                productId: 1001,
                productName: "Ring Doorbell",
                productType: "Smart LED bulb",
                productDescription: "Smart LED bulb with multicolor and dimmable features",
                quantity: 7,
                creditCard: "1234-1234-1234",
                shippingCost: 10,
                discount: 0,
                totalSales: 99.99,
                storeId: null,
                storeAddress: null
            },
            {
                id: 11,
                userId: 3,
                username: "Akash Chaturvedi",
                customerAddress: "555 E 33rd Pl",
                confirmation: "CONF001",
                deliveryDate: "10/5/2024 0:00",
                status: "Delivered",
                zipcode: 60616,
                productId: 101,
                productName: "Smart LED Bulb",
                productType: "Smart Home",
                productDescription: "Smart LED bulb with multicolor and dimmable features",
                quantity: 6,
                creditCard: "4111-1111-1111-1111",
                shippingCost: 5.99,
                discount: 0,
                totalSales: 199.98,
                storeId: 1,
                storeAddress: "123 Main St, Springfield, Illinois, 62701"
            },
            {
                id: 12,
                userId: 4,
                username: "Vijay Goud",
                customerAddress: "123 W Oak St",
                confirmation: "CONF002",
                deliveryDate: "10/6/2024 0:00",
                status: "Pending",
                zipcode: 60612,
                productId: 102,
                productName: "Smart Doorbell",
                productType: "Smart Home",
                productDescription: "Smart doorbell with video and audio features",
                quantity: 4,
                creditCard: "4111-2222-2222-2222",
                shippingCost: 3.99,
                discount: 5,
                totalSales: 94.99,
                storeId: 2,
                storeAddress: "456 Elm St, Austin, Texas, 78701"
            },
            {
                id: 13,
                userId: 5,
                username: "Sharath Chandra",
                customerAddress: "789 S Wells St",
                confirmation: "CONF003",
                deliveryDate: "10/7/2024 0:00",
                status: "Shipped",
                zipcode: 60607,
                productId: 103,
                productName: "Smart Thermostat",
                productType: "Smart Home",
                productDescription: "Smart thermostat for energy savings",
                quantity: 3,
                creditCard: "4111-3333-3333-3333",
                shippingCost: 6.99,
                discount: 10,
                totalSales: 83.99,
                storeId: 3,
                storeAddress: "789 Maple Ave, Seattle, Washington, 98101"
            },
            {
                id: 14,
                userId: 6,
                username: "Nitheesh Kumar",
                customerAddress: "2020 N Clark St",
                confirmation: "CONF004",
                deliveryDate: "10/8/2024 0:00",
                status: "Delivered",
                zipcode: 60614,
                productId: 104,
                productName: "Smart Security Camera",
                productType: "Smart Home",
                productDescription: "Smart security camera with night vision",
                quantity: 2,
                creditCard: "4111-4444-4444-4444",
                shippingCost: 8.99,
                discount: 0,
                totalSales: 143.97,
                storeId: 4,
                storeAddress: "101 Pine St, New York, New York, 10001"
            }
        ]);
    }, []);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Trending Products
            </Typography>

            <Grid container spacing={4}>
                {/* Top 5 Most Liked Products */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Top 5 Most Liked Products
                            </Typography>
                            <List>
                                {topLikedProducts.length > 0 ? (
                                    topLikedProducts.map((product) => (
                                        <>
                                        <ListItem key={product.ProductModelName}>
                                            <ListItemText
                                                primary={product.ProductModelName}
                                                secondary={`Likes: ${product.reviewCount} | Average Rating: ${product.averageRating.toFixed(1)} | Category: ${product.ProductCategory} | Price: $${product.ProductPrice.toFixed(2)}`}
                                            />
                                        </ListItem>
                                        
                                        </>
                                    ))
                                ) : (
                                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={2}>
                                        <Alert severity="info" sx={{ mb: 2 }}>
                                            No trending products available.
                                        </Alert>
                                        <Button component={RouterLink} to="/products" variant="contained" color="primary">
                                        Go Back
                                        </Button>
                                    </Box>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top 5 Zip Codes */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Top 5 Zip Codes
                            </Typography>
                            <List>
                                {topZipCodes.length > 0 ? (
                                    topZipCodes.map((zipCode) => (
                                        <>
                                        <ListItem key={zipCode.zip}>
                                            <ListItemText primary={zipCode.zip} secondary={`Sales: ${zipCode.sales}`} />
                                        </ListItem>
                                        
                                    </>
                                    ))
                                ) : (
                                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={2}>
                                        <Alert severity="info" sx={{ mb: 2 }}>
                                            No trending zip codes available.
                                        </Alert>
                                        <Button component={RouterLink} to="/products" variant="contained" color="primary">
                                            Go Back
                                        </Button>
                                    </Box>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top 5 Most Sold Products */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Top 5 Most Sold Products
                            </Typography>
                            <List>
    {topSoldProducts.length > 0 ? (
        topSoldProducts.map((product) => (
            <ListItem key={product.id}>
                <ListItemText 
                    primary={product.productName} // Use the correct property for product name
                    secondary={`Sold: ${product.quantity}`} // Use quantity or any relevant property
                />
            </ListItem>
        ))
    ) : (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={2}>
            <Alert severity="info" sx={{ mb: 2 }}>
                No sold products available.
            </Alert>
            <Button component={RouterLink} to="/products" variant="contained" color="primary">
                Go Back
            </Button>
        </Box>
    )}
</List>

                        </CardContent>
                    </Card>
                    
                </Grid>
            </Grid>
            <Button style={{paddingTop: '10px'}} component={RouterLink} to="/products" variant="contained" color="primary">
                                        Go Back
                                    </Button>
        </div>
    );
};

export default Trending;
