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


/**
 * Servlet to validate the email address of a new user
 */
@WebServlet("/confirmEmail/*")
public class ConfirmEmail extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // remove last error message
        request.getSession().removeAttribute("success");
        request.getSession().removeAttribute("error");

        String urlRequest = request.getRequestURL().toString();
        String[] parseUrlRequest = urlRequest.split("/");
        String token = parseUrlRequest[4];
        Memory memory = Memory.getMemory();
        UsersManager usersManager = UsersManager.getInstance();
        User user = memory.findUserByToken(token);
        if(user == null){
            request.getSession().setAttribute("error", "Bad confirmation link");
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }
        usersManager.saveUser(user, user.getEncryptedPassword());
        response.sendRedirect(request.getContextPath() + "/login");
    }
}
