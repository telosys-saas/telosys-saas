package org.telosys.saas.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GithubManager {
	
	private static final GithubManager instance = new GithubManager();
	
	private GithubManager() {}
	
	public static GithubManager getInstance() {
		return instance;
	}
	
	private Map<String, List<String>> bundlesByGithubUser = new HashMap<>();
	
	public List<String> getBundlesForGithubUser(String githubUser) {
		return bundlesByGithubUser.get(githubUser);
	}
	
	public void addBundlesForGithubUser(String githubUser, List<String> bundles) {
		bundlesByGithubUser.put(githubUser, bundles);
	}
	
}
