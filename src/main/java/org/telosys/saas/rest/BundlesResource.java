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

import org.telosys.saas.domain.Bundle;
import org.telosys.saas.services.BundleService;

@Path("/bundles")
public class BundlesResource {

	private BundleService bundleService = new BundleService();
	@Context
	private HttpServletRequest request;
	@Context
	private HttpServletResponse response;
	
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Bundle> getBundles() {
    	return bundleService.getBundlesForGithubUser(null);
    }
	
    @Path("/{githubUser}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Bundle> getBundles(@PathParam("githubUser") String githubUser) {
    	return bundleService.getBundlesForGithubUser(githubUser);
    }

}
