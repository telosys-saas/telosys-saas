package org.telosys.saas.servlet;

import org.telosys.saas.config.Configuration;
import org.telosys.saas.config.ConfigurationHolder;
import org.telosys.saas.util.GMail;
import org.telosys.saas.util.Util;
import org.telosys.tools.users.User;
import org.telosys.tools.users.UserType;
import org.telosys.tools.users.UsersManager;
import org.telosys.tools.users.crypto.PasswordEncoder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.math.BigInteger;
import java.security.SecureRandom;

/**
 * Servlet to create a new user account
 */
@WebServlet("/createAccount")
public class CreateAccount extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // remove last error message
        request.getSession().removeAttribute("success");
        request.getSession().removeAttribute("error");

        UsersManager usersManager = UsersManager.getInstance();
        Memory memory = Memory.getMemory();
        GMail gMail = new GMail();
        // Check if the user fill all the fields
        if(Util.isEmpty(request.getParameter("login"))){
            request.getSession().setAttribute("error", "Username is not defined");
            response.sendRedirect(request.getContextPath() + "/createAccount.jsp");
            return;
        }
        if (Util.isEmpty(request.getParameter("mail"))) {
            request.getSession().setAttribute("error", "Mail is not defined");
            response.sendRedirect(request.getContextPath() + "/createAccount.jsp");
            return;
        }
        if(!Util.equalsAndNotEmpty(request.getParameter("password1"), request.getParameter("password2"))) {
            request.getSession().setAttribute("error", "Password is not defined");
            response.sendRedirect(request.getContextPath() + "/createAccount.jsp");
            return;
        }
        // Check if the user is unique
        User userExisting = usersManager.getUserByLogin(request.getParameter("login"));
        if (userExisting != null) {
            request.getSession().setAttribute("error", "User already exists");
            response.sendRedirect(request.getContextPath() + "/createAccount.jsp");
            return;
        }
        // TODO search by mail
        // Create the new user
        User user = new User(UserType.TELOSYS_USER, request.getParameter("login"));
        user.setMail(request.getParameter("mail"));
        user.setEncryptedPassword(request.getParameter("password1"));
        // Save the new user in memory
        // and create a unique token for the link and memory map
        SecureRandom secureRandom = new SecureRandom();
        String token = new BigInteger(130, secureRandom).toString();
        memory.addUser(token,user);
        // Send a confirmation email
        String subjectMail = "Confirm Telosys account";
        Configuration configuration = ConfigurationHolder.getConfiguration();
        String bodyMail = "Dear " + user.getLogin() + "," + " Please click on the following link to confirm your email address : " +
                //" http://localhost:8080/confirmEmail/" + token +
                configuration.getMailRedirect() + "/confirmEmail/" + token +
                " Sincerly," +
                " The Telosys Team";
        gMail.send(user.getMail(), subjectMail, bodyMail);
        // Redirect to the home page
        request.getSession().setAttribute("success", "Mail sent for account creation");
        response.sendRedirect(request.getContextPath() + "/");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // remove last error message
        request.getSession().removeAttribute("success");
        request.getSession().removeAttribute("error");

        response.sendRedirect(request.getContextPath() + "/createAccount.jsp");
    }
}