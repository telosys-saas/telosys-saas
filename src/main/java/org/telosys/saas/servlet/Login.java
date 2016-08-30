package org.telosys.saas.servlet;

import org.pac4j.core.context.J2EContext;
import org.pac4j.core.profile.ProfileManager;
import org.pac4j.core.profile.UserProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telosys.saas.security.FormAuthenticator;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet to manage the log process
 */
@WebServlet("/login/*")
public class Login extends HttpServlet {

    protected static final Logger LOG = LoggerFactory.getLogger(Login.class);

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        LOG.info("doPost - BEGIN");
        LOG.info("doPost - END");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        LOG.info("doGet - BEGIN");

        J2EContext context = new J2EContext(request, response);
        ProfileManager<UserProfile> manager = new ProfileManager<>(context);
        UserProfile profile = manager.get(true);

        // user is already authenticated
        if (profile != null) {
            LOG.debug("Authenticated user : " + profile);
            LOG.info("Authenticated => redirect to the workspace page");
            response.sendRedirect("/workspace");
            LOG.info("doGet - END");
            return;
        }

        // Case : user is not authenticated
        LOG.debug("User is not authenticated : " + profile);

        // case : the user tries to login for the first time
        LOG.debug("Number of try : " + request.getSession().getAttribute("numberOfTry"));
        if (request.getSession().getAttribute("numberOfTry") == null) {
            request.getSession().setAttribute("numberOfTry", 0);
            LOG.info("Display the login page");
            response.sendRedirect("/login.jsp");
            LOG.info("doGet - END");
            return;
        }

        int numberOfTry = (int) request.getSession().getAttribute("numberOfTry");

        if (numberOfTry >= 3) {
            // the user tries 3 times to login
            request.getSession().setAttribute("error", "You reach the limit of login try.");
            LOG.info("Reach the limit of login try => Redirect to the welcome page");
            response.sendRedirect("/");
            LOG.info("doGet - END");
            return;
        }

        // Error message
        LOG.info("Incorrect username or password");
        request.getSession().setAttribute("error", "Incorrect username or password.");

        request.getSession().setAttribute("numberOfTry", ++numberOfTry);

        LOG.info("Display the login page - numberOfTry = " + numberOfTry);
        response.sendRedirect("/login.jsp");
        LOG.info("doGet - END");
    }
}
