package retailstore;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;

public class AjaxUtility {

	// Method to get product suggestions based on the keyword
	public static String getSuggestions(HashMap<Integer, ProductType> productMap, String keyword) {
	    StringBuilder json = new StringBuilder();
	    json.append("[");

	    boolean first = true;
	    for (Map.Entry<Integer, ProductType> entry : productMap.entrySet()) {
	        String productName = entry.getValue().getName();
	        if (productName.toLowerCase().contains(keyword.toLowerCase())) {
	            if (!first) {
	                json.append(",");
	            }
	            json.append("\"").append(productName).append("\"");
	            first = false;
	        }
	    }

	    json.append("]");
	    return json.toString();
	}


	/// Method to fetch product details based on the keyword
	public static String getProducts(HashMap<Integer, ProductType> productMap, String keyword) {
	    StringBuilder json = new StringBuilder();
	    json.append("[");

	    boolean first = true;
	    for (Map.Entry<Integer, ProductType> entry : productMap.entrySet()) {
	        ProductType product = entry.getValue();
	        String productName = product.getName();
	        
	        if (productName.toLowerCase().contains(keyword.toLowerCase())) {
	            if (!first) {
	                json.append(",");
	            }
	            JSONObject productDetails = new JSONObject();
	            productDetails.put("id", product.getId());
	            productDetails.put("name", product.getName());
	            productDetails.put("type", product.getType());
	            productDetails.put("price", product.getPrice());
	            productDetails.put("description", product.getDescription());
	            productDetails.put("specialDiscount", product.getSpecialDiscount());
	            productDetails.put("manufacturerRebate", product.getManufacturerRebate());
	            productDetails.put("imageUrl", product.getImageUrl());
	            productDetails.put("quantity", product.getQuantity());

	            // Add accessories and warranty options
	            productDetails.put("accessories", product.getAccessories());
	            productDetails.put("warrantyOptions", product.getWarrantyOptions());

	            json.append(productDetails.toString());
	            first = false;
	        }
	    }

	    json.append("]");
	    return json.toString();
	}



}

