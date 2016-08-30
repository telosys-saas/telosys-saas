package org.telosys.saas.servlet;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telosys.saas.config.Configuration;
import org.telosys.saas.config.ConfigurationHolder;
import org.telosys.tools.users.UsersManager;

/**
 * Application initialization.
 */
public class InitServletContextListener implements ServletContextListener {

	protected static final Logger LOG = LoggerFactory.getLogger(InitServletContextListener.class);

	/**
	 * Initialization
	 */
	@Override
	public void contextInitialized(ServletContextEvent servletContextEvent) {
		LOG.info("contextInitialized - BEGIN");
		LOG.info("Initialization");
		LOG.info("Loading configuration...");
		Configuration configuration = ConfigurationHolder.getConfiguration();
		if ( configuration != null ) {
			LOG.info("Configuration loaded");
			LOG.info(" . data root path  = " + configuration.getDataRootPath() );
			LOG.info(" . users file path = " + configuration.getUsersFilePath() );
			UsersManager.setUsersFileName(configuration.getUsersFilePath());
			LOG.info("UsersManager initialized.");
		}
		else {
			
		}
//		String dataRootPath = configuration.getDataRootPath();
//		String usersFilePath = dataRootPath + "/users.csv";
//		LOG.info("Users file : "+usersFilePath);
//		UsersManager.setUsersFileName(usersFilePath);
		LOG.info("contextInitialized - END");
	}

	@Override
	public void contextDestroyed(ServletContextEvent servletContextEvent) {
		
	}
	
}
