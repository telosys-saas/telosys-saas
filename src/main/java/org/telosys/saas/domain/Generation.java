package org.telosys.saas.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Generation implements Serializable {

	private static final long serialVersionUID = -3308544789818811359L;
	
	private String model;
	private List<String> entities = new ArrayList<>();
	private String bundle;
	
	public List<String> getEntities() {
		return entities;
	}
	public void setEntities(List<String> entities) {
		this.entities = entities;
	}
	public String getModel() {
		return model;
	}
	public void setModel(String model) {
		this.model = model;
	}
	public String getBundle() {
		return bundle;
	}
	public void setBundle(String bundle) {
		this.bundle = bundle;
	}

}
