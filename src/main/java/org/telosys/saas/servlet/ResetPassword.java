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
        PasswordEncoder passwordEncoder = new PasswordEncoder();
        if(!Util.equalsAndNotEmpty(request.getParameter("password1"), request.getParameter("password2"))) {
            throw new IllegalStateException("create user : password is not defined");
        }
        String login = (String) request.getSession().getAttribute("login");
        UsersManager usersManager = UsersManager.getInstance();
        User userExisting = usersManager.getUserByLogin(login);
        if(userExisting == null){
            throw new IllegalStateException("reset password : user doesn't exist");
        }

        userExisting.setEncryptedPassword(passwordEncoder.encrypt(request.getParameter("password1")));
        usersManager.deleteUser(userExisting.getLogin());
        usersManager.saveUser(userExisting);
        response.sendRedirect("/");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Find the user who match with the token in the url link
        String urlRequest = request.getRequestURL().toString();
        String[] parseUrlRequest = urlRequest.split("/");
        String token = parseUrlRequest[4];
        Memory memory = Memory.getMemory();
        User userExisting = memory.findUserByToken(token);
        if(userExisting == null){
            throw new IllegalStateException("reset password : bad link");
        }
        // Save the user's login in the session
        request.getSession().setAttribute("login",userExisting.getLogin());
        response.sendRedirect("/resetPassword.html");
    }
}
