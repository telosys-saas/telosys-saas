package org.telosys.saas.dao.file;


import org.junit.BeforeClass;
import org.junit.Test;
import org.telosys.saas.dao.StorageDao;
import org.telosys.saas.dao.StorageDaoProvider;
import org.telosys.saas.domain.File;
import org.telosys.saas.domain.Folder;
import org.telosys.saas.domain.Project;

import junit.tests.env.TestsEnv;
import org.telosys.tools.users.User;
import org.telosys.tools.users.UserType;

public class FileStorageDaoTest {
	
	@BeforeClass
	public static void init() {
		TestsEnv.initExternalConfiguration();
	}
	
	@Test
	public void createSaveDelete() {
		
		//FileStorageDao fs = new FileStorageDao();		
		StorageDao fs = StorageDaoProvider.getStorageDao();
		
		// User
		User user = new User(UserType.TELOSYS_USER, "user1");
		// Project
		Project project = new Project();
		project.setId("project_test");
		// Folder
		Folder folder = new Folder();
		folder.setId("folder1");
		// File
		File file = new File();
		file.setId("folder1/test.txt");
		file.setContent("Test1");
		
		// Create project, folder and file
		fs.createProjectForUser(user, project);
		fs.createFolderForProjectAndUser(user, project, folder);
		fs.createFileForProjectAndUser(user, project, file);
		
		// Update file
		file.setContent("Test2");
		fs.saveFileForProjectAndUser(user, project, file);
		
		// Delete file, folder and project
		fs.deleteFileForProjectAndUser(user, project, file);
		fs.deleteFolderForProjectAndUser(user, project, folder);
		fs.deleteProjectForUser(user, project);
	}
	
}
