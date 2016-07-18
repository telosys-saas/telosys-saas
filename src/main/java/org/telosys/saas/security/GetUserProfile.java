package org.telosys.saas.security;

import org.pac4j.core.context.J2EContext;
import org.pac4j.core.profile.ProfileManager;
import org.pac4j.core.profile.UserProfile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author fpaquere on 13/07/2016.
 */
public class GetUserProfile {

    public UserProfile getUser(HttpServletRequest request, HttpServletResponse response) {
        //J2EContext context = new J2EContext(request, response);
        //ProfileManager<UserProfile> manager = new ProfileManager<>(context);
        //UserProfile profile = manager.get(true);
        UserProfile userProfile = new UserProfile();
        userProfile.setId("user");
        return userProfile;
    }
}
