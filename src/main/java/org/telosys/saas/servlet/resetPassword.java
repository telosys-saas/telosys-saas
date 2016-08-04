package org.telosys.saas.servlet;

import org.telosys.saas.util.Util;
import org.telosys.tools.users.User;
import org.telosys.tools.users.UsersManager;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/resetPassword/*")
public class resetPassword extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        StringBuffer urlRequest = request.getRequestURL();
        String[] parseUrlRequest = Util.splitWithNullIfEmpty(urlRequest.toString(), '/');
        if(parseUrlRequest == null){
            throw new IllegalStateException("reset password : bad link");
        }
        String login = parseUrlRequest[4];
        UsersManager usersManager = UsersManager.getInstance();
        User userExisting = usersManager.getUserByLogin(login);
        if(userExisting == null){
            throw new IllegalStateException("reset password : user doesn't exist");
        }
        if(!usersManager.checkPassword(userExisting, parseUrlRequest[5])){
            throw new IllegalStateException("reset password : bad link");
        }
        response.sendRedirect("/resetPassword.html");
    }
}
