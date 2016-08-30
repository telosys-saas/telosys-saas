package org.telosys.saas.servlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Redirect after login
 */
@WebServlet("/profile/github")
public class RedirectAfterGithubLogin extends HttpServlet {

    protected static final Logger LOG = LoggerFactory.getLogger(RedirectAfterGithubLogin.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        LOG.info("doGet - BEGIN");
        resp.sendRedirect("/workspace");
        LOG.info("doGet - END");
    }
}
