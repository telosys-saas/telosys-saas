package org.telosys.saas.servlet;

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
public class createAccount extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        UsersManager usersManager = UsersManager.getInstance();
        Memory memory = Memory.getMemory();
        GMail gMail = new GMail();
        // Check if the user fill all the fields
        if(Util.isEmpty(request.getParameter("login"))){
            throw new IllegalStateException("create user : login is not defined");
        }
        if (Util.isEmpty(request.getParameter("mail"))) {
            throw new IllegalStateException("create user : mail is not defined");
        }
        if(!Util.equalsAndNotEmpty(request.getParameter("password1"), request.getParameter("password2"))) {
            throw new IllegalStateException("create user : password is not defined");
        }
        // Check if the user is unique
        User userExisting = usersManager.getUserByLogin(request.getParameter("login"));
        if (userExisting != null) {
            throw new IllegalStateException("create user : user already exists");
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
        String bodyMail = "Dear " + user.getLogin() + "," + " Please click on the following link to confirm your email address" +
                " http://localhost:8080/confirmEmail/" + token +
                " Sincerly," +
                " The Telosys Team";
        gMail.send(user.getMail(), subjectMail, bodyMail);
        // Redirect to the home page
        response.sendRedirect("/");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.sendRedirect("createAccount.html");
    }
}