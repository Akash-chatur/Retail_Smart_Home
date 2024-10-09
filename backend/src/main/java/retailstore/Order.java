package retailstore;

public class Order {
    private int id;
    private int userId;
    private String confirmation;
    private String deliveryDate;
    private String status;

    // Constructor
    public Order(int id, int userId, String confirmation, String deliveryDate, String status) {
        this.id = id;
        this.userId = userId;
        this.confirmation = confirmation;
        this.deliveryDate = deliveryDate;
        this.status = status;
    }

	// Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getConfirmation() {
        return confirmation;
    }

    public void setConfirmation(String confirmation) {
        this.confirmation = confirmation;
    }

    public String getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(String deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
