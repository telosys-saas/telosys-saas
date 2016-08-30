package org.telosys.saas.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.telosys.saas.dao.StorageDao;
import org.telosys.saas.dao.StorageDaoProvider;
import org.telosys.saas.domain.Project;
import org.telosys.saas.security.Security;
import org.telosys.tools.users.User;

@Path("/users/{userId}/projects")
public class ProjectsResource {

	//private StorageDao storage = new MockStorageDao();
//	private StorageDao storage = new FileStorageDao();
	private StorageDao storage = StorageDaoProvider.getStorageDao();

	@Context
	private HttpServletRequest request;
	@Context
	private HttpServletResponse response;
	
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Project> getProjects(@PathParam("userId") String userId) {
    	User user = Security.getUser();
    	return storage.getProjectsForUser(user);
    }
	
}
