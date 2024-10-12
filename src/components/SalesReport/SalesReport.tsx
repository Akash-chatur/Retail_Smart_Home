import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SalesDataItem, DailySalesItem } from '../../types/Product';

const SalesReport: React.FC = () => {
    const [salesData, setSalesData] = useState<SalesDataItem[]>([]);
    const [dailySales, setDailySales] = useState<DailySalesItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([fetchSalesData(), fetchDailySales()])
            .then(() => setLoading(false))
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again later.');
                setLoading(false);
            });
    }, []);

    const fetchSalesData = async () => {
        try {
            const response = await fetch('http://localhost:8082/MyServletProject/OrderServlet?action=getSalesData');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("test sales data = ", data);
            setSalesData(data.salesData);
        } catch (error) {
            console.error('Error fetching sales data:', error);
            throw error;
        }
    };

    const fetchDailySales = async () => {
        try {
            const response = await fetch('http://localhost:8082/MyServletProject/OrderServlet?action=getDailySales');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("daily sales data = ", data);
            setDailySales(data.dailySales);
        } catch (error) {
            console.error('Error fetching daily sales data:', error);
            throw error;
        }
    };

    const renderProductSalesTable = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Items Sold</TableCell>
                        <TableCell>Total Sales</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {salesData.map((product: SalesDataItem) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.itemsSold}</TableCell>
                            <TableCell>${product.totalSales.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderSalesBarChart = () => (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={salesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSales" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );

    const renderDailySalesTable = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Total Sales</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dailySales.map((day: DailySalesItem) => (
                        <TableRow key={day.date}>
                            <TableCell>{day.date}</TableCell>
                            <TableCell>${day.totalSales.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Sales Report</Typography>

            <Typography variant="h5" gutterBottom>Product Sales</Typography>
            {renderProductSalesTable()}

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Total Sales by Product</Typography>
            {renderSalesBarChart()}

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Daily Sales</Typography>
            {renderDailySalesTable()}
        </Box>
    );
};

export default SalesReport;