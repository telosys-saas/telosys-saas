package org.telosys.saas.security;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.pac4j.core.exception.CredentialsException;
import org.pac4j.core.profile.CommonProfile;
import org.pac4j.core.profile.UserProfile;
import org.pac4j.http.credentials.UsernamePasswordCredentials;
import org.telosys.tools.users.User;
import org.telosys.tools.users.UsersManager;

@RunWith(MockitoJUnitRunner.class)
public class FormAuthenticatorUTest {
	@Mock
	private UsersManager usersManager;
	@InjectMocks
	private FormAuthenticator formAuthenticator;

	@Test
	public void testThrowsException() throws Exception {
		// Given
		String message = "test";
		
		// When
		try {
			formAuthenticator.throwsException(message);
			fail("An exception should be thrown");
		} catch(CredentialsException credentialsException) {
			// Then
			assertEquals(message, credentialsException.getMessage());
		}
	}

	@Test
	public void testValidateWithEmptyCredentials() throws Exception {
		// Given
		UsernamePasswordCredentials credentials = null;
		
		// When
		try {
			formAuthenticator.validate(credentials);
			fail("An exception should be thrown");
		} catch(CredentialsException e) {
			// Then
			assertEquals("No credentials", e.getMessage());
		}
	}

	@Test
	public void testValidateWithoutUsername() throws Exception {
		// Given
		UsernamePasswordCredentials credentials = mock(UsernamePasswordCredentials.class);
		when(credentials.getUsername()).thenReturn("");
		
		// When
		try {
			formAuthenticator.validate(credentials);
			fail("An exception should be thrown");
		} catch(CredentialsException e) {
			// Then
			assertEquals("Username cannot be blank", e.getMessage());
		}
	}

	@Test
	public void testValidateWithoutPassword() throws Exception {
		// Given
		UsernamePasswordCredentials credentials = mock(UsernamePasswordCredentials.class);
		when(credentials.getUsername()).thenReturn("username");
		when(credentials.getPassword()).thenReturn("");
		
		// When
		try {
			formAuthenticator.validate(credentials);
			fail("An exception should be thrown");
		} catch(CredentialsException e) {
			// Then
			assertEquals("Password cannot be blank", e.getMessage());
		}
	}

	@Test
	public void testValidateWithNoExistingUser() throws Exception {
		// Given
		UsernamePasswordCredentials credentials = mock(UsernamePasswordCredentials.class);
		when(credentials.getUsername()).thenReturn("username");
		when(credentials.getPassword()).thenReturn("password");
		
		// When
		try {
			formAuthenticator.validate(credentials);
			fail("An exception should be thrown");
		} catch(CredentialsException e) {
			// Then
			assertEquals("User does not exist", e.getMessage());
		}
	}

	@Test
	public void testValidateWithBadPassword() throws Exception {
		// Given
		UsernamePasswordCredentials credentials = mock(UsernamePasswordCredentials.class);
		when(credentials.getUsername()).thenReturn("username");
		when(credentials.getPassword()).thenReturn("password");
		
		User user = mock(User.class);
		when(usersManager.getUserByLogin("username")).thenReturn(user);
		
		// When
		try {
			formAuthenticator.validate(credentials);
			fail("An exception should be thrown");
		} catch(CredentialsException e) {
			// Then
			assertEquals("Username : 'username' invalid password", e.getMessage());
		}
	}

	@Test
	public void testValidate() throws Exception {
		// Given
		UsernamePasswordCredentials credentials = new UsernamePasswordCredentials("username", "password", "formClient");
		
		User user = mock(User.class);
		when(usersManager.getUserByLogin("username")).thenReturn(user);
		
		when(usersManager.checkPassword(user, "password")).thenReturn(true);
		
		// When
		formAuthenticator.validate(credentials);
		
		// Then
        UserProfile userProfile = credentials.getUserProfile();
		assertEquals("username", userProfile.getId());
		assertEquals("username", userProfile.getAttribute(CommonProfile.USERNAME));
		assertEquals(user, userProfile.getAttribute("USER"));
	}

}
