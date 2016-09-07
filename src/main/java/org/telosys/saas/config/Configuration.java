package org.telosys.saas.config;

import java.util.Properties;

import org.telosys.tools.commons.FileUtil;

/**
 * Telosys SaaS Configuration ( SINGLE INSTANCE )
 *
 * @author Laurent Guerin
 */
public class Configuration {

    //--- Files names
    private static final String USERS_FILE_NAME = "users.txt";

    //--- Parameters names
    private static final String GITHUB_OAUTH_KEY = "githubOauthKey";
    private static final String GITHUB_OAUTH_PASSWORD = "githubOauthPassword";
    private static final String GMAIL_USERNAME = "gmailUsername";
    private static final String GMAIL_PASSWORD = "gmailPassword";
    private static final String MAIL_REDIRECT = "mailRedirect";
    private static final String LOGIN_ATTEMPS_MAX = "loginAttemptsMax";
    private static final String NUMBER_OF_PROJECT_MAX = "numberOfProjectMax";


    //--- Default values
    private static final String GITHUB_OAUTH_KEY_DEFAULT_VALUE = null;
    private static final String GITHUB_OAUTH_PASSWORD_DEFAULT_VALUE = null;
    private static final String GMAIL_USERNAME_DEFAULT_VALUE = null;
    private static final String GMAIL_PASSWORD_DEFAULT_VALUE = null;
    private static final String MAIL_REDIRECT_DEFAULT_VALUE = null;
    private static final String LOGIN_ATTEMPS_MAX_DEFAULT_VALUE = null;
    private static final String NUMBER_OF_PROJECT_MAX_DEFAULT_VALUE = null;


    //--- Attributes
    private final String dataRootPath;
    private final String usersFilePath;
    private final String githubOauthKey;
    private final String githubOauthPassword;
    private final String gmailUsername;
    private final String gmailPassword;
    private final String mailRedirect;
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

        this.dataRootPath = dataRootPath;
        this.usersFilePath = FileUtil.buildFilePath(dataRootPath, USERS_FILE_NAME);
        this.githubOauthKey = GITHUB_OAUTH_KEY_DEFAULT_VALUE;
        this.githubOauthPassword = GITHUB_OAUTH_PASSWORD_DEFAULT_VALUE;
        this.gmailUsername = GMAIL_USERNAME_DEFAULT_VALUE;
        this.gmailPassword = GMAIL_PASSWORD_DEFAULT_VALUE;
        this.mailRedirect = MAIL_REDIRECT_DEFAULT_VALUE;
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

        this.dataRootPath = dataRootPath;
        this.usersFilePath = FileUtil.buildFilePath(dataRootPath, USERS_FILE_NAME);
        this.githubOauthKey = paramValue(properties.getProperty(GITHUB_OAUTH_KEY), GITHUB_OAUTH_KEY_DEFAULT_VALUE);
        this.githubOauthPassword = paramValue(properties.getProperty(GITHUB_OAUTH_PASSWORD), GITHUB_OAUTH_PASSWORD_DEFAULT_VALUE);
        this.gmailUsername = paramValue(properties.getProperty(GMAIL_USERNAME), GMAIL_USERNAME_DEFAULT_VALUE);
        this.gmailPassword = paramValue(properties.getProperty(GMAIL_PASSWORD), GMAIL_PASSWORD_DEFAULT_VALUE);
        this.mailRedirect = paramValue(properties.getProperty(MAIL_REDIRECT), MAIL_REDIRECT_DEFAULT_VALUE);
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

    public String getGmailUsername() {
        return gmailUsername;
    }

    public String getGmailPassword() {
        return gmailPassword;
    }

    public String getMailRedirect() {
        return mailRedirect;
    }

    public String getLoginAttemptsMax() {
        return loginAttemptsMax;
    }

    public String getNumberOfProjectMax() {
        return numberOfProjectMax;
    }
}
