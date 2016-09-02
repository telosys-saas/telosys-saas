package org.telosys.saas.security.oauth;

import org.apache.shiro.authc.AuthenticationException;

public class OAuthAuthenticationException extends AuthenticationException {

	private static final long serialVersionUID = 5468741950601367814L;

	public OAuthAuthenticationException(Throwable cause) {
        super(cause);
    }
}