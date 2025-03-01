const express = require("express");
const cors = require("cors"); // Import the CORS middleware
const { Client } = require("@elastic/elasticsearch");
const axios = require('axios');

const app = express();
const elasticClient = new Client({ node: "http://localhost:9200" });

// Enable CORS for all routes
app.use(cors()); // This will allow requests from any origin

// Enable JSON parsing for incoming requests
app.use(express.json());

// Store data in Elasticsearch (for products and reviews)
const storeInElasticsearch = async (index, id, body) => {
  try {
    const response = await elasticClient.index({
      index,
      id,
      body,
    });
    console.log(`Stored in Elasticsearch: ${index}/${id}`, response);
  } catch (error) {
    console.error(`Error storing in Elasticsearch (${index}/${id}):`, error);
  }
};

const generateEmbedding = async (text) => {
    const apiKey = "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"; // Use your actual OpenAI API key
    
    try {
      const response = await axios.post("https://api.openai.com/v1/embeddings", {
        model: "text-embedding-3-small", // Adjust the model name if necessary
        input: text,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });
      return response.data.data[0].embedding; // Extract and return the embedding
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw error;
    }
  };

// New route to handle Elasticsearch store requests
app.post("/elasticsearch/:index/:id", async (req, res) => {
  const { index, id } = req.params; // Extract index and id from the URL params
  const body = req.body; // The body contains the data to be stored
  
  try {
    // Store data in Elasticsearch
    await storeInElasticsearch(index, id, body);
    res.status(200).send(`Data stored in Elasticsearch at ${index}/${id}`);
  } catch (error) {
    res.status(500).send("Error storing data in Elasticsearch: " + error.message);
  }
});

app.post("/recommendations", async (req, res) => {
    const { query } = req.body; 
    
    try {
      const embedding = await generateEmbedding(query);
      

    const response = await elasticClient.search({
        index: "products",
        body: {
          size: 2,
          query: {
            script_score: {
              query: { match_all: {} },
              script: {
                source: `
                  cosineSimilarity(params.queryVector, 'embedding') + 1.0
                `,
                params: {
                  queryVector: embedding, 
                },
              },
            },
          },
        },
      });
      
      
      
      // Process the response to return the recommended products
      const recommendedProducts = response.hits.hits.map(hit => {
        return {
          name: hit._source.name,
          price: hit._source.price,
          category: hit._source.category,
          shortDescription: hit._source.shortDescription,
          reviews: hit._source.reviews,
        };
      });
  
      // Return the recommended products as the response
      res.status(200).json(recommendedProducts);
  
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).send("Error generating recommendations: " + error.message);
    }
  });

  app.post("/search-reviews", async (req, res) => {
    const { query } = req.body; 
  
    try {
      const embedding = await generateEmbedding(query);
  
      // Perform a KNN or cosine similarity search in Elasticsearch to find the most relevant reviews
      const response = await elasticClient.search({
        index: "reviews", 
        body: {
          size: 3, 
          query: {
            script_score: {
              query: { match_all: {} }, 
              script: {
                source: `
                  cosineSimilarity(params.queryVector, 'embedding') + 1.0
                `,
                params: {
                  queryVector: embedding, 
                },
              },
            },
          },
        },
      });

  
      // Process the response to return the most relevant reviews
      const searchResults = response.hits.hits.map(hit => ({
        review: hit._source.review,
        productName: hit._source.productName,
        embeddingScore: hit._score, // Optional: Include score for reference
      }));
  
      // Return the search results as the response
      res.status(200).json(searchResults);
  
    } catch (error) {
      console.error("Error performing review search:", error);
      console.error("Elasticsearch Error:", JSON.stringify(error.meta.body, null, 2));
      res.status(500).send("Error performing review search: " + error.message);
    }
  });
  
  

// Start the server
app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
