package org.telosys.saas.servlet;

import org.telosys.saas.util.GMail;
import org.telosys.saas.util.Util;
import org.telosys.tools.users.User;
import org.telosys.tools.users.UsersManager;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.math.BigInteger;
import java.security.SecureRandom;

/**
 * Servlet used when a user lost is password
 */
@WebServlet("/forgetPassword")
public class ForgetPassword extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // remove last error message
        request.getSession().removeAttribute("error");

        UsersManager usersManager = UsersManager.getInstance();
        Memory memory = Memory.getMemory();
        GMail gMail = new GMail();
        // Check if the user exists
        User userExisting = usersManager.getUserByLogin(request.getParameter("login"));
        if (userExisting == null) {
            request.getSession().setAttribute("error", "User does not exist");
            response.sendRedirect(request.getContextPath() + "/forgetPassword.jsp");
            return;
        }
        if (!Util.equalsAndNotEmpty(request.getParameter("mail"), userExisting.getMail())) {
            request.getSession().setAttribute("error", "Bad email");
            response.sendRedirect(request.getContextPath() + "/forgetPassword.jsp");
            return;
        }
        // Save the new user in memory
        // and create a unique token for the link and memory map
        SecureRandom secureRandom = new SecureRandom();
        String token = new BigInteger(130, secureRandom).toString();
        memory.addUser(token,userExisting);
        String bodyMail = "Dear " + userExisting.getLogin() + "," + " Please click on the following link to reset your password" +
                " http://localhost:8080/resetPassword/" + token +
                " Sincerly," +
                " The Telosys Team";
        gMail.send(userExisting.getMail(), "Reset Telosys password", bodyMail);
        response.sendRedirect(request.getContextPath() + "/");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // remove last error message
        request.getSession().removeAttribute("error");

        response.sendRedirect(request.getContextPath() + "/forgetPassword.jsp");
    }
}
