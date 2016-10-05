package org.telosys.saas.config;

import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telosys.saas.servlet.ConfirmEmail;
import org.telosys.tools.commons.FileUtil;

/**
 * Telosys SaaS Configuration ( SINGLE INSTANCE )
 *
 * @author Laurent Guerin
 */
public class Configuration {

    protected static final Logger logger = LoggerFactory.getLogger(Configuration.class);


    //--- Files names
    private static final String USERS_FILE_NAME = "users.txt";

    //--- Parameters names
    private static final String GITHUB_OAUTH_KEY = "githubOauthKey";
    private static final String GITHUB_OAUTH_PASSWORD = "githubOauthPassword";
    private static final String MAIL_USERNAME = "mailUsername";
    private static final String MAIL_PASSWORD = "mailPassword";
    private static final String MAIL_REDIRECT = "mailRedirect";
    private static final String SERVER_MAIL = "serverMail";
    private static final String LOGIN_ATTEMPS_MAX = "loginAttemptsMax";
    private static final String NUMBER_OF_PROJECT_MAX = "numberOfProjectMax";


    //--- Default values
    private static final String GITHUB_OAUTH_KEY_DEFAULT_VALUE = null;
    private static final String GITHUB_OAUTH_PASSWORD_DEFAULT_VALUE = null;
    private static final String MAIL_USERNAME_DEFAULT_VALUE = null;
    private static final String MAIL_REDIRECT_DEFAULT_VALUE = null;
    private static final String MAIL_PASSWORD_DEFAULT_VALUE = null;
    private static final String SERVER_MAIL_DEFAULT_VALUE = null;
    private static final String LOGIN_ATTEMPS_MAX_DEFAULT_VALUE = null;
    private static final String NUMBER_OF_PROJECT_MAX_DEFAULT_VALUE = null;


    //--- Attributes
    private final String dataRootPath;
    private final String usersFilePath;
    private final String githubOauthKey;
    private final String githubOauthPassword;
    private final String mailUsername;
    private final String mailPassword;
    private final String mailRedirect;
    private final String serverMail;
    private final String loginAttemptsMax;
    private final String numberOfProjectMax;


    //--------------------------------------------------------------------------------

    /**
     * Constructor <br>
     * Build the configuration with default properties
     *
     * @param dataRootPath
     */
    protected Configuration(String dataRootPath) {

        logger.info("Configuration(String dataRootPath)", dataRootPath);
        this.dataRootPath = dataRootPath;
        this.usersFilePath = FileUtil.buildFilePath(dataRootPath, USERS_FILE_NAME);
        this.githubOauthKey = GITHUB_OAUTH_KEY_DEFAULT_VALUE;
        this.githubOauthPassword = GITHUB_OAUTH_PASSWORD_DEFAULT_VALUE;
        this.mailUsername = MAIL_USERNAME_DEFAULT_VALUE;
        this.mailPassword = MAIL_PASSWORD_DEFAULT_VALUE;
        this.mailRedirect = MAIL_REDIRECT_DEFAULT_VALUE;
        this.serverMail = SERVER_MAIL_DEFAULT_VALUE;
        this.loginAttemptsMax = LOGIN_ATTEMPS_MAX;
        this.numberOfProjectMax = NUMBER_OF_PROJECT_MAX_DEFAULT_VALUE;
    }

    //--------------------------------------------------------------------------------

    /**
     * Constructor <br>
     * Build the configuration from the given properties
     *
     * @param dataRootPath
     * @param properties
     */
    protected Configuration(String dataRootPath, Properties properties) {

        logger.info("Configuration(String dataRootPath, Properties properties) = " + dataRootPath);

        this.dataRootPath = dataRootPath;
        this.usersFilePath = FileUtil.buildFilePath(dataRootPath, USERS_FILE_NAME);
        this.githubOauthKey = paramValue(properties.getProperty(GITHUB_OAUTH_KEY), GITHUB_OAUTH_KEY_DEFAULT_VALUE);
        this.githubOauthPassword = paramValue(properties.getProperty(GITHUB_OAUTH_PASSWORD), GITHUB_OAUTH_PASSWORD_DEFAULT_VALUE);
        this.mailUsername = paramValue(properties.getProperty(MAIL_USERNAME), MAIL_USERNAME_DEFAULT_VALUE);
        this.mailPassword = paramValue(properties.getProperty(MAIL_PASSWORD), MAIL_PASSWORD_DEFAULT_VALUE);
        this.mailRedirect = paramValue(properties.getProperty(MAIL_REDIRECT), MAIL_REDIRECT_DEFAULT_VALUE);
        this.serverMail = paramValue(properties.getProperty(SERVER_MAIL), SERVER_MAIL_DEFAULT_VALUE);
        this.loginAttemptsMax = paramValue(properties.getProperty(LOGIN_ATTEMPS_MAX), LOGIN_ATTEMPS_MAX_DEFAULT_VALUE);
        this.numberOfProjectMax = paramValue(properties.getProperty(NUMBER_OF_PROJECT_MAX), NUMBER_OF_PROJECT_MAX_DEFAULT_VALUE);
    }

    //--------------------------------------------------------------------------------

    /**
     * Returns the trimmed parameter value or the given default value if null or void
     *
     * @param paramValue
     * @param defaultValue
     * @return
     */
    private String paramValue(String paramValue, String defaultValue) {
        if (paramValue != null) {
            String paramValue2 = paramValue.trim();
            if (paramValue2.length() > 0) {
                return paramValue2;
            }
        }
        return defaultValue;
    }

    //--------------------------------------------------------------------------------
    public String getDataRootPath() {
        return dataRootPath;
    }

    public String getUsersFilePath() {
        return usersFilePath;
    }

    public String getGithubOauthKey() {
        return githubOauthKey;
    }

    public String getGthubOauthPassword() {
        return githubOauthPassword;
    }

    public String getMailUsername() {
        return mailUsername;
    }

    public String getMailPassword() {
        return mailPassword;
    }

    public String getMailRedirect() {
        return mailRedirect;
    }

    public String getServerMail() {
        return serverMail;
    }
    public String getLoginAttemptsMax() {
        return loginAttemptsMax;
    }

    public String getNumberOfProjectMax() {
        return numberOfProjectMax;
    }
}
