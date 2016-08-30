package org.telosys.saas.rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.telosys.saas.domain.UserChangePassword;
import org.telosys.saas.domain.UserCreation;
import org.telosys.saas.security.Security;
import org.telosys.saas.util.Util;
import org.telosys.tools.users.User;
import org.telosys.tools.users.UserType;
import org.telosys.tools.users.UsersManager;

@Path("/users")
public class UsersResource {

    private UsersManager usersManager = UsersManager.getInstance();

    @Context
    private HttpServletRequest request;
    @Context
    private HttpServletResponse response;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public User saveUser(UserCreation userCreation) {
        if (Util.isEmpty(userCreation.getLogin())) {
            throw new IllegalStateException("create user : login is not defined");
        }
        if (Util.isEmpty(userCreation.getPassword())) {
            throw new IllegalStateException("create user : password is not defined");
        }
        if (Util.isEmpty(userCreation.getMail())) {
            throw new IllegalStateException("create user : mail is not defined");
        }
        User userExisting = usersManager.getUserByLogin(userCreation.getLogin());
        if (userExisting != null) {
            throw new IllegalStateException("create user : user already exists");
        }
        User user = new User(UserType.TELOSYS_USER, userCreation.getLogin());
        user.setMail(userCreation.getMail());
        usersManager.saveUser(user, userCreation.getPassword());
        return user;
    }

    @Path("{login}")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public User saveUser(@PathParam("login") String login, User user) {
        if (!Util.equalsAndNotEmpty(user.getLogin(), login)) {
            throw new IllegalStateException("save user : logins are not the same");
        }
        User authenticatedUser = Security.getUser();
        if (!Util.equalsAndNotEmpty(authenticatedUser.getLogin(), login)) {
            throw new IllegalStateException("save user : not authorized");
        }
        usersManager.saveUser(user);
        return user;
    }

    @Path("{login}/action/changePassword")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public User changePassword(@PathParam("login") String login, UserChangePassword userChangePassword) {
        if (Util.isEmpty(login)) {
            throw new IllegalStateException("change password: login is not defined");
        }
        if (Util.isEmpty(userChangePassword.getOldPassword())) {
            throw new IllegalStateException("change password : old password is not defined");
        }
        if (Util.isEmpty(userChangePassword.getPassword())) {
            throw new IllegalStateException("change password : password is not defined");
        }
        User authenticatedUser = Security.getUser();
        if (!Util.equalsAndNotEmpty(authenticatedUser.getLogin(), login)) {
            throw new IllegalStateException("change password : not authorized");
        }
        User user = usersManager.getUserByLogin(login);
        if (!usersManager.checkPassword(user, userChangePassword.getOldPassword())) {
            throw new IllegalStateException("change password : old password is not valid");
        }
        usersManager.saveUser(user, userChangePassword.getPassword());
        return user;
    }

    @Path("{login}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public User getUser(@PathParam("login") String login) {
        User authenticatedUser = Security.getUser();
        if (!Util.equalsAndNotEmpty(authenticatedUser.getLogin(), login)) {
            throw new IllegalStateException("save user : not authorized");
        }
        return usersManager.getUserByLogin(login);
    }

}
