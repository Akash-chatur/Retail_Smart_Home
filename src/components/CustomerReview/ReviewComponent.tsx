import React, { useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, Typography, TextField, Rating, Box } from '@mui/material';
import { toast } from 'react-toastify';

interface ReviewComponentProps {
  open: boolean;
  onClose: () => void;
  productDetails: {
    ProductId: number;
    ProductModelName: string;
    ProductCategory: string;
    ProductPrice: number;
    StoreID: string;
    StoreZip: string;
    StoreCity: string;
    StoreState: string;
    ProductOnSale: boolean;
    ManufacturerName: string;
    ManufacturerRebate: boolean;
  };
}

const ReviewComponent: React.FC<ReviewComponentProps> = ({ open, onClose, productDetails }) => {
  const [reviewText, setReviewText] = useState(''); // No default values
  const [rating, setRating] = useState<number | null>(null); // No default value
  const [reviewDate, setReviewDate] = useState(''); // No default value
  const [userAge, setUserAge] = useState<number | undefined>(); // No default value
  const [userGender, setUserGender] = useState(''); // No default value
  const [userOccupation, setUserOccupation] = useState(''); // No default value
  const [userId] = useState('whksa8'); // Read-only userId

  const handleSubmitReview = async () => {
    if (rating !== null && reviewText.trim() !== '' && reviewDate && userAge && userGender && userOccupation) {
      const reviewData = {
        ProductId: productDetails.ProductId,
        ProductModelName: productDetails.ProductModelName,
        ProductCategory: productDetails.ProductCategory,
        ProductPrice: productDetails.ProductPrice,
        StoreID: productDetails.StoreID,
        StoreZip: productDetails.StoreZip,
        StoreCity: productDetails.StoreCity,
        StoreState: productDetails.StoreState,
        ProductOnSale: productDetails.ProductOnSale,
        ManufacturerName: productDetails.ManufacturerName,
        ManufacturerRebate: productDetails.ManufacturerRebate,
        UserID: userId,
        UserAge: userAge,
        UserGender: userGender,
        UserOccupation: userOccupation,
        ReviewRating: rating,
        ReviewDate: reviewDate,
        ReviewText: reviewText
      };
  
      try {
        const response = await fetch('http://localhost:8082/MyServletProject/RatingServlet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
        });

  
        console.log("response = ",response);
        if (response.ok) {
          toast.success('Review submitted successfully!');
          onClose();
        } else {
          toast.error('Failed to submit review.');
        }
      } catch (error) {
        toast.error('Error submitting review.');
      }
    } else {
      toast.error('Please fill out all fields.');
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        {/* Product Details */}
        <Box mb={3}>
          <Typography variant="h5" gutterBottom>Write a Review for {productDetails.ProductModelName}</Typography>
          <TextField
            fullWidth
            label="Product Category"
            variant="outlined"
            value={productDetails.ProductCategory}
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Product Price"
            variant="outlined"
            value={`$${productDetails.ProductPrice}`}
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Store ID"
            variant="outlined"
            value={productDetails.StoreID}
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Store Zip"
            variant="outlined"
            value={productDetails.StoreZip}
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Store City"
            variant="outlined"
            value={productDetails.StoreCity}
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Store State"
            variant="outlined"
            value={productDetails.StoreState}
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Product On Sale"
            variant="outlined"
            value={productDetails.ProductOnSale ? 'Yes' : 'No'}
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Manufacturer Name"
            variant="outlined"
            value={productDetails.ManufacturerName}
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Manufacturer Rebate"
            variant="outlined"
            value={productDetails.ManufacturerRebate ? 'Yes' : 'No'}
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
          />
        </Box>

        {/* User Details (Editable Fields) */}
        <Box mb={2}>
          <TextField
            fullWidth
            label="Your Age"
            variant="outlined"
            type="number"
            value={userAge || ''}
            onChange={(e) => setUserAge(Number(e.target.value))}
            placeholder="Enter your age"
            margin="dense"
            helperText="Please provide your age."
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Your Gender"
            variant="outlined"
            value={userGender}
            onChange={(e) => setUserGender(e.target.value)}
            placeholder="Enter your gender"
            margin="dense"
            helperText="Please specify your gender."
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Your Occupation"
            variant="outlined"
            value={userOccupation}
            onChange={(e) => setUserOccupation(e.target.value)}
            placeholder="Enter your occupation"
            margin="dense"
            helperText="Please specify your occupation."
            required
          />
        </Box>

        {/* Review Inputs */}
        <Box mb={2}>
          <Rating
            name="ReviewRating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="large"
          />
          {rating === null && <Typography color="error">Please provide a rating.</Typography>}
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Your Review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your detailed review here"
            margin="dense"
            helperText="Please provide your review."
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Review Date"
            variant="outlined"
            type="date"
            value={reviewDate}
            onChange={(e) => setReviewDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            margin="dense"
            helperText="Pick the date of your review."
            required
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSubmitReview} variant="contained" color="primary">
          Submit
        </Button>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewComponent;
