package org.telosys.saas.domain;

import java.io.Serializable;
import java.util.List;

import org.telosys.tools.generic.model.Attribute;
import org.telosys.tools.generic.model.ForeignKey;
import org.telosys.tools.generic.model.Link;

public class Entity implements Serializable {

	private static final long serialVersionUID = -2158666380474141089L;
	private String fullName;

	
	public List<Attribute> getAttributes() {
		return null;
	}

	
	public String getClassName() {
		return null;
	}

	
	public String getDatabaseCatalog() {
		return null;
	}

	
	public List<ForeignKey> getDatabaseForeignKeys() {
		return null;
	}

	
	public String getDatabaseSchema() {
		return null;
	}

	
	public String getDatabaseTable() {
		return null;
	}

	
	public String getDatabaseType() {
		return null;
	}

	
	public String getFullName() {
		return fullName;
	}

	
	public List<Link> getLinks() {
		return null;
	}

	
	public String getPackageName() {
		return null;
	}

	
	public Boolean isTableType() {
		return null;
	}

	
	public Boolean isViewType() {
		return null;
	}

	
	public List<String> getWarnings() {
		return null;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	
}
