package org.telosys.saas.security;

import static org.junit.Assert.assertEquals;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import org.junit.Test;
import org.pac4j.http.credentials.UsernamePasswordCredentials;
import org.telosys.tools.users.User;
import org.telosys.tools.users.UsersManager;
import org.telosys.tools.users.crypto.PasswordEncoder;

public class FormAuthenticatorITest {
	
	@Test
	public void testValidate() throws IOException {
		// Given
		FormAuthenticator formAuthenticator = new FormAuthenticator();
		
		UsernamePasswordCredentials credentials = new UsernamePasswordCredentials("username", "password", "formClient");
		
		// user file initialization
		File temp = File.createTempFile("users", ".csv");
		UsersManager.setUsersFileName(temp.getAbsolutePath());
		
		// user creation in user file
		User user = new User();
		user.setLogin("username");
		UsersManager.getInstance().saveUser(user, "password");
		
		// When
		try {
			formAuthenticator.validate(credentials);
		} catch(IllegalStateException e) {
			// Then
			assertEquals("Users file name has not been initialized ( setUsersFileName() must be called before )", e.getMessage());
		}
	}
	
}