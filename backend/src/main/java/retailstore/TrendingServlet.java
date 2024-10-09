package retailstore;

import javax.servlet.annotation.WebServlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bson.Document;

import com.google.gson.Gson;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Servlet implementation class TrendingServlet
 */
@WebServlet("/TrendingServlet")
public class TrendingServlet extends HttpServlet {
    private MySQLDataStoreUtilities mySQLUtilities = new MySQLDataStoreUtilities();
    private MongoDBDataStoreUtilities mongoDBUtilities = new MongoDBDataStoreUtilities();
    
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Allow CORS
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Set CORS headers for cross-origin requests
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Get the request parameter "type"
        String type = request.getParameter("type");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        if ("liked".equals(type)) {
            // Fetch top 5 liked products from MongoDB
            List<Document> likedProducts = null;
			try {
				likedProducts = MongoDBDataStoreUtilities.getTopFiveLikedProducts();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

            // Convert the list of Document to JSON using Gson
            List<Map<String, Object>> likedProductsJson = new ArrayList<>();
            for (Document product : likedProducts) {
                Map<String, Object> productMap = new HashMap<>();
                productMap.put("ProductModelName", product.getString("ProductModelName"));
                productMap.put("reviewCount", product.getInteger("reviewCount"));
                productMap.put("averageRating", product.getDouble("averageRating"));
                productMap.put("ProductCategory", product.getString("ProductCategory"));
                productMap.put("ProductPrice", product.getDouble("ProductPrice"));
                likedProductsJson.add(productMap);
            }

            // Send the JSON response
            out.println(new Gson().toJson(likedProductsJson));

        } else
			try {
				if ("zipcodes".equals(type)) {
				    // Fetch top 5 zip codes from MySQL
				    List<Map<String, Object>> zipCodes = null;
					try {
						zipCodes = MySQLDataStoreUtilities.getTopFiveZipCodes();
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				    out.println(new Gson().toJson(zipCodes));

				} else if ("sold".equals(type)) {
				    // Fetch top 5 sold products from MySQL
				    List<Map<String, Object>> soldProducts = null;
					try {
						soldProducts = MySQLDataStoreUtilities.getTopFiveSoldProducts();
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				    out.println(new Gson().toJson(soldProducts));

				} else {
				    // Invalid request type
				    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				    out.println("{\"error\":\"Invalid type\"}");
				}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

        out.flush();
    }

}
