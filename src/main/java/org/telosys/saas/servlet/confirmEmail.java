package org.telosys.saas.servlet;

import org.telosys.tools.users.User;
import org.telosys.tools.users.UsersManager;
import org.telosys.tools.users.crypto.PasswordEncoder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/confirmEmail/*")
public class confirmEmail extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String urlRequest = request.getRequestURL().toString();
        String[] parseUrlRequest = urlRequest.split("/");
        String login = parseUrlRequest[4];
        String emailEncrypted = parseUrlRequest[5];
        PasswordEncoder passwordEncoder = new PasswordEncoder();
        UsersManager usersManager = UsersManager.getInstance();
        User userExisting = usersManager.getUserByLogin(login);
        if(userExisting == null){
            throw new IllegalStateException("forget password : user doesn't exist");
        }
        if(emailEncrypted.equals(passwordEncoder.encrypt(userExisting.getMail()))){
            String email = userExisting.getMail();
            userExisting.setMail(email.substring(1));
        }
        usersManager.deleteUser(userExisting.getLogin());
        usersManager.saveUser(userExisting);
        response.sendRedirect("/login");
    }
}
