package org.telosys.saas.rest;
 
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.pac4j.core.context.J2EContext;
import org.pac4j.core.profile.ProfileManager;
import org.pac4j.core.profile.UserProfile;
 
@Path("/")
public class EntryPoint {
	
    @GET
    @Path("status")
    @Produces(MediaType.TEXT_PLAIN)
    public String test(@Context HttpServletRequest request, @Context HttpServletResponse response) {
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
        
        return "{ \"status\" : \"up\", \"session\" : [" + sessionStr.toString() + "], \"userProfile\" : [" + profile + "] }";
    }

}