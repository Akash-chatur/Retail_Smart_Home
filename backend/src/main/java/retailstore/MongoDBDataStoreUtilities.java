package retailstore;

import com.mongodb.client.AggregateIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.bson.Document;
import org.bson.conversions.Bson;

import com.mongodb.client.model.Accumulators;  // Import Accumulators

public class MongoDBDataStoreUtilities {

    private static MongoClient mongoClient = null;
    private static MongoDatabase db = null;
    
    private static final String CONNECTION_STRING = "mongodb://localhost:27017";
    private static final String DATABASE_NAME = "reviewsDB";
    private static final String COLLECTION_NAME = "reviews";

    // Initialize MongoDB connection
    public static void initMongoDB() {
        if (mongoClient == null) {
            mongoClient = MongoClients.create("mongodb://localhost:27017");
            db = mongoClient.getDatabase("reviewsDB");
        }
    }

    // Insert review data into MongoDB
    public static boolean insertReview(String productModelName, String productCategory, double productPrice, String storeID,
                                       String storeZip, String storeCity, String storeState, boolean productOnSale,
                                       String manufacturerName, boolean manufacturerRebate, String userID, int userAge,
                                       String userGender, String userOccupation, int reviewRating, String reviewDate, String reviewText) {
        try {
            initMongoDB();

            MongoCollection<Document> collection = db.getCollection("reviews");

            Document review = new Document("ProductModelName", productModelName)
                    .append("ProductCategory", productCategory)
                    .append("ProductPrice", productPrice)
                    .append("StoreID", storeID)
                    .append("StoreZip", storeZip)
                    .append("StoreCity", storeCity)
                    .append("StoreState", storeState)
                    .append("ProductOnSale", productOnSale)
                    .append("ManufacturerName", manufacturerName)
                    .append("ManufacturerRebate", manufacturerRebate)
                    .append("UserID", userID)
                    .append("UserAge", userAge)
                    .append("UserGender", userGender)
                    .append("UserOccupation", userOccupation)
                    .append("ReviewRating", reviewRating)
                    .append("ReviewDate", reviewDate)
                    .append("ReviewText", reviewText);

            collection.insertOne(review);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
 // Fetch reviews for a specific product from MongoDB
    public static List<Document> getReviewsByProductModel(String productModelName) {
        List<Document> reviews = new ArrayList<>();
        try {
            initMongoDB();
            MongoCollection<Document> collection = db.getCollection("reviews");

            // Query to match the product model name
            Bson filter = Filters.eq("ProductModelName", productModelName);
            MongoCursor<Document> cursor = collection.find(filter).iterator();

            while (cursor.hasNext()) {
                reviews.add(cursor.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return reviews;
    }
    

    public static List<Document> getTopFiveLikedProducts() {
        List<Document> topLikedProducts = new ArrayList<>();

        try (MongoClient mongoClient = MongoClients.create(CONNECTION_STRING)) {
            MongoDatabase database = mongoClient.getDatabase(DATABASE_NAME);
            MongoCollection<Document> collection = database.getCollection("reviews");

            // Aggregate to find top 5 liked products based on available reviews
            AggregateIterable<Document> results = collection.aggregate(
                Arrays.asList(
                    Aggregates.group("$ProductModelName", 
                        Accumulators.sum("reviewCount", 1),  // Count total reviews per product
                        Accumulators.avg("averageRating", "$ReviewRating"),  // Calculate average rating
                        Accumulators.first("ProductCategory", "$ProductCategory"), // Include product category
                        Accumulators.first("ProductPrice", "$ProductPrice")       // Include product price
                    ),
                    Aggregates.sort(Sorts.descending("averageRating")),  // Sort by average rating
                    Aggregates.limit(5)  // Limit to top 5
                )
            );

            for (Document doc : results) {
                Document productDetails = new Document();
                productDetails.append("ProductModelName", doc.getString("_id"));
                productDetails.append("reviewCount", doc.getInteger("reviewCount"));
                productDetails.append("averageRating", doc.getDouble("averageRating"));
                productDetails.append("ProductCategory", doc.getString("ProductCategory"));
                productDetails.append("ProductPrice", doc.getDouble("ProductPrice"));

                topLikedProducts.add(productDetails);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("Top Liked Products: " + topLikedProducts.toString());
        return topLikedProducts;
    }






    // Close MongoDB connection (optional)
    public static void closeMongoDB() {
        if (mongoClient != null) {
            mongoClient.close();
            mongoClient = null;
        }
    }
}
