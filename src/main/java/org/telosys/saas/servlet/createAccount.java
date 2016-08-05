package org.telosys.saas.servlet;

import org.telosys.saas.util.GMail;
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

@WebServlet("/createAccount")
public class createAccount extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PasswordEncoder passwordEncoder = new PasswordEncoder();
        UsersManager usersManager = UsersManager.getInstance();
        GMail gMail = new GMail();
        if(Util.isEmpty(request.getParameter("login"))){
            throw new IllegalStateException("create user : login is not defined");
        }
        if (Util.isEmpty(request.getParameter("mail"))) {
            throw new IllegalStateException("create user : mail is not defined");
        }
        if(!Util.equalsAndNotEmpty(request.getParameter("password1"), request.getParameter("password2"))) {
            throw new IllegalStateException("create user : password is not defined");
        }
        User userExisting = usersManager.getUserByLogin(request.getParameter("login"));
        if (userExisting != null) {
            throw new IllegalStateException("create user : user already exists");
        }
        // TODO search by mail
        User user = new User();
        user.setLogin(request.getParameter("login"));
        user.setMail("!" + request.getParameter("mail"));
        usersManager.saveUser(user, request.getParameter("password1"));
        String subjectMail = "Confirm Telosys account";
        String bodyMail = "Dear " + user.getLogin() + "," + " Please click on the following link to confirm your email address" +
                " http://localhost:8080/confirmEmail/" + user.getLogin() +  "/" + passwordEncoder.encrypt(user.getMail()) +
                " Sincerly," +
                " The Telosys Team";
        gMail.send(request.getParameter("mail"), subjectMail, bodyMail);
        response.sendRedirect("/");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.sendRedirect("createAccount.html");
    }
}