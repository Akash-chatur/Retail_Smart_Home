package retailstore;

import java.io.BufferedReader;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.Gson;

@WebServlet("/OrderServlet")
public class OrderServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Allow CORS
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        String userIdParam = request.getParameter("userId");
        if (userIdParam == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing userId parameter");
            return;
        }

        try {
            int userId = Integer.parseInt(userIdParam);
            List<Order> orders = MySQLDataStoreUtilities.getOrdersByUserId(userId);

            JSONObject jsonResponse = new JSONObject();
            JSONArray orderArray = new JSONArray();

            for (Order order : orders) {
                JSONObject orderJson = new JSONObject();
                orderJson.put("id", order.getId());
                orderJson.put("userId", order.getUserId());
                orderJson.put("confirmation", order.getConfirmation());
                orderJson.put("deliveryDate", order.getDeliveryDate());
                orderJson.put("status", order.getStatus());
                orderArray.put(orderJson);
            }

            jsonResponse.put("orders", orderArray);
            response.setContentType("application/json");
            response.getWriter().write(jsonResponse.toString());
        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid userId format");
        }
    }
    
//    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.setHeader("Access-Control-Allow-Origin", "*");
//        response.setHeader("Access-Control-Allow-Methods", "POST");
//        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
//
//        StringBuilder sb = new StringBuilder();
//        String line;
//        try (BufferedReader reader = request.getReader()) {
//            while ((line = reader.readLine()) != null) {
//                sb.append(line);
//            }
//        }
//
//        String jsonString = sb.toString();
//        JSONObject jsonRequest = new JSONObject(jsonString);
//
//        String action = jsonRequest.optString("action");
//
//        if ("cancel".equals(action)) {
//            int orderId = jsonRequest.getInt("orderId");
//            boolean success = MySQLDataStoreUtilities.cancelOrder(orderId);
//
//            JSONObject jsonResponse = new JSONObject();
//            if (success) {
//                jsonResponse.put("status", "success");
//                jsonResponse.put("message", "Order canceled successfully");
//            } else {
//                jsonResponse.put("status", "error");
//                jsonResponse.put("message", "Failed to cancel order");
//            }
//            response.setContentType("application/json");
//            response.getWriter().write(jsonResponse.toString());
//            return;
//        }
//
//        // Handle placing a new order with additional fields
//        int userId = jsonRequest.getInt("userId");
//        String userName = jsonRequest.getString("userName");
//        String confirmation = jsonRequest.getString("confirmation");
//        String deliveryDate = jsonRequest.getString("deliveryDate");
//        String status = jsonRequest.getString("status");
//        String zipcode = jsonRequest.getString("zipcode");
//        int productId = jsonRequest.getInt("productId");
//        String productName = jsonRequest.getString("productName");
//        String productType = jsonRequest.getString("productType");
//        String productDescription = jsonRequest.getString("productDescription");
//
//        boolean success = MySQLDataStoreUtilities.addOrderToDatabase(userId, userName, confirmation, deliveryDate, status, zipcode, productId, productName, productType, productDescription);
//
//        JSONObject jsonResponse = new JSONObject();
//        if (success) {
//            jsonResponse.put("status", "success");
//            jsonResponse.put("message", "Order placed successfully");
//        } else {
//            jsonResponse.put("status", "error");
//            jsonResponse.put("message", "Failed to place order");
//        }
//
//        System.out.println("order response = " + jsonResponse.toString());
//        response.setContentType("application/json");
//        response.getWriter().write(jsonResponse.toString());
//    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Set response headers for CORS
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        
        StringBuilder stringBuilder = new StringBuilder();
        String line;

        // Read the request body
        while ((line = request.getReader().readLine()) != null) {
            stringBuilder.append(line);
        }

        // Parse JSON body to an object using Gson
        Gson gson = new Gson();
        Map<String, Object> requestData = gson.fromJson(stringBuilder.toString(), Map.class);

        String action = (String) requestData.get("action");
        
        if ("placeOrder".equals(action)) {
            // Handle placing the order
            handlePlaceOrder(requestData, response);
        } else if ("cancel".equals(action)) {
            // Handle canceling the order
            handleCancelOrder(requestData, response);
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson("Invalid action."));
        }
    }

    // Method to handle placing an order
    private void handlePlaceOrder(Map<String, Object> orderRequest, HttpServletResponse response) throws IOException {
        // Extract fields from orderRequest
    	Gson gson = new Gson();
    	
        int userId = ((Double) orderRequest.get("user_id")).intValue();
        String userName = (String) orderRequest.get("userName");
        String customerAddress = (String) orderRequest.get("customerAddress");
        String confirmation = (String) orderRequest.get("orderId");
        String deliveryDate = (String) orderRequest.get("shipDate");
        String status = "Pending";
        String zipcode = (String) orderRequest.get("zipcode");
        int productId = ((Double) orderRequest.get("productId")).intValue();
        String productName = (String) orderRequest.get("productName");
        String productType = (String) orderRequest.get("productType");
        String productDescription = (String) orderRequest.get("productDescription");
        int quantity = ((Double) orderRequest.get("quantity")).intValue();
        double price = ((Double) orderRequest.get("price"));
        double shippingCost = ((Double) orderRequest.get("shippingCost"));
        double discount = ((Double) orderRequest.get("discount"));
        double totalSales = ((Double) orderRequest.get("totalSales"));
        String creditCard = (String) orderRequest.get("creditCard");
        String storeId = (String) orderRequest.get("storeId");
        String storeAddress = (String) orderRequest.get("storeAddress");

        SimpleDateFormat isoFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        isoFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        boolean orderPlaced = false;

        try {
            Date parsedDate = isoFormat.parse(deliveryDate);
            SimpleDateFormat mysqlFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String formattedDeliveryDate = mysqlFormat.format(parsedDate);

            orderPlaced = MySQLDataStoreUtilities.addOrderToDatabase(
                userId,
                userName,
                customerAddress,
                confirmation,
                formattedDeliveryDate,
                status,
                zipcode,
                productId,
                productName,
                productType,
                productDescription,
                quantity,
                creditCard,
                shippingCost,
                discount,
                totalSales,
                storeId,
                storeAddress
            );
        } catch (ParseException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson("Invalid delivery date format."));
            return;
        }

        // Prepare the response based on the order placement status
        response.setContentType("application/json");
        if (orderPlaced) {
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson("Order placed successfully."));
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson("Failed to place order."));
        }
    }

    // Method to handle canceling an order
    private void handleCancelOrder(Map<String, Object> orderRequest, HttpServletResponse response) throws IOException {
    	Gson gson = new Gson();
    	
        int orderId = ((Double) orderRequest.get("orderId")).intValue();
        boolean canceled = MySQLDataStoreUtilities.cancelOrder(orderId); // Call the existing method

        response.setContentType("application/json");
        if (canceled) {
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson("Order canceled successfully."));
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson("Failed to cancel order."));
        }
    }





    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        StringBuilder sb = new StringBuilder();
        String line;
        
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        String jsonString = sb.toString();
        
        try {
            JSONObject jsonRequest = new JSONObject(jsonString);
            int orderId = jsonRequest.getInt("orderId");

            boolean success = MySQLDataStoreUtilities.deleteOrder(orderId);

            JSONObject jsonResponse = new JSONObject();
            
            if (success) {
                jsonResponse.put("status", "success");
                jsonResponse.put("message", "Order deleted successfully.");
            } else {
                jsonResponse.put("status", "error");
                jsonResponse.put("message", "Failed to delete order.");
            }
            
            response.setContentType("application/json");
            response.getWriter().write(jsonResponse.toString());
            
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request format.");
        }
    }
}