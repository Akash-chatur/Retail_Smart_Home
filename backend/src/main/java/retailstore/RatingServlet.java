package retailstore;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bson.Document;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/RatingServlet")
public class RatingServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Allow CORS preflight requests
        setCORSHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        //response.setContentType("application/json");
        System.out.println("successfult rating get");

        String productModelName = request.getParameter("ProductModelName");

        // Fetch reviews from MongoDB
        List<Document> reviews = MongoDBDataStoreUtilities.getReviewsByProductModel(productModelName);

        // Convert the reviews to JSON and send them in the response
        JSONArray jsonArray = new JSONArray(reviews);
        response.getWriter().print(jsonArray.toString());
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCORSHeaders(response);
        
        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        JSONObject jsonObject = new JSONObject(sb.toString());

        // Parse review data from JSON
        String productModelName = jsonObject.getString("ProductModelName");
        String productCategory = jsonObject.getString("ProductCategory");
        double productPrice = jsonObject.getDouble("ProductPrice");
        String storeID = jsonObject.getString("StoreID");
        String storeZip = jsonObject.getString("StoreZip");
        String storeCity = jsonObject.getString("StoreCity");
        String storeState = jsonObject.getString("StoreState");
        boolean productOnSale = jsonObject.getBoolean("ProductOnSale");
        String manufacturerName = jsonObject.getString("ManufacturerName");
        boolean manufacturerRebate = jsonObject.getBoolean("ManufacturerRebate");
        String userID = jsonObject.getString("UserID");
        int userAge = jsonObject.getInt("UserAge");
        String userGender = jsonObject.getString("UserGender");
        String userOccupation = jsonObject.getString("UserOccupation");
        int reviewRating = jsonObject.getInt("ReviewRating");
        String reviewDate = jsonObject.getString("ReviewDate");
        String reviewText = jsonObject.getString("ReviewText");

        // Store data into MongoDB
        boolean success = MongoDBDataStoreUtilities.insertReview(
                productModelName, productCategory, productPrice, storeID, storeZip, storeCity, storeState, productOnSale,
                manufacturerName, manufacturerRebate, userID, userAge, userGender, userOccupation, reviewRating, reviewDate, reviewText
        );

        if (success) {
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("{\"message\":\"Review submitted successfully.\"}");
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"message\":\"Failed to submit review.\"}");
        }
    }

    private void setCORSHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
