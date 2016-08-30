package org.telosys.saas.security;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telosys.saas.config.Configuration;
import org.telosys.saas.config.ConfigurationHolder;

public class Pac4jConfigFactory {
	
	static final Logger LOG = LoggerFactory.getLogger(Pac4jConfigFactory.class);
	/*
    @Override
    public Config build() {        
    	Configuration configuration = ConfigurationHolder.getConfiguration();
    	
		LOG.info("PAC4J Configuration");
    	List<Client> clients = new ArrayList<>();
    	
    	// User / Password form
        FormClient formClient = new FormClient("/login", new FormAuthenticator());
        clients.add(formClient);
		LOG.info("[ENABLED] Authentification by user / password");

    	// Github
    	if( configuration.getAuthRedirectUrl() != null 
		 && configuration.getGithubOauthKey() != null 
		 && configuration.getGthubOauthPassword() != null)
    	{
    		GitHubClient gitHubClient = new GitHubClient(
    				configuration.getGithubOauthKey(), configuration.getGthubOauthPassword());
    		gitHubClient.setScope("user:email");
    		clients.add(gitHubClient);
    		LOG.info("[ENABLED] Github authentification");
    	} else {
    		LOG.info("[DISABLED] Github authentification - Missing configuration properties");
    	}
        
        return new Config(new Clients(configuration.getAuthRedirectUrl(), clients.toArray(new Client[] {})));
    }
    */
}