package org.telosys.saas.config ;

import java.util.Properties;

import org.telosys.tools.commons.FileUtil;

/**
 * Telosys SaaS Configuration ( SINGLE INSTANCE )
 * 
 * @author Laurent Guerin
 */
public class Configuration {

	//--- Files names
	private static final String USERS_FILE_NAME     = "users.txt" ;
	
	//--- Parameters names
//	private static final String DATA_ROOT_PATH        = "dataRootPath" ;
//	private static final String HTTP_PORT             = "httpPort" ;
	private static final String AUTH_REDIRECT_URL     = "authRedirectUrl" ;
	private static final String GITHUB_OAUTH_KEY      = "githubOauthKey" ;
	private static final String GITHUB_OAUTH_PASSWORD = "githubOauthPassword" ;

	//--- Default values
//	private static final String DATA_ROOT_PATH_DEFAULT_VALUE        = "fs" ;
//	private static final String HTTP_PORT_DEFAULT_VALUE             = "80" ;
	private static final String AUTH_REDIRECT_URL_DEFAULT_VALUE     = null ;
	private static final String GITHUB_OAUTH_KEY_DEFAULT_VALUE      = null ;
	private static final String GITHUB_OAUTH_PASSWORD_DEFAULT_VALUE = null ;
	
	//--- Attributes
	private final String dataRootPath; 
	private final String usersFilePath; 
//	private final String httpPort; 
	private final String authRedirectUrl;
	private final String githubOauthKey;
	private final String githubOauthPassword;
	
	//--------------------------------------------------------------------------------
	/**
	 * Constructor <br>
	 * Build the configuration with default properties
	 * @param dataRootPath
	 */
	protected Configuration(String dataRootPath) {
		
//		this.dataRootPath        = DATA_ROOT_PATH_DEFAULT_VALUE ;
		this.dataRootPath        = dataRootPath ;
		this.usersFilePath       = FileUtil.buildFilePath(dataRootPath, USERS_FILE_NAME);
//		this.httpPort            = HTTP_PORT_DEFAULT_VALUE ;
		
		this.authRedirectUrl     = AUTH_REDIRECT_URL_DEFAULT_VALUE;
		this.githubOauthKey      = GITHUB_OAUTH_KEY_DEFAULT_VALUE;
		this.githubOauthPassword = GITHUB_OAUTH_PASSWORD_DEFAULT_VALUE;
	}
	
	//--------------------------------------------------------------------------------
	/**
	 * Constructor <br>
	 * Build the configuration from the given properties
	 * @param dataRootPath
	 * @param properties
	 */
	protected Configuration(String dataRootPath, Properties properties) {
		
//		this.dataRootPath        = paramValue( properties.getProperty(DATA_ROOT_PATH),        DATA_ROOT_PATH_DEFAULT_VALUE) ;
		this.dataRootPath        = dataRootPath ;
		this.usersFilePath       = FileUtil.buildFilePath(dataRootPath, USERS_FILE_NAME);
		
//		this.httpPort            = paramValue( properties.getProperty(HTTP_PORT),             HTTP_PORT_DEFAULT_VALUE);
		
		this.authRedirectUrl     = paramValue( properties.getProperty(AUTH_REDIRECT_URL),     AUTH_REDIRECT_URL_DEFAULT_VALUE);
		this.githubOauthKey      = paramValue( properties.getProperty(GITHUB_OAUTH_KEY),      GITHUB_OAUTH_KEY_DEFAULT_VALUE);
		this.githubOauthPassword = paramValue( properties.getProperty(GITHUB_OAUTH_PASSWORD), GITHUB_OAUTH_PASSWORD_DEFAULT_VALUE);
	}
	
	//--------------------------------------------------------------------------------
	/**
	 * Returns the trimmed parameter value or the given default value if null or void
	 * @param paramValue
	 * @param defaultValue
	 * @return
	 */
	private String paramValue(String paramValue, String defaultValue) {
		if ( paramValue != null ) {
			String paramValue2 = paramValue.trim() ;
			if ( paramValue2.length() > 0 ) {
				return paramValue2 ;
			}
		}
		return defaultValue ;
	}
	//--------------------------------------------------------------------------------
	public String getDataRootPath() {
		return dataRootPath;
	}
	public String getUsersFilePath() {
		return usersFilePath;
	}
//	public String getHttpPort() {
//		return httpPort;
//	}
	public String getAuthRedirectUrl() {
		return authRedirectUrl;
	}
	public String getGithubOauthKey() {
		return githubOauthKey;
	}
	public String getGthubOauthPassword() {
		return githubOauthPassword;
	}
//	public int getHttpPortAsInt() {
//		try {
//			return Integer.parseInt(httpPort);
//		} catch (NumberFormatException e) {
//			throw new RuntimeException("Configuration error, cannot convert http port '"+httpPort+"' to int");
//		}
//	}

}
