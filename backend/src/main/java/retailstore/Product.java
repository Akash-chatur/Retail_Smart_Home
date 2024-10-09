package retailstore;

public class Product {
    private String productName;
    private String productType;
    private String productDescription;
    private int totalSold;

    public Product(String productName, String productType, String productDescription, int totalSold) {
        this.productName = productName;
        this.productType = productType;
        this.productDescription = productDescription;
        this.totalSold = totalSold;
    }

    // Getters and setters for each field (if needed)
    public String getProductName() {
        return productName;
    }

    public String getProductType() {
        return productType;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public int getTotalSold() {
        return totalSold;
    }
}
