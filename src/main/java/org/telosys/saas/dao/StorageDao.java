package org.telosys.saas.dao;

import java.util.List;

import org.pac4j.core.profile.UserProfile;
import org.telosys.saas.domain.File;
import org.telosys.saas.domain.Folder;
import org.telosys.saas.domain.Project;

public interface StorageDao {

	/**
	 * Get project for user.
	 * @param user
	 * @param projectName
	 * @return
	 */
	Project getProjectForUser(UserProfile user, String projectName);
	
	/**
	 * @param user
	 * @param project
	 * @return
	 */
	String getProjectPath(UserProfile user, Project project);

	/**
	 * Get projects for user.
	 * @param user
	 * @return
	 */
	List<Project> getProjectsForUser(UserProfile user);
	
	/**
	 * Create project for user.
	 * @param user
	 * @param project
	 */
	void createProjectForUser(UserProfile user, Project project);

	/**
	 * Delete project for user.
	 * @param user
	 * @param project
	 */
	void deleteProjectForUser(UserProfile user, Project project);
	
	/**
	 * Get files for the project of the user with filtering.
	 * @param user
	 * @param project
	 * @param filters
	 * @return
	 */
	Folder getFilesForProjectAndUser(UserProfile user, Project project, List<String> filters);

	/**
	 * Get folder for the project of the user.
	 * @param user
	 * @param project
	 * @param folderId
	 * @param filters
	 * @return
	 */
	Folder getFolderForProjectAndUser(UserProfile user, Project project, String folderId, List<String> filters);
	
	/**
	 * Get file for the project of the user.
	 * @param user
	 * @param project
	 * @param fileId
	 * @return
	 */
	File getFileForProjectAndUser(UserProfile user, Project project, String fileId);
	
	/**
	 * Create file in the folder for the project of the user.
	 * @param user
	 * @param project
	 * @param file
	 */
	void createFileForProjectAndUser(UserProfile user, Project project, File file);

	/**
	 * Create folder in the folder for the project of the user.
	 * @param user
	 * @param project
	 * @param folderSub
	 */
	void createFolderForProjectAndUser(UserProfile user, Project project, Folder folderSub);

	/**
	 * Save the file for the project of the user.
	 * @param user
	 * @param project
	 * @param fileToSave
	 */
	void saveFileForProjectAndUser(UserProfile user, Project project, File fileToSave);

	/**
	 * Save the folder for the project of the user.
	 * @param user
	 * @param project
	 * @param folderToSave
	 */
	void saveFolderForProjectAndUser(UserProfile user, Project project, Folder folderToSave);

	/**
	 * Delete file for the project of the user.
	 * @param user
	 * @param project
	 * @param fileToDelete
	 */
	void deleteFileForProjectAndUser(UserProfile user, Project project, File fileToDelete);

	/**
	 * Delete folder for the project of the user.
	 * @param user
	 * @param project
	 * @param folderToDelete
	 */
	void deleteFolderForProjectAndUser(UserProfile user, Project project, Folder folderToDelete);

	/**
	 * Get ZIP file to download source code project
	 * @param user
	 * @param project
	 * @return
	 */
	java.io.File getFileZipToDownload(UserProfile user, Project project);
	
}
