package org.telosys.saas.domain;

import java.io.Serializable;

public class UserCreation implements Serializable {
	
	private static final long serialVersionUID = 1442287179539168210L;

	private String login;
	private String password;
	private String mail;
	
	public String getLogin() {
		return login;
	}
	public void setLogin(String login) {
		this.login = login;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getMail() {
		return mail;
	}
	public void setMail(String mail) {
		this.mail = mail;
	}
	
}
