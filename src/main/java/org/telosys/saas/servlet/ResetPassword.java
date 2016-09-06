package org.telosys.saas.servlet;

import org.telosys.saas.util.Util;
import org.telosys.tools.users.User;
import org.telosys.tools.users.UsersManager;
import org.telosys.tools.users.crypto.PasswordEncoder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet to reset the password for a user
 */
@WebServlet("/resetPassword/*")
public class ResetPassword extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // remove last error message
        request.getSession().removeAttribute("success");
        request.getSession().removeAttribute("error");

        PasswordEncoder passwordEncoder = new PasswordEncoder();
        if (!Util.equalsAndNotEmpty(request.getParameter("password1"), request.getParameter("password2"))) {
            request.getSession().setAttribute("error", "Password is not defined");
            response.sendRedirect(request.getContextPath() + "/resetPassword.jsp");
            return;
        }
        String login = (String) request.getSession().getAttribute("login");
        UsersManager usersManager = UsersManager.getInstance();
        User userExisting = usersManager.getUserByLogin(login);
        if (userExisting == null) {
            request.getSession().setAttribute("error", "User does not exist");
            response.sendRedirect(request.getContextPath() + "/resetPassword.jsp");
            return;
        }

        userExisting.setEncryptedPassword(passwordEncoder.encrypt(request.getParameter("password1")));
        usersManager.deleteUser(userExisting.getLogin());
        usersManager.saveUser(userExisting);
        response.sendRedirect(request.getContextPath() + "/login.jsp");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // remove last error message
        request.getSession().removeAttribute("success");
        request.getSession().removeAttribute("error");

        // Find the user who match with the token in the url link
        String urlRequest = request.getRequestURL().toString();
        String[] parseUrlRequest = urlRequest.split("/");
        String token = parseUrlRequest[parseUrlRequest.length - 1];
        Memory memory = Memory.getMemory();
        User userExisting = memory.findUserByToken(token);
        if (userExisting == null) {
            request.getSession().setAttribute("error", "Bad reset password link");
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }
        // Save the user's login in the session
        request.getSession().setAttribute("login", userExisting.getLogin());
        response.sendRedirect(request.getContextPath() + "/resetPassword.jsp");
    }
}
