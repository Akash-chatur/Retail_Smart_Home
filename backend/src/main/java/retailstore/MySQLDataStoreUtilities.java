package retailstore;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MySQLDataStoreUtilities {

    // Method to create a connection to the MySQL database
    public static Connection getConnection() throws SQLException {
        try {
            // Register MySQL JDBC Driver explicitly
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            throw new SQLException("MySQL Driver not found", e);
        }

        String jdbcUrl = "jdbc:mysql://localhost:3306/ewa?useSSL=false&allowPublicKeyRetrieval=true";
        String username = "root";  
        String password = "root";
        return DriverManager.getConnection(jdbcUrl, username, password);
    }

    // Method to add a new user
    public static boolean addUser(String username, String password, String role) {
        try (Connection conn = getConnection()) {
            String query = "INSERT INTO Users (username, password, role) VALUES (?, ?, ?)";
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, username);
            ps.setString(2, password);
            ps.setString(3, role);
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Method to check if the user already exists
    public static boolean userExists(String username) {
        try (Connection conn = getConnection()) {
            String query = "SELECT * FROM Users WHERE username = ?";
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            return rs.next();
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public static User validateUser(String username, String password) {
        try (Connection conn = getConnection()) {
            String query = "SELECT id, username FROM Users WHERE username = ? AND password = ?";
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, username);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                int userId = rs.getInt("id");
                return new User(userId, rs.getString("username")); // Return User object
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null; // Return null if user not found or error occurred
    }
    
    // Method to get orders by userId
    public static List<Order> getOrdersByUserId(int userId) {
        List<Order> orders = new ArrayList<>();
        String query = "SELECT id, userId, confirmation, deliveryDate, status FROM Orders WHERE userId = ?";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {

            // Set the userId parameter in the query
            ps.setInt(1, userId);

            // Execute the query
            ResultSet rs = ps.executeQuery();

            // Loop through the results and create Order objects
            while (rs.next()) {
                int id = rs.getInt("id");
                String confirmation = rs.getString("confirmation");
                String deliveryDate = rs.getString("deliveryDate");
                String status = rs.getString("status");

                // Create an Order object and add it to the list
                Order order = new Order(id, userId, confirmation, deliveryDate, status);
                orders.add(order);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Return the list of orders
        return orders;
    }
    
 // Method to fetch store locations from the database
    public static List<Map<String, String>> getStoreLocations() {
        List<Map<String, String>> locations = new ArrayList<>();
        String query = "SELECT storeId, street, city, state, zipcode FROM store_locations";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {

            // Loop through the results and create a map for each location
            while (rs.next()) {
                Map<String, String> location = new HashMap<>();
                location.put("storeId", rs.getString("storeId"));
                location.put("street", rs.getString("street"));
                location.put("city", rs.getString("city"));
                location.put("state", rs.getString("state"));
                location.put("zipcode", rs.getString("zipcode"));
                locations.add(location);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return locations;
    }

    
    
//
//    public static boolean addOrderToDatabase(int userId, String confirmation, String deliveryDate, String status) {
//        try (Connection conn = MySQLDataStoreUtilities.getConnection()) {
//            String query = "INSERT INTO Orders (userId, confirmation, deliveryDate, status) VALUES (?, ?, ?, ?)";
//            PreparedStatement ps = conn.prepareStatement(query);
//            ps.setInt(1, userId);
//            ps.setString(2, confirmation);
//            ps.setString(3, deliveryDate);
//            ps.setString(4, status);
//            
//            int rowsAffected = ps.executeUpdate();
//            
//            return rowsAffected > 0;
//            
//        } catch (SQLException e) {
//            
//          e.printStackTrace();
//          
//          return false;
//          
//        }
//    }
    
	    public static boolean addOrderToDatabase(int userId, String userName, String customerAddress,  String confirmation, String deliveryDate, String status, 
	            String zipcode, int productId, String productName, String productType, String productDescription, int quantity,
	            String creditCard, double shippingCost, double discount, double totalSales, String storeId, String storeAddress) {
	        try (Connection conn = MySQLDataStoreUtilities.getConnection()) {
	            String query = "INSERT INTO Orders (userId, username, customeraddress, confirmation, deliveryDate, status, zipcode, productId, " +
	                           "productName, productType, productDescription, quantity, creditCard, shippingCost, discount, totalSales, storeId, storeAddress) " +
	                           "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	            PreparedStatement ps = conn.prepareStatement(query);
	            ps.setInt(1, userId);
	            ps.setString(2, userName);
	            ps.setString(3, customerAddress);
	            ps.setString(4, confirmation);
	            ps.setString(5, deliveryDate);
	            ps.setString(6, status);
	            ps.setString(7, zipcode);
	            ps.setInt(8, productId);
	            ps.setString(9, productName);
	            ps.setString(10, productType); // Can be set as per your requirement
	            ps.setString(11, productDescription); // Add description if available
	            ps.setInt(12, quantity);
	            ps.setString(13, creditCard);
	            ps.setDouble(14, shippingCost);
	            ps.setDouble(15, discount);
	            ps.setDouble(16, totalSales);
	            ps.setObject(17, storeId); // Handles nullable Integer
	            ps.setString(18, storeAddress); // Store address can be null
	
	            int rowsAffected = ps.executeUpdate();
	            return rowsAffected > 0;
	
	        } catch (SQLException e) {
	            e.printStackTrace();
	            return false;
	        }
	    }
	
	
	
	    public static boolean cancelOrder(int orderId) {
	      try (Connection conn = getConnection()) {
	          String query = "UPDATE Orders SET status='Canceled' WHERE id=?";
	          PreparedStatement ps = conn.prepareStatement(query);
	          ps.setInt(1, orderId);
	          int rowsAffected = ps.executeUpdate();
	          return rowsAffected > 0;
	      } catch (SQLException e) {
	          e.printStackTrace();
	          return false;
	      }
	  }

  public static boolean deleteOrder(int orderId) {
      try (Connection conn = getConnection()) {
          String query = "DELETE FROM Orders WHERE id=?";
          PreparedStatement ps = conn.prepareStatement(query);
          ps.setInt(1, orderId);
          int rowsAffected = ps.executeUpdate();
          return rowsAffected > 0;
      } catch (SQLException e) {
          e.printStackTrace();
          return false;
      }
  }
  
  public static boolean doesUserExist(int userId) {
      try (Connection conn = MySQLDataStoreUtilities.getConnection();
           PreparedStatement stmt = conn.prepareStatement("SELECT COUNT(*) FROM users WHERE id = ?")) {
          stmt.setInt(1, userId);
          ResultSet rs = stmt.executeQuery();
          if (rs.next()) {
              return rs.getInt(1) > 0; // Return true if the user exists
          }
      } catch (SQLException e) {
          e.printStackTrace();
      }
      return false;
  }
  
  public static List<Map<String, Object>> getTopFiveSoldProducts() {
	    List<Map<String, Object>> topSoldProducts = new ArrayList<>();
	    String query = "SELECT p.id, p.name, COUNT(o.productId) AS sold " +
	                   "FROM orders o " +
	                   "JOIN products p ON o.productId = p.id " +
	                   "GROUP BY p.id, p.name ORDER BY sold DESC LIMIT 5";

	    try (Connection conn = getConnection();
	         PreparedStatement stmt = conn.prepareStatement(query);
	         ResultSet rs = stmt.executeQuery()) {
	        while (rs.next()) {
	            int id = rs.getInt("id");
	            String name = rs.getString("name");
	            int soldCount = rs.getInt("sold");

	            // Create a map for each product's data
	            Map<String, Object> productData = new HashMap<>();
	            productData.put("id", id);
	            productData.put("name", name);
	            productData.put("soldCount", soldCount); // Changed to soldCount for clarity

	            topSoldProducts.add(productData);
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	    
	    return topSoldProducts; // Returning the list of top sold products
	}




  public static List<Map<String, Object>> getTopFiveZipCodes() {
	    List<Map<String, Object>> topZipCodes = new ArrayList<>();
	    String query = "SELECT zipcode, COUNT(*) AS sales FROM orders GROUP BY zipcode ORDER BY sales DESC LIMIT 5";

	    try (Connection conn = getConnection();
	         PreparedStatement stmt = conn.prepareStatement(query);
	         ResultSet rs = stmt.executeQuery()) {
	        while (rs.next()) {
	            String zip = rs.getString("zipcode");
	            int sales = rs.getInt("sales");

	            // Create a map for each zip code and sales count
	            Map<String, Object> zipCodeData = new HashMap<>();
	            zipCodeData.put("zip", zip);
	            zipCodeData.put("sales", sales);

	            topZipCodes.add(zipCodeData);
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	    return topZipCodes;
	}


  
	  public static boolean addOrderToDatabase(int userId, String userName, String confirmation, String deliveryDate, String status, 
	          String zipcode, int productId, String productName, String productType, String productDescription) {
		try {
			Connection conn = getConnection();
			String query = "INSERT INTO orders (userId, userName, confirmation, deliveryDate, status, zipcode, productId, productName, productType, productDescription) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
			PreparedStatement ps = conn.prepareStatement(query);
			ps.setInt(1, userId);
			ps.setString(2, userName);
			ps.setString(3, confirmation);
			ps.setString(4, deliveryDate);
			ps.setString(5, status);
			ps.setString(6, zipcode);
			ps.setInt(7, productId);
			ps.setString(8, productName);
			ps.setString(9, productType);
			ps.setString(10, productDescription);
			
			int rowsInserted = ps.executeUpdate();
			ps.close();
			conn.close();
		
			return rowsInserted > 0;
		} catch (Exception e) {
		e.printStackTrace();
		return false;
	}
}

}