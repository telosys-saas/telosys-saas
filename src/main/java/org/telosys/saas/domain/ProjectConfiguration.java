package org.telosys.saas.domain;

import java.io.Serializable;

public class ProjectConfiguration implements Serializable {

	private static final long serialVersionUID = -6707896119165202472L;
	
	private ProjectConfigurationConfig config = new ProjectConfigurationConfig();
	private ProjectConfigurationVariables variables = new ProjectConfigurationVariables();
	
	public ProjectConfigurationConfig getConfig() {
		return config;
	}
	public void setConfig(ProjectConfigurationConfig config) {
		this.config = config;
	}
	public ProjectConfigurationVariables getVariables() {
		return variables;
	}
	public void setVariables(ProjectConfigurationVariables variables) {
		this.variables = variables;
	}
	
}
