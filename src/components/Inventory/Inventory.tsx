import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Product } from '../../types/Product';

const Inventory: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8082/MyServletProject/ProductServlet?action=search&keyword=`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("test inventory data = ",data)
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again later.');
            setLoading(false);
        }
    };


    const renderProductTable = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product: Product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderBarChart = () => (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={products}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );

    const renderSaleProductsTable = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Special Discount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.filter((product: Product) => product.specialDiscount && product.specialDiscount > 0).map((product: Product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>${product.specialDiscount?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderRebateProductsTable = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Manufacturer Rebate</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.filter((product: Product) => product.manufacturerRebate && product.manufacturerRebate > 0).map((product: Product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>${product.manufacturerRebate?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
    );

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Inventory Management</Typography>

            <Typography variant="h5" gutterBottom>All Products</Typography>
            {renderProductTable()}

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Product Quantity Chart</Typography>
            {renderBarChart()}

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Products on Sale</Typography>
            {renderSaleProductsTable()}

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Products with Manufacturer Rebates</Typography>
            {renderRebateProductsTable()}
        </Box>
    );
};

export default Inventory;
