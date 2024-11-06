import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Import RouterLink
import OpenTicket from './OpenTicket';
import TicketStatus from './TicketStatus';

const CustomerService: React.FC = () => {
  const [view, setView] = useState<'open' | 'status' | null>(null);

  return (
    <Box sx={{ my: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Customer Service
      </Typography>
      {view === null && (
        <>
          <Button variant="contained" color="primary" sx={{ m: 1 }} onClick={() => setView('open')}>
            Open a Ticket
          </Button>
          <Button variant="contained" color="secondary" sx={{ m: 1 }} onClick={() => setView('status')}>
            Status of a Ticket
          </Button>
          <Button component={RouterLink} to="/products" variant="contained" color="primary" sx={{ m: 1 }}>
            Go Back
          </Button>
        </>
      )}
      {view === 'open' && <OpenTicket onBack={() => setView(null)} />}
      {view === 'status' && <TicketStatus onBack={() => setView(null)} />}
    </Box>
  );
};

export default CustomerService;
