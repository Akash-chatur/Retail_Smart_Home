package retailstore;

import com.google.gson.Gson;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet("/LocationServlet")
public class LocationServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Fetch store locations from MySQL
    	 response.setHeader("Access-Control-Allow-Origin", "*");
         response.setHeader("Access-Control-Allow-Methods", "GET");
         response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        List<Map<String, String>> storeLocations = MySQLDataStoreUtilities.getStoreLocations();

        // Convert the list to JSON using Gson
        Gson gson = new Gson();
        String jsonResponse = gson.toJson(storeLocations);

        // Set response type to JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Send JSON response
        response.getWriter().write(jsonResponse);
    }
}
