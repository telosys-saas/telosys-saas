package org.telosys.saas.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.pac4j.core.context.J2EContext;
import org.pac4j.core.profile.ProfileManager;
import org.pac4j.core.profile.UserProfile;

@Path("/auth")
public class AuthResource {
	
    @GET
    @Path("/user")
    @Produces(MediaType.APPLICATION_JSON)
    public String status(@Context HttpServletRequest request, @Context HttpServletResponse response) {
    	J2EContext context = new J2EContext(request, response);
        ProfileManager<UserProfile> manager = new ProfileManager<>(context);
        HttpSession session = request.getSession();
        UserProfile profile = manager.get(true);
        
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
        
        if(profile == null) {
        	return "{\"authenticated\":false}";
        }
        
        String login;
        if(profile.getAttribute("login") != null && profile.getAttribute("login") instanceof String) {
        	login = (String) profile.getAttribute("login");
        } else {
        	login = profile.getId();
        }
        
        String avatar;
        if(profile.getAttribute("avatar_url") != null && profile.getAttribute("avatar_url") instanceof String) {
        	avatar = (String) profile.getAttribute("avatar_url");
        } else {
        	avatar = null;
        }
                 	
        return "{\"authenticated\":" + (profile != null) + ", \"userId\": \""+profile.getId()+"\", \"login\": \""+login+"\", \"avatar\": \""+avatar+"\" }" ; //, \"session\" : [" + sessionStr.toString() + "], \"userProfile\" : [" + profile + "]}";
    }

    @GET
    @Path("info")
    @Produces(MediaType.APPLICATION_JSON)
    public String info(@Context HttpServletRequest request, @Context HttpServletResponse response) {
    	J2EContext context = new J2EContext(request, response);
        ProfileManager<UserProfile> manager = new ProfileManager<>(context);
        HttpSession session = request.getSession();
        UserProfile profile = manager.get(true);
        
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
        
        if(profile == null) {
        	return "{\"authenticated\":false}";
        } else {
        	return "{\"authenticated\":" + (profile != null) + ", \"userId\": \""+profile.getId()+"\", \"session\" : [" + sessionStr.toString() + "], \"userProfile\" : [" + profile + "]}";
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
