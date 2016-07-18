package org.telosys.saas.domain;

import java.io.Serializable;

public class ParsingError implements Serializable {

	private static final long serialVersionUID = -4074129591681466854L;
	
	private String entityName;
	private String message;
	
	public String getEntityName() {
		return entityName;
	}
	public void setEntityName(String entityName) {
		this.entityName = entityName;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
}
