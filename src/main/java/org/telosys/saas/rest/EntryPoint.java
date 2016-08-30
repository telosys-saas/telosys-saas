package org.telosys.saas.rest;
 
import org.telosys.saas.security.Security;
import org.telosys.tools.users.User;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

@Path("/")
public class EntryPoint {
	
    @GET
    @Path("status")
    @Produces(MediaType.TEXT_PLAIN)
    public String test(@Context HttpServletRequest request, @Context HttpServletResponse response) {
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
        
        return "{ \"status\" : \"up\", \"session\" : [" + sessionStr.toString() + "], \"user\" : [" + user + "] }";
    }

}