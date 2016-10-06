package org.telosys.saas.rest;

import org.telosys.saas.security.Security;
import org.telosys.tools.users.User;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Enumeration;

@Path("/profile")
public class AuthResource {

    @GET
    @Path("/user")
    @Produces(MediaType.APPLICATION_JSON)
    public String status(@Context HttpServletRequest request, @Context HttpServletResponse response) {
        HttpSession session = request.getSession();
        User user = Security.getUser();

        StringBuffer sessionStr = new StringBuffer();
        Enumeration<String> attributeNames = session.getAttributeNames();
        while(attributeNames.hasMoreElements()) {
        	String key = attributeNames.nextElement();
        	Object value = session.getAttribute(key);
        	if(sessionStr.length() > 0) {
        		sessionStr.append(", ");
        	}
        	sessionStr.append(key+" : "+value);
        }

        boolean isAuthenticated = Security.isAuthenticated();
        if(!Security.isAuthenticated()) {
        	return "{\"authenticated\":false}";
        } else {
            StringBuffer buf = new StringBuffer();
            buf.append("{\"authenticated\":true");
            buf.append(", \"userId\": \"").append(user.getLogin()).append("\"");
            buf.append(", \"userType\": \"").append(user.getType()).append("\"");
            buf.append("}");
            return buf.toString();
        }
    }

    @GET
    @Path("info")
    @Produces(MediaType.APPLICATION_JSON)
    public String info(@Context HttpServletRequest request, @Context HttpServletResponse response) {
        HttpSession session = request.getSession();

        StringBuffer sessionStr = new StringBuffer();
        Enumeration<String> attributeNames = session.getAttributeNames();
        while(attributeNames.hasMoreElements()) {
        	String key = attributeNames.nextElement();
        	Object value = session.getAttribute(key);
        	if(sessionStr.length() > 0) {
        		sessionStr.append(", ");
        	}
        	sessionStr.append(key+" : "+value);
        }

        if(!Security.isAuthenticated()) {
            return "{\"authenticated\":false}";
        } else {
            User user = Security.getUser();
            StringBuffer buf = new StringBuffer();
            buf.append("{\"authenticated\":true");
            buf.append(", \"userId\": \"").append(user.getLogin()).append("\"");
            buf.append(", \"login\": \"").append(user.getLogin()).append("\"");
            buf.append(", \"avatar\": ");
            if(user.getAvatar() == null || "".equals(user.getAvatar().trim())) {
                buf.append(", \"avatar\": null");
            } else {
                buf.append(", \"avatar\": \"").append(user.getAvatar()).append("\"");
            }
            buf.append("}");
            return buf.toString();
        }
    }

    @GET
    @Path("github")
    public Response github(@Context HttpServletRequest request, @Context HttpServletResponse response) {
		try {
	    	URI targetURIForRedirection = new URI("/");
	        return Response.temporaryRedirect(targetURIForRedirection).build();
		} catch (URISyntaxException e) {
			throw new RuntimeException(e);
		}
    }

    @GET
    @Path("logout")
    public Response logout(@Context HttpServletRequest request, @Context HttpServletResponse response) {
		try {
	    	URI targetURIForRedirection = new URI("/");
	        return Response.temporaryRedirect(targetURIForRedirection).build();
		} catch (URISyntaxException e) {
			throw new RuntimeException(e);
		}
    }
}
