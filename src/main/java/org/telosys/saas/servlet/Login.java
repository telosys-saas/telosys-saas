package org.telosys.saas.servlet;

import org.telosys.saas.security.Security;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet to manage the log process
 */
@WebServlet("/login")
public class Login extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // remove last error message
        request.getSession().removeAttribute("success");
        request.getSession().removeAttribute("error");

        // The user is already authenticated
        if (Security.isAuthenticated()) {
            response.sendRedirect(request.getContextPath() + "/workspace/index.html");
            return;
        }
        // The user access to the login page for the first time
        if (request.getSession().getAttribute("numberOfTry") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }
        int numberOfTry = (int) request.getSession().getAttribute("numberOfTry");
        // THe user try 3 times to log in
        if (numberOfTry >= 3) {
            request.getSession().setAttribute("error", "You have exceeded the number of allowed login attempts");
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }
        response.sendRedirect(request.getContextPath() + "/login.jsp");
    }
}
