package retailstore;

import java.util.List;

public class ProductType {
	
	private int id;
    private String name;
    private String type;
    private double price;
    private String description;
    private Integer specialDiscount;
    private Integer manufacturerRebate;
    private String imageUrl;
    private int quantity;

    // New fields for accessories and warranty options
    private List<Accessory> accessories;
    private List<WarrantyOption> warrantyOptions;
    
    // Getters and Setters
    public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getSpecialDiscount() {
		return specialDiscount;
	}

	public void setSpecialDiscount(Integer specialDiscount) {
		this.specialDiscount = specialDiscount;
	}

	public Integer getManufacturerRebate() {
		return manufacturerRebate;
	}

	public void setManufacturerRebate(Integer manufacturerRebate) {
		this.manufacturerRebate = manufacturerRebate;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

    // New getters and setters for accessories and warranty options
    public List<Accessory> getAccessories() {
        return accessories;
    }

    public void setAccessories(List<Accessory> accessories) {
        this.accessories = accessories;
    }

    public List<WarrantyOption> getWarrantyOptions() {
        return warrantyOptions;
    }

    public void setWarrantyOptions(List<WarrantyOption> warrantyOptions) {
        this.warrantyOptions = warrantyOptions;
    }

    // Constructor
    public ProductType(int id, String name, String type, double price, String description, 
                   Integer specialDiscount, Integer manufacturerRebate, String imageUrl, 
                   int quantity, List<Accessory> accessories, List<WarrantyOption> warrantyOptions) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.price = price;
        this.description = description;
        this.specialDiscount = specialDiscount;
        this.manufacturerRebate = manufacturerRebate;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.accessories = accessories;
        this.warrantyOptions = warrantyOptions;
    }
}
