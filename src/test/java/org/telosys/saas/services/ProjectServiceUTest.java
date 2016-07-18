package org.telosys.saas.services;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.pac4j.core.profile.UserProfile;
import org.telosys.saas.config.Configuration;
import org.telosys.saas.dao.StorageDao;
import org.telosys.saas.dao.StorageDaoProvider;
import org.telosys.saas.domain.Project;
import org.telosys.tools.api.TelosysProject;
import org.telosys.tools.users.User;

public class ProjectServiceUTest {
	
	private StorageDao storageDao;
	private ProjectService projectService;
	
	@Before
	public void before() {
		this.storageDao = Mockito.mock(StorageDao.class);
		this.projectService = new ProjectService(storageDao);
	}
	
	@Test
	public void testGetTelosysProject() {
		// Given
		UserProfile user = Mockito.mock(UserProfile.class);
		Project project = new Project();
		
		String projectFolderAbsolutePath = "projectFolderAbsolutePath";
		Mockito.when(this.storageDao.getProjectPath(user, project)).thenReturn(projectFolderAbsolutePath);
		
		// When
		TelosysProject telosysProject = projectService.getTelosysProject(user, project);
		
		// Then
		Assert.assertNotNull(telosysProject);
		Assert.assertEquals(projectFolderAbsolutePath, telosysProject.getProjectFolder());
	}

}
