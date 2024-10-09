package retailstore;

import java.io.BufferedReader;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

/**
 * Servlet implementation class UserServlet
 */
@WebServlet("/UserServlet")
public class UserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
//	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//		// TODO Auto-generated method stub
//		doGet(request, response);
//	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    // Allow CORS
	    response.setHeader("Access-Control-Allow-Origin", "*");
	    response.setHeader("Access-Control-Allow-Methods", "POST");
	    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

	    // Read the JSON payload from the request body
	    StringBuilder sb = new StringBuilder();
	    String line;
	    try (BufferedReader reader = request.getReader()) {
	        while ((line = reader.readLine()) != null) {
	            sb.append(line);
	        }
	    }

	    String jsonString = sb.toString();
	    System.out.println("Received JSON: " + jsonString);
	    JSONObject jsonRequest = new JSONObject(jsonString);
	    
	    String username = jsonRequest.getString("username");
	    String password = jsonRequest.getString("password");
	    String action = jsonRequest.optString("action", "signup"); // Determine action based on request

	    // JSON response
	    JSONObject jsonResponse = new JSONObject();

	    if (action.equals("login")) {
	        // Validate user credentials for login
	        User user = MySQLDataStoreUtilities.validateUser(username, password);
	        if (user != null) {
	            jsonResponse.put("status", "success");
	            jsonResponse.put("message", "Login successful");
	            jsonResponse.put("userId", user.getId());
	            jsonResponse.put("username", user.getUsername());
	        } else {
	            jsonResponse.put("status", "error");
	            jsonResponse.put("message", "Invalid username or password");
	        }
	    } else {
	        // Existing signup logic
	        if (MySQLDataStoreUtilities.userExists(username)) {
	            jsonResponse.put("status", "error");
	            jsonResponse.put("message", "Username already exists");
	        } else {
	            boolean success = MySQLDataStoreUtilities.addUser(username, password, "Customer");
	            if (success) {
	                jsonResponse.put("status", "success");
	                jsonResponse.put("message", "User registered successfully");
	            } else {
	                jsonResponse.put("status", "error");
	                jsonResponse.put("message", "Failed to register user");
	            }
	        }
	    }
	    response.setContentType("application/json");
	    response.getWriter().write(jsonResponse.toString());
	    System.out.println("user response = "+response.getWriter());
	}


	 	
	 	@Override
	 	protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	 	    response.setHeader("Access-Control-Allow-Origin", "*");
	 	    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	 	    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
	 	}



}
