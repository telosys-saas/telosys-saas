package org.telosys.saas.security;

import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.Permission;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telosys.tools.users.User;
import org.telosys.tools.users.UserType;

import java.util.HashSet;
import java.util.Set;

// From example : http://shiro-user.582556.n2.nabble.com/How-to-add-a-role-to-the-subject-td5562700.html

public class FakeRealm extends AuthorizingRealm {
	
	private final static String REALM_NAME = "FakeRealm";
	
	private final Logger logger = LoggerFactory.getLogger(FakeRealm.class);
	
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		/**
		WHEN USER LOGS IN !!!
		**/
		
		logger.info("doGetAuthorizationInfo(token)...");
		UsernamePasswordToken upToken = (UsernamePasswordToken) token;
		String login = upToken.getUsername();
		logger.info("doGetAuthorizationInfo(token) : login = " + login );
		
		String password = new String(upToken.getPassword());
		logger.info("doGetAuthorizationInfo(token) : password = " + password );
		if ( password.toUpperCase().equals("OK") ) {
			// Authentication OK
			
			User user = new User(UserType.TELOSYS_USER, login);
			
//			Constructor that takes in a single 'primary' principal of the account and 
//			its corresponding credentials, associated with the specified realm. 
//
//			This is a convenience constructor and will construct a PrincipalCollection 
//			based on the principal and realmName argument.
//			Parameters:principal the 'primary' principal associated with the specified realm.credentials 
//			the credentials that verify the given principal.realmName the realm from where the principal and credentials were acquired.
			return new SimpleAuthenticationInfo(user, password, REALM_NAME);
		}
		else {
			// Authentication INVALID
			throw new AuthenticationException("Invalid user/password");
		}
	}

	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		
		logger.info("doGetAuthorizationInfo(principals)...");
		
		/**
		this function loads user authorization data from "userManager" data source (database)
		User, Role are custom POJOs (beans) and are loaded from database.  
		WildcardPermission implements shiros Permission interface, so my permissions in database gets accepted by shiro security
		**/
		
		Set<String>			roles			= new HashSet<String>();
		Set<Permission>		permissions		= new HashSet<Permission>();
		//Collection<User>	principalsList	= principals.byType(User.class);
		

//		if (principalsList.isEmpty()) {
//			throw new AuthorizationException("Empty principals list!");
//		}
//		//LOADING STUFF FOR PRINCIPAL 
//		for (User userPrincipal : principalsList) {
//			try {
//				this.userManager.beginTransaction();
//				
//				User user = this.userManager.loadById(userPrincipal.getId());
//				
//				Set<Role> userRoles	= user.getRoles();
//				for (Role r : userRoles) {
//					roles.add(r.getName());
//					Set<WildcardPermission> userPermissions	= r.getPermissions();
//					for (WildcardPermission permission : userPermissions) {
//						if (!permissions.contains(permission)) {
//							permissions.add(permission);
//						}
//					}
//				}
//				this.userManager.commitTransaction();
//			} catch (InvalidDataException idEx) { //userManger exceptions
//				throw new AuthorizationException(idEx);
//			} catch (ResourceException rEx) {
//				throw new AuthorizationException(rEx);
//			} 
//		}
		
		//THIS IS THE MAIN CODE YOU NEED TO DO !!!!
		SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo(roles);
		authorizationInfo.setRoles(roles); //fill in roles 
		authorizationInfo.setObjectPermissions(permissions); //add permisions (MUST IMPLEMENT SHIRO PERMISSION INTERFACE)
		
		return authorizationInfo;
	}

}
