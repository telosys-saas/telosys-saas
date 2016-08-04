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

@WebServlet("/forgetPassword")
public class forgetPassword extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        UsersManager usersManager = UsersManager.getInstance();
        GMail gMail = new GMail();
        User userExisting = usersManager.getUserByLogin(request.getParameter("login"));
        if (userExisting == null) {
            throw new IllegalStateException("forget password : user doesn't exist");
        }
        if (!Util.equalsAndNotEmpty(request.getParameter("mail"), userExisting.getMail())) {
            throw new IllegalStateException("forget password : bad email");
        }
        String bodyMail = "Dear " + userExisting.getLogin() + "," + " Please click on the following link to reset your password" +
                " http://localhost:8080/resetPassword/" + userExisting.getLogin() + "/" + userExisting.getEncryptedPassword() +
                " Sincerly," +
                " The Telosys Team";
        gMail.send(userExisting.getMail(), "Reset Telosys password", bodyMail);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.sendRedirect("/forgetPassword.html");
    }
}
