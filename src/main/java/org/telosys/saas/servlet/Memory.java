package org.telosys.saas.servlet;

import org.telosys.tools.users.User;

import java.util.HashMap;

/**
 * Single instance for memory
 */
public class Memory {

    private static Memory memory = new Memory();

    private HashMap<String, User> temporaryUser = new HashMap<>();

    private Memory(){}

    public HashMap<String, User> getTemporaryUser() {
        return temporaryUser;
    }

    public static Memory getMemory() {
        return memory;
    }

    public void addUser(String token, User user){
        temporaryUser.put(token,user);
    }

    public User findUserByToken(String token){
        return temporaryUser.remove(token);
    }
}
