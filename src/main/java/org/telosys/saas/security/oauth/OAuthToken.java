package org.telosys.saas.security.oauth;

import org.apache.shiro.authc.AuthenticationToken;

/**
 * OAuth 2 Token
 */
public class OAuthToken implements AuthenticationToken {

	private static final long serialVersionUID = 1L;

	public OAuthToken(String authCode) {
        this.authCode = authCode;
    }

    private String authCode;
    private String principal;

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public String getPrincipal() {
        return principal;
    }

    public void setPrincipal(String principal) {
        this.principal = principal;
    }

    @Override
    public Object getCredentials() {
        return authCode;
    }
}