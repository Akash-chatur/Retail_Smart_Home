import React, { useEffect, useState } from 'react';
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    Grid,
    Card,
    CardContent,
} from '@mui/material';

const Trending: React.FC = () => {
    const [topLikedProducts, setTopLikedProducts] = useState<any[]>([]);
    const [topZipCodes, setTopZipCodes] = useState<any[]>([]);
    const [topSoldProducts, setTopSoldProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchTrendingData = async () => {
            try {
                // Fetching the data from your backend API endpoints
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
                setTopSoldProducts(soldData);
            } catch (error) {
                console.error('Error fetching trending data:', error);
            }
        };

        fetchTrendingData();
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
                                {topLikedProducts.map((product) => (
                                    <ListItem key={product.ProductModelName}>
                                        <ListItemText
                                            primary={product.ProductModelName}
                                            secondary={`Likes: ${product.reviewCount} | Average Rating: ${product.averageRating.toFixed(1)} | Category: ${product.ProductCategory} | Price: $${product.ProductPrice.toFixed(2)}`}
                                        />
                                    </ListItem>
                                ))}
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
                                {topZipCodes.map((zipCode) => (
                                    <ListItem key={zipCode.zip}>
                                        <ListItemText primary={zipCode.zip} secondary={`Sales: ${zipCode.sales}`} />
                                    </ListItem>
                                ))}
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
                                {topSoldProducts.map((product) => (
                                    <ListItem key={product.id}>
                                        <ListItemText primary={product.name} secondary={`Sold: ${product.sold}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Trending;
