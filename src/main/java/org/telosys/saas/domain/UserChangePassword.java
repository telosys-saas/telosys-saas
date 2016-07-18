package org.telosys.saas.domain;

import java.io.Serializable;

public class UserChangePassword implements Serializable {

	private static final long serialVersionUID = 6103278252164892240L;

	private String oldPassword;
	private String password;
	
	public String getOldPassword() {
		return oldPassword;
	}
	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}
	
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
}
