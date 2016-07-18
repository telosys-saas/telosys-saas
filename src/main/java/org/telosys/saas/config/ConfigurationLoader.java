package org.telosys.saas.config ;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telosys.tools.commons.ExternalConfiguration;
import org.telosys.tools.commons.FileUtil;


/**
 * Configuration Loader
 * 
 * @author Laurent Guerin
 */
class ConfigurationLoader {
	
	protected static final Logger logger = LoggerFactory.getLogger(ConfigurationLoader.class);
	
	private final static String TELOSYS_ROOT = "TELOSYS_ROOT";
	private final static String PROPERTIES_FILE_NAME  = "telosys-saas.properties";
	
	/**
	 * Constructor
	 */
	protected ConfigurationLoader() {
		super();
	}
	
	/**
	 * Loads the configuration using the data root path defined externally <br>
	 * and properties file 'telosys-saas.properties' <br>
	 * @return the configuration or NULL if the configuration cannot be initialized
	 */
	public Configuration loadConfiguration() {
		String telosysDataRootPath = getTelosysDataRootPath() ;
		if ( telosysDataRootPath == null ) {
			// ERROR : no configuration
			return null ;
		}
		
		Properties properties = null ;
		String telosysSaaSCfgFileName = FileUtil.buildFilePath(telosysDataRootPath, PROPERTIES_FILE_NAME);
		File telosysSaaSCfgFile = new File(telosysSaaSCfgFileName);
		if ( telosysSaaSCfgFile.exists() ) {
			// load properties from the file located in the root directory
			properties = loadProperties(telosysSaaSCfgFileName);
		}
		else {
			// load properties from the file embedded in the WebApp ( in war file )
			properties = loadProperties();
		}
		if ( properties != null ) {
			return new Configuration(telosysDataRootPath, properties);
		}
		else {
			return new Configuration(telosysDataRootPath);
		}
	}

	/**
	 * Try to get the Telosys SaaS Data Root <br>
	 * Must be defined as an external value : <br>
	 * Java System Property or JNDI value or OS environment variable<br>
	 * @return
	 */
	private String getTelosysDataRootPath() {
		String dataRootPath = ExternalConfiguration.getValue(TELOSYS_ROOT);
		if ( dataRootPath == null ) {
			logger.error("Telosys root path is not defined ( '"+TELOSYS_ROOT+"' is not set )");
			logger.error("'"+TELOSYS_ROOT+"' must be defined as Java System Property or JNDI value or OS env var");
		}
		else {
			File root = new File(dataRootPath);
			if ( root.exists() == false ) {
				logger.error("Invalid telosys root path : '"+dataRootPath+"' doesn't exist");
				return null ;
			}
			else if ( root.isDirectory() == false ) {
				logger.error("Invalid telosys root path : '"+dataRootPath+"' is not a directory");
				return null ;
			}
		}
		return dataRootPath;
	}
	
	/**
	 * Try to load properties from the file 'telosys-saas.properties' embedded in the current war <br>
	 * 
	 * @return
	 */
	protected Properties loadProperties() {
		InputStream is = this.getClass().getClassLoader().getResourceAsStream(PROPERTIES_FILE_NAME);
		return loadProperties(is);
	}
	
	/**
	 * Try to load properties from the given file path <br>
	 * @param propertiesFilePath
	 * @return
	 */
	protected Properties loadProperties(String propertiesFilePath) {
		InputStream is = null;
		try {
			is = new FileInputStream(propertiesFilePath);
		} catch (FileNotFoundException e) {
			is = null ;
		}
		return loadProperties(is);
	}

	private Properties loadProperties(InputStream is) {
		Properties properties = null;
		if ( is != null ) {
			properties = new Properties();
			try {
				properties.load(is);
			} catch (IOException e) {
				logger.error("Error during properties loading",e);
				//throw new RuntimeException(e);
				properties = null ;
			}
			try {
				is.close();
			} catch (IOException e) {
				logger.error("Cannot close InputStream",e);
			}
		}
		else {
			properties = null ;
		}
		return properties;
	}
	
}
