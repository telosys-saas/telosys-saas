package org.telosys.saas.security;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.telosys.tools.users.User;

/**
 * Security
 */
public class Security {

    public static boolean isAuthenticated() {
        Subject subject = SecurityUtils.getSubject();
        return subject.isAuthenticated();
    }

    public static User getUser() {
        Subject subject = SecurityUtils.getSubject();
        User user = (User) subject.getPrincipal();
        return user;
    }

}
