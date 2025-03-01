package retailstore;

import java.sql.Date;

public class DailySalesItem {
	
    private Date date;
    private double totalSales;
    
    public DailySalesItem(Date date, double totalSales) {
		this.date = date;
		this.totalSales = totalSales;
	}
    
	public Date getDate() {
		return date;
	}
	
	public void setDate(Date date) {
		this.date = date;
	}
	
	public double getTotalSales() {
		return totalSales;
	}
	
	public void setTotalSales(double totalSales) {
		this.totalSales = totalSales;
	}    
}