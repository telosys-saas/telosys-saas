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
import javax.ws.rs.PathParam;
import java.io.IOException;
import java.util.Objects;

@WebServlet("/createAccount")
public class createAccount extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        UsersManager usersManager = UsersManager.getInstance();
        GMail gMail = new GMail();
        if (Util.isEmpty(request.getParameter("mail"))) {
            throw new IllegalStateException("create user : mail is not defined");
        }
        User userExisting = usersManager.getUserByLogin(request.getParameter("login"));
        if (userExisting != null) {
            throw new IllegalStateException("create user : user already exists");
        }
        User user = new User();
        user.setLogin(request.getParameter("login"));
        user.setMail(request.getParameter("mail"));
        usersManager.saveUser(user, request.getParameter("password1"));
        String bodyMail = "Dear " + user.getLogin() + "," + " Please click on the following link http://localhost:8080/login/" +
                " Sincerly," +
                " The Telosys Team";
        gMail.send(request.getParameter("mail"), "Confirm Telosys account", bodyMail);
        response.sendRedirect("/");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.sendRedirect("createAccount.html");
    }
}