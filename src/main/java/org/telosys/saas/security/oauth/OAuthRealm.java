package org.telosys.saas.security.oauth;

import org.apache.oltu.oauth2.common.utils.JSONUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telosys.saas.config.Configuration;
import org.telosys.saas.config.ConfigurationHolder;
import org.telosys.tools.commons.http.HttpClient;
import org.telosys.tools.commons.http.HttpRequest;
import org.telosys.tools.commons.http.HttpResponse;
import org.telosys.tools.users.User;
import org.telosys.tools.users.UserType;
import org.telosys.tools.users.UsersManager;

import java.util.Map;


/**
 * <p>User: Zhang Kaitao
 * <p>Date: 14-2-18
 * <p>Version: 1.0
 */
public class OAuthRealm extends AuthorizingRealm {

    private final Logger logger = LoggerFactory.getLogger(OAuthRealm.class);

    private String clientId;
    private String clientSecret;
    private String accessTokenUrl;
    private String userInfoUrl;
    private String redirectUrl;

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public void setAccessTokenUrl(String accessTokenUrl) {
        this.accessTokenUrl = accessTokenUrl;
    }

    public void setUserInfoUrl(String userInfoUrl) {
        this.userInfoUrl = userInfoUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    private UsersManager usersManager = UsersManager.getInstance();

    private final static String REALM_NAME = "OAuthRealm";

    @Override
    public boolean supports(AuthenticationToken token) {
        return token instanceof OAuthToken;
    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        logger.info("OAuth  doGetAuthorizationInfo(principals)...");
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        return authorizationInfo;
    }

    /**
     *
     * @param token Token sent by github
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        logger.info("OAuth doGetAuthorizationInfo(token)...");

        // For mode information see : https://developer.github.com/v3/oauth/
        // The following code is execute after the github login
        Configuration configuration = ConfigurationHolder.getConfiguration();
        OAuthToken oAuth2Token = (OAuthToken) token;
        String code = oAuth2Token.getAuthCode();
        HttpClient httpClient = new HttpClient();
        HttpResponse httpResponse;
        byte[] responseArray;
        String response = "";
        // Url to get an access_token to github
        String url = "https://github.com/login/oauth/access_token?client_id=" + configuration.getGithubOauthKey()+
                "&client_secret=" + configuration.getGthubOauthPassword() + "&code=" + code + "&scope=user:email";
        HttpRequest httpRequest = new HttpRequest(url);

        try {
            // Get the access_token by posting the first token
            httpResponse = httpClient.post(httpRequest);
            responseArray = httpResponse.getBodyContent();
            if(responseArray != null){
                response = new String(responseArray);
            }
            // Parse the response to find only the access_token
            String[] parseResponse = response.split("&");
            String[] accesTokenArray = parseResponse[0].split("=");
            String accesToken = accesTokenArray[1];
            // Get the user info by using the access_token
            httpRequest = new HttpRequest("https://api.github.com/user?access_token="+ accesToken);
            httpResponse = httpClient.get(httpRequest);
            // INFO : This response is in Json format
            responseArray = httpResponse.getBodyContent();
            if(responseArray != null){
                response = new String(responseArray);
            }
            // Transform the json into a map
            Map<String,Object> map =  JSONUtils.parseJSON(response);
            String userName = (String) map.get("login");
            String password = configuration.getGithubOauthKey();
            User user = usersManager.getUserByLogin(userName);

            // If the user doesn't exist then create one
            if (user == null) {
                user = new User(UserType.GITHUB_USER, userName);
                user.setEncryptedPassword(password);
                usersManager.saveUser(user, user.getEncryptedPassword());
                user = usersManager.getUserByLogin(userName);
            }
            logger.info("doGetAuthenticationInfo(token) : password = " + user.getEncryptedPassword() );

            return new SimpleAuthenticationInfo(user, code, REALM_NAME);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}