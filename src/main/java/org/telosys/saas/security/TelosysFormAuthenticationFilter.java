package org.telosys.saas.security;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;

import javax.servlet.ServletRequest;

/**
 * Form Authentication Filter
 */
public class TelosysFormAuthenticationFilter extends org.apache.shiro.web.filter.authc.FormAuthenticationFilter {

    @Override
    protected void setFailureAttribute(ServletRequest request, AuthenticationException ae) {
        String message = ae.getMessage();
        request.setAttribute(getFailureKeyAttribute(), message);
    }

}
