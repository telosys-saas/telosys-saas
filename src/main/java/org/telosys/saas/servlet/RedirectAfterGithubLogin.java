package org.telosys.saas.servlet;

import org.telosys.saas.security.Security;

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

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // remove last error message
        request.getSession().removeAttribute("success");
        request.getSession().removeAttribute("error");
        if(Security.isAuthenticated()) {
            response.sendRedirect(request.getContextPath() + "/workspace/index.html");
            return;
        }
        response.sendRedirect(request.getContextPath() + "/");
    }
}
