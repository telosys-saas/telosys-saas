package org.telosys.saas.security;

import org.pac4j.core.exception.CredentialsException;
import org.pac4j.core.profile.CommonProfile;
import org.pac4j.core.util.CommonHelper;
import org.pac4j.http.credentials.UsernamePasswordCredentials;
import org.pac4j.http.credentials.authenticator.UsernamePasswordAuthenticator;
import org.pac4j.http.profile.HttpProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telosys.tools.users.User;
import org.telosys.tools.users.UsersManager;

public class FormAuthenticator implements UsernamePasswordAuthenticator {

    protected static final Logger logger = LoggerFactory.getLogger(FormAuthenticator.class);

    private UsersManager usersManager = UsersManager.getInstance();
    
    @Override
    public void validate(final UsernamePasswordCredentials credentials) {
    	if (credentials == null) {
            throwsException("No credentials");
        }
    	
    	logger.info("Authentication - validate credentials : "+credentials.getUsername());
        
        String username = credentials.getUsername();
        String password = credentials.getPassword();
        if (CommonHelper.isBlank(username)) {
            throwsException("Username cannot be blank");
        }
        if (CommonHelper.isBlank(password)) {
            throwsException("Password cannot be blank");
        }

        //--- Check user existence
        User user = usersManager.getUserByLogin(username);
        if (user == null) {
            throwsException("User does not exist");
        }
        //--- Check user's password 
        if ( ! usersManager.checkPassword(user, password) ) {
            throwsException("Username : '" + username + "' invalid password");        	
        }
        
    	logger.info("Authentication - user "+credentials.getUsername() + " : OK");

    	final HttpProfile profile = new HttpProfile();
        profile.setId(username);
        profile.addAttribute(CommonProfile.USERNAME, username);
        profile.addAttribute("USER", user);
        credentials.setUserProfile(profile);
    }

    protected void throwsException(final String message) {
        throw new CredentialsException(message);
    }
}
