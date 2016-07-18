package org.telosys.saas.config ;

/**
 * Telosys SaaS Configuration ( SINGLE INSTANCE )
 * 
 * @author Laurent Guerin
 */
public class ConfigurationHolder {

	private static Configuration configuration ; 
	static {
		ConfigurationLoader configurationLoader = new ConfigurationLoader();
		configuration = configurationLoader.loadConfiguration();
	}
	
	public final static Configuration getConfiguration() {
		if ( configuration != null ) {
			return configuration ;
		}
		else {
			throw new RuntimeException("Configuration not initialized");
		}
	}

}
