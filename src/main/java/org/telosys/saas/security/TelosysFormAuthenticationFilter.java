package org.telosys.saas.security;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telosys.saas.config.Configuration;
import org.telosys.saas.config.ConfigurationHolder;

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
        logger.info("setFailureAttribute()...");
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpSession session = httpServletRequest.getSession(false);
        String message = ae.getMessage();
        session.setAttribute(getFailureKeyAttribute(), message);
    }

    @Override
    protected boolean onLoginSuccess(AuthenticationToken token, Subject subject, ServletRequest request, ServletResponse response) throws Exception {

        logger.info("onLoginSuccess()...");

        Configuration configuration = ConfigurationHolder.getConfiguration();
        int loginAttemptsMax = Integer.parseInt(configuration.getLoginAttemptsMax());
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        HttpSession session = httpServletRequest.getSession(false);

        if (session.getAttribute("numberOfTry") != null) {
            int numberOfTry = (int) session.getAttribute("numberOfTry");
            if (numberOfTry >= loginAttemptsMax) {
                session.setAttribute("numberOfTry", numberOfTry);
                session.setAttribute("error", "You have exceeded the number of allowed login attempts (" + numberOfTry + "/"+ loginAttemptsMax + ")");
                try {
                    httpServletResponse.sendRedirect(httpServletRequest.getContextPath() + "/login.jsp  ");
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
                return false;
            }
            session.removeAttribute("numberOfTryMessage");
            session.removeAttribute("numberOfTry");
            session.removeAttribute("error");
            session.removeAttribute("success");
        }
        this.issueSuccessRedirect(request, response);
        return false;
    }

    @Override
    protected boolean onLoginFailure(AuthenticationToken token, AuthenticationException e, ServletRequest request, ServletResponse response) {

        logger.info("onLoginFailure()...");

        Configuration configuration = ConfigurationHolder.getConfiguration();
        int loginAttemptsMax = Integer.parseInt(configuration.getLoginAttemptsMax());
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpSession session = httpServletRequest.getSession(false);
        if(session != null) {
            // case : the user tries to login for the first time
            if (session.getAttribute("numberOfTry") == null) {
                int numberOfTry = 1;
                session.setAttribute("numberOfTry", numberOfTry);
                session.setAttribute("error", "Incorrect username or password (" + numberOfTry + "/"+ loginAttemptsMax + ")");
            } else {
                int numberOfTry = (int) session.getAttribute("numberOfTry");
                // the user tries 3 times to login
                if (numberOfTry >= loginAttemptsMax-1) {
                    if(numberOfTry == loginAttemptsMax-1){
                        ++numberOfTry;
                    }
                    session.setAttribute("numberOfTry", numberOfTry);
                    session.setAttribute("error", "You have exceeded the number of allowed login attempts (" + numberOfTry + "/"+ loginAttemptsMax + ")");
                } else {
                    session.setAttribute("numberOfTry", ++numberOfTry);
                    session.setAttribute("error", "Incorrect username or password (" + numberOfTry + "/"+ loginAttemptsMax + ")");
                }
            }
        }
        return true;
    }
}
