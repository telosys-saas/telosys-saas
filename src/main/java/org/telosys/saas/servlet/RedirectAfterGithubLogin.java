package org.telosys.saas.servlet;

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
        request.getSession().removeAttribute("error");

        response.sendRedirect(request.getContextPath() + "/workspace");
    }
}
