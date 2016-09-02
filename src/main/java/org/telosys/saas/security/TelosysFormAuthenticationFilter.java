package org.telosys.saas.security;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Form Authentication Filter
 */
public class TelosysFormAuthenticationFilter extends org.apache.shiro.web.filter.authc.FormAuthenticationFilter {

    private final Logger logger = LoggerFactory.getLogger(TelosysFormAuthenticationFilter.class);

    @Override
    protected void setFailureAttribute(ServletRequest request, AuthenticationException ae) {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpSession session = httpServletRequest.getSession(false);
        String message = ae.getMessage();
        session.setAttribute(getFailureKeyAttribute(), message);
    }

    @Override
    protected boolean onLoginSuccess(AuthenticationToken token, Subject subject, ServletRequest request, ServletResponse response) throws Exception {
        this.issueSuccessRedirect(request, response);
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpSession session = httpServletRequest.getSession(false);
        if (session.getAttribute("numberOfTry") != null) {
            session.setAttribute("numberOfTry", null);
        }
        return false;
    }

    @Override
    protected boolean onLoginFailure(AuthenticationToken token, AuthenticationException e, ServletRequest request, ServletResponse response) {
        this.setFailureAttribute(request, e);

        logger.info("onLoginFailure()...");
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        HttpSession session = httpServletRequest.getSession(false);
        logger.info("onLoginFailure() : session = ", session);
        if(session != null) {
            // case : the user tries to login for the first time
            if (session.getAttribute("numberOfTry") == null) {
                session.setAttribute("numberOfTry", 1);
            } else {
                int numberOfTry = (int) session.getAttribute("numberOfTry");
                // the user tries 3 times to login
                if (numberOfTry >= 2) {
                    session.setAttribute("numberOfTry", ++numberOfTry);
                    session.setAttribute("error", "You have exceeded the number of allowed login attempts");
                    try {
                        httpServletResponse.sendRedirect(httpServletRequest.getContextPath() + "/login.jsp");
                    } catch (IOException e1) {
                        e1.printStackTrace();
                    }
                } else {
                    session.setAttribute("numberOfTry", ++numberOfTry);
                }
            }
        }
        return true;
    }
}
