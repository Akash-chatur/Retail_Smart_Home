package retailstore;

public class OrderRequest {
    int user_id;             // User ID of the customer
    String userName;         // Name of the user
    String customerAddress;
    String zipcode;          // Zipcode (previously 'address')
    String creditCard;       // Credit card information
    String orderId;          // Order confirmation ID
    String purchaseDate;     // Date of purchase
    String shipDate;         // Date of shipping
    int productId;           // ID of the product
    String productName;      // Name of the product
    String catergory;
    String productType;      // Type of the product (add this if necessary)
    String productDescription; // Description of the product (add this if necessary)
    int quantity;            // Quantity of the product ordered
    double price;            // Price of the product
    double shippingCost;     // Cost of shipping
    double discount;         // Discount applied
    double totalSales;       // Total sales amount
    String storeId;         // Store ID for pickup (nullable)
    String storeAddress;     // Address of the store (optional)
}
