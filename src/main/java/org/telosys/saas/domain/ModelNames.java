package org.telosys.saas.domain;

import java.io.Serializable;
import java.util.List;

public class ModelNames implements Serializable {
	
	private static final long serialVersionUID = 4406961007343792663L;
	
	private List<String> names;
	
	public List<String> getNames() {
		return names;
	}

	public void setNames(List<String> names) {
		this.names = names;
	}
	
}
