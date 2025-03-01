package retailstore;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Random;

@WebServlet("/SupportTicketServlet")
@MultipartConfig
public class SupportTicketServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // Generate unique ticket number in the format "TCKT-[DATE]-[RANDOM NUMBER]"
    private String generateTicketNumber() {
        String date = new java.text.SimpleDateFormat("yyyyMMdd").format(new java.util.Date());
        int randomNum = new Random().nextInt(9000) + 1000; // Generates a 4-digit random number
        return "TCKT-" + date + "-" + randomNum;
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Set CORS headers
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setContentType("application/json");
        
        String ticketNumber = request.getParameter("ticketNumber");
        String userIdParam = request.getParameter("userId");
        int userId = (userIdParam != null) ? Integer.parseInt(userIdParam) : 0;

        if (ticketNumber == null || userId <= 0) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing ticket number or user ID");
            return;
        }

        try (Connection conn = MySQLDataStoreUtilities.getConnection()) {
            String sql = "SELECT * FROM support_tickets WHERE ticket_number = ? AND user_id = ?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, ticketNumber);
            stmt.setInt(2, userId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                JSONObject jsonResponse = new JSONObject();
                jsonResponse.put("ticketNumber", rs.getString("ticket_number"));
                jsonResponse.put("subject", rs.getString("subject"));
                jsonResponse.put("description", rs.getString("description"));
                jsonResponse.put("imagePath", rs.getString("image_path"));
                jsonResponse.put("status", rs.getString("status"));
                jsonResponse.put("createdAt", rs.getTimestamp("created_at").toString()); // Assuming you have a created_at column
                response.getWriter().write(jsonResponse.toString());
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Ticket not found");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to retrieve ticket details");
        }
    }


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	// Set CORS headers
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setContentType("application/json");
        
        String subject = request.getParameter("subject");
        String details = request.getParameter("details");
        String description = request.getParameter("description");
        
        String userIdParam = request.getParameter("userId");
        int userId = (userIdParam != null) ? Integer.parseInt(userIdParam) : 0;
        
        String status = request.getParameter("status");
        Part filePart = request.getPart("image"); // Image file part
        String uploadPath = getServletContext().getRealPath("") + File.separator + "uploads";

        String ticketNumber = generateTicketNumber();
        String imagePath = null;

        // Handle image upload
        if (filePart != null && filePart.getSize() > 0) {
            String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
            //String uploadDir = getServletContext().getRealPath("/uploads"); // Ensure /uploads folder exists in the app directory
            String uploadDir = "C:\\Users\\Vijay\\Desktop\\Uploads\\public\\assets\\images";
            File uploadDirFile = new File(uploadDir);
            if (!uploadDirFile.exists()) uploadDirFile.mkdir(); // Create directory if it doesn't exist

            imagePath = uploadDir + File.separator + fileName;
            System.out.println("image path = "+imagePath);
            filePart.write(imagePath); // Save the image file to the specified directory
        }

        try (Connection conn = MySQLDataStoreUtilities.getConnection()) {
        	String sql = "INSERT INTO support_tickets (ticket_number, user_id, subject, description, image_path, status) VALUES (?, ?, ?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, ticketNumber);
            stmt.setInt(2, userId);
            stmt.setString(3, subject);
            stmt.setString(4, description);
            stmt.setString(5, imagePath);
            stmt.setString(6, status);
            stmt.executeUpdate();
            System.out.println("test status = "+status);
            response.setContentType("application/json");
            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("ticketNumber", ticketNumber);
            jsonResponse.put("status", status);
            response.getWriter().write(jsonResponse.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to submit ticket");
        }
    }
}
