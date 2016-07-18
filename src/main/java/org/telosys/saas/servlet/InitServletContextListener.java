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

	protected static final Logger logger = LoggerFactory.getLogger(InitServletContextListener.class);

	/**
	 * Initialization
	 */
	@Override
	public void contextInitialized(ServletContextEvent servletContextEvent) {
		logger.info("Initialization");
		logger.info("Loading configuration...");
		Configuration configuration = ConfigurationHolder.getConfiguration();
		if ( configuration != null ) {
			logger.info("Configuration loaded");
			logger.info(" . data root path  = " + configuration.getDataRootPath() );
			logger.info(" . users file path = " + configuration.getUsersFilePath() );
			UsersManager.setUsersFileName(configuration.getUsersFilePath());
			logger.info("UsersManager initialized.");
		}
		else {
			
		}
//		String dataRootPath = configuration.getDataRootPath();
//		String usersFilePath = dataRootPath + "/users.csv";
//		logger.info("Users file : "+usersFilePath);
//		UsersManager.setUsersFileName(usersFilePath);
	}

	@Override
	public void contextDestroyed(ServletContextEvent servletContextEvent) {
		
	}
	
}
