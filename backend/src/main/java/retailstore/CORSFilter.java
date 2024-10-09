package retailstore;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CORSFilter implements Filter {
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialization code, if needed
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        // Set CORS headers
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // React app URL
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        res.setHeader("Access-Control-Allow-Credentials", "true"); // If you need cookies or credentials to be included

        // Handle preflight (OPTIONS) request
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            res.setStatus(HttpServletResponse.SC_OK);
            return; // Don't continue the filter chain for OPTIONS requests
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Cleanup code, if needed
    }
}
