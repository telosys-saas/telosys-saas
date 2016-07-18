package org.telosys.saas.services;

import java.util.ArrayList;
import java.util.List;

import org.pac4j.core.profile.UserProfile;
import org.telosys.saas.dao.StorageDao;
import org.telosys.saas.dao.StorageDaoProvider;
import org.telosys.saas.domain.Bundle;
import org.telosys.saas.domain.Folder;
import org.telosys.saas.domain.Project;
import org.telosys.saas.util.FileUtil;
import org.telosys.tools.api.TelosysProject;
import org.telosys.tools.commons.TelosysToolsException;

public class BundleService {
	
//	private StorageDao storage = new FileStorageDao();
	private StorageDao storage = StorageDaoProvider.getStorageDao();

	private GithubManager githubManager = GithubManager.getInstance();

	public List<Bundle> getBundlesForGithubUser(String githubUser) {
		if(githubUser == null) {
			githubUser = "telosys-tools";
		}
		
		List<String> bundleNames = githubManager.getBundlesForGithubUser(githubUser);
		if(bundleNames == null) {
			bundleNames = getBundlesInRepository(githubUser);
			githubManager.addBundlesForGithubUser(githubUser, bundleNames);
		}
		
		List<Bundle> bundles = new ArrayList<Bundle>();
		for(String bundleName : bundleNames) {
			bundles.add(getBundle(bundleName));
		}
		return bundles;
	}
	
	protected List<String> getBundlesInRepository(String githubUser) {
		try {
			TelosysProject telosysProject = new TelosysProject("");
			List<String> bundleNames = telosysProject.getBundlesList("telosys-tools");
			return bundleNames;
		} catch (TelosysToolsException e) {
			throw new IllegalStateException(e);
		}
	}
	
	public List<Bundle> getBundlesOfProject(UserProfile user, Project project) {
		String folderTemplatesPath = FileUtil.join("TelosysTools","templates");
    	List<String> filters = new ArrayList<>();
    	Folder folderTemplates = storage.getFolderForProjectAndUser(user, project, folderTemplatesPath, filters);
    	List<Bundle> bundles = new ArrayList<Bundle>();
    	for(Folder folder : folderTemplates.getFolders()) {
    		bundles.add(getBundle(folder.getName()));
    	}
    	return bundles;
	}
	
	public Bundle getBundle(String bundleName) {
		Bundle bundle = new Bundle();
		bundle.setName(bundleName);
		
		String description = convertNameToDescription(bundleName);
		bundle.setDescription(description);
		
		return bundle;
	}
	
	private String convertNameToDescription(String name) {
		
		if(name.indexOf("-TT") != -1) {
			name = name.substring(0, name.indexOf("-TT"));
		}
		
		boolean isFirst = true;
		boolean isLastSeparator = false;
		StringBuffer description = new StringBuffer();
		for(char nameChar : name.toCharArray()) {
			if(nameChar == '-') {
				isLastSeparator = true;
				description.append(' ');
			} else {
				if(isFirst) {
					isFirst = false;
					isLastSeparator = false;
					description.append(String.valueOf(nameChar).toUpperCase());
				}
				else if(isLastSeparator) {
					isLastSeparator = false;
					description.append(String.valueOf(nameChar).toUpperCase());
				} else {
					description.append(nameChar);
				}
			}
		}
		return description.toString();
	}
	
}
