package org.telosys.saas.domain;

import java.io.Serializable;

public class Project implements Serializable {
	
	private static final long serialVersionUID = 801677158047725907L;
	
	private String id;
	
	private String name;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
