import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import Compressor from 'compressorjs';

interface OpenTicketProps {
  onBack: () => void;
}

const OpenTicket: React.FC<OpenTicketProps> = ({ onBack }) => {
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [ticketStatus, setTicketStatus] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      console.log('Image selected:', event.target.files[0].name);
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        success: (compressedResult) => resolve(compressedResult as File),
        error: (error) => reject(error),
      });
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload

    const formData = new FormData();
    const userId = localStorage.getItem('userId');
    const userIdInt = userId !== null ? parseInt(userId) : 0;

    formData.append('subject', subject);
    formData.append('details', details);
    formData.append('description', description);
    formData.append('userId', userIdInt.toString());

    if (selectedImage) {
      try {
        const compressedImage = await compressImage(selectedImage);
        const reader = new FileReader();

        const imageFormat = "jpeg"; // Change this value to "png" if you have a PNG image

let imageFile = {
  mimetype: imageFormat === "jpeg" ? "image/jpeg" : "image/png"
};

        reader.onloadend = async () => {
          const base64Image = reader.result as string;

          if (base64Image) {
            const base64Data = base64Image.split(',')[1]; // Get base64 string

            const optimizedContent = [
                {
                  type: "text",
                  text: `Classify this image as "Refund Order", "Replace Order", or "Escalate to Human Agent". 

                  Analyze this shipping package image and determine if it needs: 1. Refund Order, 2. Replace Order, or
                   3. Escalate to Human Agent. Consider damage level and packaging condition. If the package is heavily 
                   damaged then only consider refund, if it is moderately damaged consider replace otherwise escalate to human agent

              
              Dont include "Refund Order" or "Replace Order" if it is an escalate
              Please analyze the image data provided below and apply these criteria for accurate classification. 
              If the packaging is significantly damaged and could affect the product, classify it as a **Refund Order**.
              and also please clearly include the classification terms in the resposne whether they are "Refund Order" or
               "Replace Order" or "Escalate to Human Agent" include the names as it is in the response`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${imageFile.mimetype};base64,${base64Data}`
                  }
                }
              ];
            try {
              // Send the image to OpenAI's GPT model
              const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer <API_KEY>`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'gpt-4o-2024-08-06',
                  messages: [
                    {
                      role: 'user',
                      content: optimizedContent,
                    },
                  ],
                }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                console.error('OpenAI API error:', errorData);
                throw new Error(`OpenAI API error: ${errorData.error.message}`);
              }

              const openAIResponse = await response.json();
              const decision = processOpenAIResponse(openAIResponse);

              // Append the decision to the formData
              formData.append('status', decision);
              formData.append('image', compressedImage, compressedImage.name);

              // Now submit the formData to your servlet
              const ticketResponse = await fetch('http://localhost:8082/MyServletProject/SupportTicketServlet', {
                method: 'POST',
                body: formData,
              });

              if (!ticketResponse.ok) {
                throw new Error('Failed to submit ticket');
              }

              const ticketData = await ticketResponse.json();
              if (ticketData.ticketNumber) {
                setTicketNumber(ticketData.ticketNumber);
                setTicketStatus(ticketData.status);
                alert(`Ticket Submitted! Ticket Number: ${ticketData.ticketNumber} - Status: ${ticketData.status}`);
              }
            } catch (error) {
              console.error('Error processing image or submitting ticket:', error);
              alert('Failed to process image or submit ticket. Please try again.');
            }
          } else {
            console.error('Error reading image: result is null');
          }
        };

        reader.readAsDataURL(compressedImage);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    } else {
      // If no image is selected, just submit the ticket with the default status
      formData.append('status', 'No image uploaded');
      try {
        const ticketResponse = await fetch('http://localhost:8082/MyServletProject/SupportTicketServlet', {
          method: 'POST',
          body: formData,
        });

        if (!ticketResponse.ok) {
          throw new Error('Failed to submit ticket');
        }

        const ticketData = await ticketResponse.json();
        if (ticketData.ticketNumber) {
          setTicketNumber(ticketData.ticketNumber);
          setTicketStatus(ticketData.status);
          alert(`Ticket Submitted! Ticket Number: ${ticketData.ticketNumber} - Status: ${ticketData.status}`);
        }
      } catch (error) {
        console.error('Error submitting ticket:', error);
        alert('Failed to submit ticket. Please try again.');
      }
    }
  };

  // Function to process OpenAI's response and return the decision
  const processOpenAIResponse = (data: any) => {
    if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
      const content = data.choices[0].message.content;
      console.log("api content = ", content);
  
      // Normalize the content to handle case sensitivity and extra spaces
      const normalizedContent = content.toLowerCase().trim();
      if (content.includes('Refund Order')) {
        return 'Refund Order';
      } else if (content.includes('Replace Order')) {
        return 'Replace Order';
      } else if (content.includes('Human Agent')) {
        return 'Escalate to Human Agent';
      }
    }
    return 'Unknown status';
  };
  

  return (
    <Paper sx={{ p: 4, mx: 'auto', maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
        Open a Support Ticket
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Subject"
          fullWidth
          variant="outlined"
          sx={{ mb: 3 }}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          label="Shipment/Product Details"
          placeholder="Enter details about the received shipment box or product"
          multiline
          rows={3}
          fullWidth
          variant="outlined"
          sx={{ mb: 3 }}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <TextField
          label="Description"
          placeholder="Describe the issue or concern"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          sx={{ mb: 3 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Upload Image of Product/Box
        </Typography>
        <Box display="flex" alignItems="center">
          <Button
            variant="contained"
            component="label"
            color="secondary"
            sx={{ mb: 3, mr: 2 }}
          >
            Choose Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {selectedImage && (
            <Typography variant="body2" color="text.secondary">
              {selectedImage.name}
            </Typography>
          )}
        </Box>

        {selectedImage && (
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'center',
              maxHeight: 300,
              overflow: 'hidden',
              borderRadius: 1,
            }}
          >
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Product or Box Preview"
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
            />
          </Box>
        )}

        {ticketNumber && ticketStatus && (
          <Typography variant="body1" sx={{ mt: 3, textAlign: 'center', color: 'green' }}>
            Ticket Submitted! Ticket Number: {ticketNumber} - Status: {ticketStatus}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Submit Ticket
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={onBack}
        >
          Back
        </Button>
      </form>
    </Paper>
  );
};

export default OpenTicket;
