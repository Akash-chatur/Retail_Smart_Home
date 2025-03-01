package retailstore;

public class SalesDataItem {
    private String name;
    private double price;
    private int itemsSold;
    private double totalSales;
    
    public SalesDataItem(String name, double price, int itemSold, double totalSales) {
		// TODO Auto-generated constructor stub
    	this.name = name;
    	this.price = price;
    	this.itemsSold = itemSold;
    	this.totalSales = totalSales;
	}
    
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public double getPrice() {
		return price;
	}
	
	public void setPrice(double price) {
		this.price = price;
	}
	
	public int getItemsSold() {
		return itemsSold;
	}
	
	public void setItemsSold(int itemsSold) {
		this.itemsSold = itemsSold;
	}
	
	public double getTotalSales() {
		return totalSales;
	}
	
	public void setTotalSales(double totalSales) {
		this.totalSales = totalSales;
	}
	    
}