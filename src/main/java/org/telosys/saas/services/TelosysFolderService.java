package org.telosys.saas.services;

import java.util.ArrayList;
import java.util.List;

import org.pac4j.core.profile.UserProfile;
import org.telosys.saas.dao.StorageDao;
import org.telosys.saas.dao.StorageDaoProvider;
import org.telosys.saas.domain.File;
import org.telosys.saas.domain.Folder;
import org.telosys.saas.domain.Project;

public class TelosysFolderService {

//	private FileStorageDao storageDao = new FileStorageDao();
	private StorageDao storageDao = StorageDaoProvider.getStorageDao();

	public Folder getTelosysFolder(UserProfile user, Project project) {
		Folder telosysFolder = new Folder();
		telosysFolder.setId("TelosysTools");
		telosysFolder.setName("TelosysTools");
		telosysFolder.setFolderParentId("");
		telosysFolder.setType("telosys");
		
		List<String> filters = new ArrayList<String>();
		Folder originalTelosysFolder = storageDao.getFolderForProjectAndUser(user, project, "TelosysTools", filters);		
		
		// Add Templates
		Folder templatesFolder = null;
		for(Folder folder : originalTelosysFolder.getFolders()) {
			if("templates".equalsIgnoreCase(folder.getName())) {
				templatesFolder = folder;
			}
		}
		if(templatesFolder != null) {
			templatesFolder.setType("bundles");
			telosysFolder.getFolders().add(templatesFolder);
			
			for(Folder folder : templatesFolder.getFolders()) {
				folder.setType("bundle");
			}
		}
		
		// Add Models
		for(Folder folder : originalTelosysFolder.getFolders()) {
			if(folder.getName().indexOf("_model") != -1) {
				telosysFolder.getFolders().add(folder);

				folder.setType("model");
				String name = folder.getName().substring(0,folder.getName().indexOf("_model"));
				folder.setName(name);
				
				for(File file : folder.getFiles()) {
					if(file.getName().indexOf(".entity") != -1) {
						file.setType("entity");
						String entityName = file.getName().substring(0,file.getName().indexOf(".entity"));
						file.setName(entityName);
					}
				}
			}
		}
		
		return telosysFolder;
	}
	
}
