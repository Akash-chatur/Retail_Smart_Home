import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

interface TicketDetails {
  ticketNumber: string;
  subject: string;
  description: string;
  imagePath: string | null; // Image path can be null
  status: string;
  createdAt: string; // Adjust if it's a Date object
}

interface TicketStatusProps {
  onBack: () => void;
}

const TicketStatus: React.FC<TicketStatusProps> = ({ onBack }) => {
  const [ticketId, setTicketId] = useState('');
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
  const [error, setError] = useState('');

  const handleCheckStatus = async () => {
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch(`http://localhost:8082/MyServletProject/SupportTicketServlet?ticketNumber=${ticketId}&userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Ticket not found');
      }
      
      const data: TicketDetails = await response.json();
      // Extract the relative image path from the full path
      const relativeImagePath = data.imagePath ? data.imagePath.replace(/.*?assets\\images\\/i, 'assets/images/') : null;

      // Update the ticket details with the relative image path
      setTicketDetails({ ...data, imagePath: relativeImagePath });
      setError('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setTicketDetails(null);
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Check Ticket Status
      </Typography>
      <TextField
        label="Ticket ID"
        fullWidth
        sx={{ mb: 2 }}
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
      />
      <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleCheckStatus}>
        Check Status
      </Button>
      <Button variant="outlined" onClick={onBack}>
        Back
      </Button>

      {error && <Typography color="error">{error}</Typography>}
      
      {ticketDetails && (
        <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
          <Typography variant="h6">Ticket Details</Typography>
          <Typography><strong>Ticket Number:</strong> {ticketDetails.ticketNumber}</Typography>
          <Typography><strong>Subject:</strong> {ticketDetails.subject}</Typography>
          <Typography><strong>Description:</strong> {ticketDetails.description}</Typography>
          {ticketDetails.imagePath && (
            <Box sx={{ mt: 2, maxWidth: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
              <Typography><strong>Image:</strong></Typography>
              <img 
                src={ticketDetails.imagePath} 
                alt="Ticket Upload" 
                style={{ 
                  width: '100%', // Ensure the image takes the full width of the container
                  height: 'auto', // Maintain aspect ratio
                  maxHeight: '300px', // Cap the height to 300px
                  objectFit: 'contain', // Ensure the whole image is visible
                  borderRadius: '4px', // Optional: adds some corner radius
                  marginTop: '8px' // Optional: adds space above the image
                }} 
              />
            </Box>
          )}
          <Typography><strong>Status:</strong> {ticketDetails.status}</Typography>
          <Typography><strong>Created At:</strong> {ticketDetails.createdAt}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default TicketStatus;
