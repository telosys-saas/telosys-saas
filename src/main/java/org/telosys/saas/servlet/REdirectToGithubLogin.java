package org.telosys.saas.servlet;

import org.telosys.saas.config.Configuration;
import org.telosys.saas.config.ConfigurationHolder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/accessToGithub")
public class RedirectToGithubLogin extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Configuration configuration = ConfigurationHolder.getConfiguration();
        response.sendRedirect("https://github.com/login/oauth/authorize?scope=user:email&client_id=" + configuration.getGithubOauthKey());
    }
}
