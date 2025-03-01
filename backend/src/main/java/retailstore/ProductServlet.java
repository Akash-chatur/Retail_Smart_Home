package retailstore;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.google.gson.Gson;

@WebServlet("/ProductServlet")
public class ProductServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static HashMap<Integer, ProductType> productMap = new HashMap<>();

    public ProductServlet() {
        super();
    }
    
   
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        try {
            String xmlFilePath = getServletContext().getRealPath("/WEB-INF/ProductCatalog.xml");
            productMap = loadProductsFromXML(xmlFilePath);
            clearAndStoreProductsInDB(productMap);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServletException("Initialization failed", e);
        }
    }

    
 // Method to load products from XML file into a HashMap
    private HashMap<Integer, ProductType> loadProductsFromXML(String filePath) {
        HashMap<Integer, ProductType> productMap = new HashMap<>();

        try {
            File xmlFile = new File(filePath);
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(xmlFile);
            doc.getDocumentElement().normalize();

            NodeList nList = doc.getElementsByTagName("product");

            for (int temp = 0; temp < nList.getLength(); temp++) {
                Node nNode = nList.item(temp);

                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;

                    int id = Integer.parseInt(eElement.getElementsByTagName("id").item(0).getTextContent());
                    String name = eElement.getElementsByTagName("name").item(0).getTextContent();
                    String type = eElement.getElementsByTagName("type").item(0).getTextContent();
                    BigDecimal price = new BigDecimal(eElement.getElementsByTagName("price").item(0).getTextContent());
                    String description = eElement.getElementsByTagName("description").item(0).getTextContent();

                    // Check for empty string and parse safely
                    int specialDiscount = parseOrDefault(eElement, "special_discount", 0);
                    int manufacturerRebate = parseOrDefault(eElement, "manufacturer_rebate", 0);

                    String imageUrl = eElement.getElementsByTagName("image_url").item(0).getTextContent();
                    int quantity = Integer.parseInt(eElement.getElementsByTagName("quantity").item(0).getTextContent());

                    // Parse Accessories
                    List<Accessory> accessories = new ArrayList<>();
                    NodeList accessoryNodes = eElement.getElementsByTagName("accessory");
                    for (int i = 0; i < accessoryNodes.getLength(); i++) {
                        Node accessoryNode = accessoryNodes.item(i);
                        if (accessoryNode.getNodeType() == Node.ELEMENT_NODE) {
                            Element accessoryElement = (Element) accessoryNode;
                            int accessoryId = Integer.parseInt(accessoryElement.getElementsByTagName("id").item(0).getTextContent());
                            String accessoryName = accessoryElement.getElementsByTagName("name").item(0).getTextContent();
                            BigDecimal accessoryPrice = new BigDecimal(accessoryElement.getElementsByTagName("price").item(0).getTextContent());
                            accessories.add(new Accessory(accessoryId, accessoryName, accessoryPrice.doubleValue()));
                        }
                    }

                    // Parse Warranty Options
                    List<WarrantyOption> warrantyOptions = new ArrayList<>();
                    NodeList warrantyNodes = eElement.getElementsByTagName("warrantyOption");
                    for (int i = 0; i < warrantyNodes.getLength(); i++) {
                        Node warrantyNode = warrantyNodes.item(i);
                        if (warrantyNode.getNodeType() == Node.ELEMENT_NODE) {
                            Element warrantyElement = (Element) warrantyNode;
                            int warrantyId = Integer.parseInt(warrantyElement.getElementsByTagName("id").item(0).getTextContent());
                            String warrantyName = warrantyElement.getElementsByTagName("name").item(0).getTextContent();
                            String warrantyDuration = warrantyElement.getElementsByTagName("duration").item(0).getTextContent();
                            BigDecimal warrantyPrice = new BigDecimal(warrantyElement.getElementsByTagName("price").item(0).getTextContent());
                            warrantyOptions.add(new WarrantyOption(warrantyId, warrantyName, warrantyDuration, warrantyPrice.doubleValue()));
                        }
                    }

                    // Create a ProductType object
                    ProductType product = new ProductType(id, name, type, price.doubleValue(), description, specialDiscount, manufacturerRebate, imageUrl, quantity, accessories, warrantyOptions);

                    // Add the product to the HashMap
                    productMap.put(id, product);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return productMap;
    }



    // Helper method to safely parse an integer or return a default value
    private int parseOrDefault(Element eElement, String tagName, int defaultValue) {
        String textContent = eElement.getElementsByTagName(tagName).item(0).getTextContent();
        if (textContent != null && !textContent.isEmpty()) {
            return Integer.parseInt(textContent);
        }
        return defaultValue;
    }


    
 // Method to delete old entries and insert new products, accessories, and warranties into the MySQL database
    private void clearAndStoreProductsInDB(HashMap<Integer, ProductType> productMap) {
    	System.out.println("enter 1");
        String deleteProductQuery = "DELETE FROM products"; 
        String deleteAccessoriesQuery = "DELETE FROM accessories"; 
        String deleteWarrantyQuery = "DELETE FROM warranty_options"; 

        String insertProductQuery = "INSERT INTO products (id, name, type, price, description, special_discount, manufacturer_rebate, image_url, quantity) "
                    + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String insertAccessoryQuery = "INSERT INTO accessories (id, product_id, name, price) VALUES (?, ?, ?, ?)";
        String insertWarrantyQuery = "INSERT INTO warranty_options (id, product_id, name, duration, price) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = MySQLDataStoreUtilities.getConnection();
             PreparedStatement deleteProductStmt = conn.prepareStatement(deleteProductQuery);
             PreparedStatement deleteAccessoriesStmt = conn.prepareStatement(deleteAccessoriesQuery);
             PreparedStatement deleteWarrantyStmt = conn.prepareStatement(deleteWarrantyQuery);
             PreparedStatement insertProductStmt = conn.prepareStatement(insertProductQuery);
             PreparedStatement insertAccessoryStmt = conn.prepareStatement(insertAccessoryQuery);
             PreparedStatement insertWarrantyStmt = conn.prepareStatement(insertWarrantyQuery)) {

            // Delete existing records
            deleteProductStmt.executeUpdate();
            deleteAccessoriesStmt.executeUpdate();
            deleteWarrantyStmt.executeUpdate();
            System.out.println("product values outside = "+productMap.values());
            // Insert new products, accessories, and warranties
            for (ProductType product : productMap.values()) {
                // Insert product
                insertProductStmt.setInt(1, product.getId());
                insertProductStmt.setString(2, product.getName());
                insertProductStmt.setString(3, product.getType());
                insertProductStmt.setDouble(4, product.getPrice());
                insertProductStmt.setString(5, product.getDescription());
                insertProductStmt.setInt(6, product.getSpecialDiscount());
                insertProductStmt.setInt(7, product.getManufacturerRebate());
                insertProductStmt.setString(8, product.getImageUrl());
                insertProductStmt.setInt(9, product.getQuantity());
                insertProductStmt.addBatch();

                // Insert accessories
                for (Accessory accessory : product.getAccessories()) {
                    insertAccessoryStmt.setInt(1, accessory.getId());
                    insertAccessoryStmt.setInt(2, product.getId());
                    insertAccessoryStmt.setString(3, accessory.getName());
                    insertAccessoryStmt.setDouble(4, accessory.getPrice());
                    insertAccessoryStmt.addBatch();
                }

                // Insert warranties
                for (WarrantyOption warranty : product.getWarrantyOptions()) {
                    insertWarrantyStmt.setInt(1, warranty.getId());
                    insertWarrantyStmt.setInt(2, product.getId());
                    insertWarrantyStmt.setString(3, warranty.getName());
                    insertWarrantyStmt.setString(4, warranty.getDuration());
                    insertWarrantyStmt.setDouble(5, warranty.getPrice());
                    insertWarrantyStmt.addBatch();
                }
            }

            // Execute batch insertions
            insertProductStmt.executeBatch();
            insertAccessoryStmt.executeBatch();
            insertWarrantyStmt.executeBatch();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Set CORS headers
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setContentType("application/json");

        // Get the action (either "suggestions" or "search") from the request
        String action = request.getParameter("action");
        String keyword = request.getParameter("keyword");

        PrintWriter out = response.getWriter();
        if (action != null) {
            // Check the type of action: either "suggestions" or "search"
            if (action.equals("suggestions") && keyword != null) {
                // Return product suggestions based on the keyword
                out.print(AjaxUtility.getSuggestions(productMap, keyword));
            } else if (action.equals("search")) {
                if (keyword == null || keyword.isEmpty()) {               	
                	if (keyword == null || keyword.isEmpty()) {
                	    System.out.println("test4");
                	    // If no search term is provided, fetch all products
                	    List<JSONObject> products = fetchAllProducts();  // This now returns List<JSONObject>
                	    JSONArray jsonArray = new JSONArray();

                	    for (JSONObject product : products) {
                	        // Assuming the product is already a JSONObject, just add it to the JSON array
                	        jsonArray.put(product);
                	    }
                	    // Return all products as a JSON array
                	    out.write(jsonArray.toString());
                	}

                } else {
                    // Use AjaxUtility.getProducts() to get product details matching the keyword
                    String productDetailsJson = AjaxUtility.getProducts(productMap, keyword);
                    System.out.println("Matching products = " + productDetailsJson);

                    // Return matching products as a JSON array
                    out.write(productDetailsJson);
                }

            }
        }
        out.flush();
    }

    private List<JSONObject> fetchAllProducts() {
        List<JSONObject> products = new ArrayList<>();

        String productQuery = "SELECT id, name, type, price, description, special_discount, manufacturer_rebate, image_url, quantity FROM products";
        String accessoryQuery = "SELECT id, name, price FROM accessories WHERE product_id = ?";
        String warrantyQuery = "SELECT id, duration, price FROM warranty_options WHERE product_id = ?";

        try (Connection conn = MySQLDataStoreUtilities.getConnection();
             PreparedStatement psProduct = conn.prepareStatement(productQuery);
             ResultSet rsProduct = psProduct.executeQuery()) {

            while (rsProduct.next()) {
                // Create a JSON object for each product
                JSONObject jsonProduct = new JSONObject();
                int productId = rsProduct.getInt("id");

                jsonProduct.put("id", productId);
                jsonProduct.put("name", rsProduct.getString("name"));
                jsonProduct.put("type", rsProduct.getString("type"));
                jsonProduct.put("price", rsProduct.getDouble("price"));
                jsonProduct.put("description", rsProduct.getString("description"));
                jsonProduct.put("specialDiscount", rsProduct.getObject("special_discount") != null ? rsProduct.getInt("special_discount") : null);
                jsonProduct.put("manufacturerRebate", rsProduct.getObject("manufacturer_rebate") != null ? rsProduct.getInt("manufacturer_rebate") : null);
                jsonProduct.put("imageUrl", rsProduct.getString("image_url"));
                jsonProduct.put("quantity", rsProduct.getInt("quantity"));

                // Fetch accessories for the current product
                try (PreparedStatement psAccessory = conn.prepareStatement(accessoryQuery)) {
                    psAccessory.setInt(1, productId);
                    ResultSet rsAccessory = psAccessory.executeQuery();
                    JSONArray jsonAccessories = new JSONArray();

                    while (rsAccessory.next()) {
                        JSONObject jsonAccessory = new JSONObject();
                        jsonAccessory.put("id", rsAccessory.getInt("id"));
                        jsonAccessory.put("name", rsAccessory.getString("name"));
                        jsonAccessory.put("price", rsAccessory.getDouble("price"));
                        jsonAccessories.put(jsonAccessory);
                    }
                    jsonProduct.put("accessories", jsonAccessories);
                }

                // Fetch warranty options for the current product
                try (PreparedStatement psWarranty = conn.prepareStatement(warrantyQuery)) {
                    psWarranty.setInt(1, productId);
                    ResultSet rsWarranty = psWarranty.executeQuery();
                    JSONArray jsonWarrantyOptions = new JSONArray();

                    while (rsWarranty.next()) {
                        JSONObject jsonWarranty = new JSONObject();
                        jsonWarranty.put("id", rsWarranty.getInt("id"));
                        jsonWarranty.put("duration", rsWarranty.getString("duration"));
                        jsonWarranty.put("price", rsWarranty.getDouble("price"));
                        jsonWarrantyOptions.put(jsonWarranty);
                    }
                    jsonProduct.put("warrantyOptions", jsonWarrantyOptions);
                }

                // Add the product (with accessories and warranty options) to the list
                products.add(jsonProduct);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return products;
    }



    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Allow CORS
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
   
    
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Set CORS headers
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Max-Age", "3600");

        // Handle preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        StringBuilder sb = new StringBuilder();
        String line;

        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        String jsonString = sb.toString();
        boolean isDeleted = false;

        try {
            JSONObject jsonRequest = new JSONObject(jsonString);
            int productId = jsonRequest.getInt("id");

            try {
                isDeleted = MySQLDataStoreUtilities.deleteProductById(productId);
            } catch (SQLException e) {
                e.printStackTrace();
            }

            if (isDeleted) {
                response.setStatus(HttpServletResponse.SC_NO_CONTENT);
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Product not found");
            }
        } catch (JSONException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid JSON");
        }
    }

    

    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Set CORS headers
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setContentType("application/json");

        StringBuilder sb = new StringBuilder();
        String line;
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        String jsonString = sb.toString();
        JSONObject jsonRequest = new JSONObject(jsonString);

        PrintWriter out = response.getWriter();
        try {
            // Determine the action to perform (create/update/delete)
            String action = jsonRequest.optString("action", ""); // Check for the "action" field in the request

            if (action.equals("delete")) {
                // Handle product deletion
                int productId = jsonRequest.getInt("id");
                boolean isDeleted = MySQLDataStoreUtilities.deleteProductById(productId);
                if (isDeleted) {
                    response.setStatus(HttpServletResponse.SC_NO_CONTENT);
                } else {
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Product not found");
                }
            } else {
                // Handle product creation or update
                int id = jsonRequest.getInt("id");
                String name = jsonRequest.getString("name");
                String type = jsonRequest.getString("type");
                double price = jsonRequest.getDouble("price");
                String description = jsonRequest.getString("description");
                int specialDiscount = jsonRequest.optInt("specialDiscount", 0);
                int manufacturerRebate = jsonRequest.optInt("manufacturerRebate", 0);
                String imageUrl = jsonRequest.getString("imageUrl");
                int quantity = jsonRequest.getInt("quantity");

                // Check if the product exists in the database (for update purposes)
                if (productExists(id)) {
                    // Update existing product
                    updateProductInDB(id, name, type, price, description, specialDiscount, manufacturerRebate, imageUrl, quantity);
                } else {
                    // Insert a new product
                    insertProductInDB(id, name, type, price, description, specialDiscount, manufacturerRebate, imageUrl, quantity);
                }

                // Prepare updated product object for response
                JSONObject updatedProduct = new JSONObject();
                updatedProduct.put("id", id);
                updatedProduct.put("name", name);
                updatedProduct.put("type", type);
                updatedProduct.put("price", price);
                updatedProduct.put("description", description);
                updatedProduct.put("specialDiscount", specialDiscount);
                updatedProduct.put("manufacturerRebate", manufacturerRebate);
                updatedProduct.put("imageUrl", imageUrl);
                updatedProduct.put("quantity", quantity);

                // Return the updated product details
                response.setStatus(HttpServletResponse.SC_OK);
                out.write(updatedProduct.toString());
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.write("{\"status\":\"error\",\"message\":\"Database error\"}");
        } finally {
            out.flush();
        }
    }





    // Check if a product exists by its ID in the database
    private boolean productExists(int productId) throws SQLException {
        String query = "SELECT COUNT(*) FROM products WHERE id = ?";
        try (Connection conn = MySQLDataStoreUtilities.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setInt(1, productId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;  // Return true if product exists
            }
        }
        return false;
    }

    // Insert a new product into the database
    private void insertProductInDB(int id, String name, String type, double price, String description, int specialDiscount, int manufacturerRebate, String imageUrl, int quantity) throws SQLException {
        String insertQuery = "INSERT INTO products (id, name, type, price, description, special_discount, manufacturer_rebate, image_url, quantity) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = MySQLDataStoreUtilities.getConnection();
             PreparedStatement insertStmt = conn.prepareStatement(insertQuery)) {
            insertStmt.setInt(1, id);
            insertStmt.setString(2, name);
            insertStmt.setString(3, type);
            insertStmt.setDouble(4, price);
            insertStmt.setString(5, description);
            insertStmt.setInt(6, specialDiscount);
            insertStmt.setInt(7, manufacturerRebate);
            insertStmt.setString(8, imageUrl);
            insertStmt.setInt(9, quantity);
            insertStmt.executeUpdate();
        }
    }

    // Update an existing product in the database
    private void updateProductInDB(int id, String name, String type, double price, String description, int specialDiscount, int manufacturerRebate, String imageUrl, int quantity) throws SQLException {
        String updateQuery = "UPDATE products SET name = ?, type = ?, price = ?, description = ?, special_discount = ?, manufacturer_rebate = ?, image_url = ?, quantity = ? WHERE id = ?";

        try (Connection conn = MySQLDataStoreUtilities.getConnection();
             PreparedStatement updateStmt = conn.prepareStatement(updateQuery)) {
            updateStmt.setString(1, name);
            updateStmt.setString(2, type);
            updateStmt.setDouble(3, price);
            updateStmt.setString(4, description);
            updateStmt.setInt(5, specialDiscount);
            updateStmt.setInt(6, manufacturerRebate);
            updateStmt.setString(7, imageUrl);
            updateStmt.setInt(8, quantity);
            updateStmt.setInt(9, id);
            updateStmt.executeUpdate();
        }
    }    
    

    private void setAccessControlHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Max-Age", "3600");
    }



}
