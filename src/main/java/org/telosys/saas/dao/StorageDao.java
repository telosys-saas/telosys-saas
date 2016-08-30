package org.telosys.saas.dao;

import java.util.List;

import org.telosys.saas.domain.File;
import org.telosys.saas.domain.Folder;
import org.telosys.saas.domain.Project;
import org.telosys.tools.users.User;

public interface StorageDao {

	/**
	 * Get project for user.
	 * @param user
	 * @param projectName
	 * @return
	 */
	Project getProjectForUser(User user, String projectName);
	
	/**
	 * @param user
	 * @param project
	 * @return
	 */
	String getProjectPath(User user, Project project);

	/**
	 * Get projects for user.
	 * @param user
	 * @return
	 */
	List<Project> getProjectsForUser(User user);
	
	/**
	 * Create project for user.
	 * @param user
	 * @param project
	 */
	void createProjectForUser(User user, Project project);

	/**
	 * Delete project for user.
	 * @param user
	 * @param project
	 */
	void deleteProjectForUser(User user, Project project);
	
	/**
	 * Get files for the project of the user with filtering.
	 * @param user
	 * @param project
	 * @param filters
	 * @return
	 */
	Folder getFilesForProjectAndUser(User user, Project project, List<String> filters);

	/**
	 * Get folder for the project of the user.
	 * @param user
	 * @param project
	 * @param folderId
	 * @param filters
	 * @return
	 */
	Folder getFolderForProjectAndUser(User user, Project project, String folderId, List<String> filters);
	
	/**
	 * Get file for the project of the user.
	 * @param user
	 * @param project
	 * @param fileId
	 * @return
	 */
	File getFileForProjectAndUser(User user, Project project, String fileId);
	
	/**
	 * Create file in the folder for the project of the user.
	 * @param user
	 * @param project
	 * @param file
	 */
	void createFileForProjectAndUser(User user, Project project, File file);

	/**
	 * Create folder in the folder for the project of the user.
	 * @param user
	 * @param project
	 * @param folderSub
	 */
	void createFolderForProjectAndUser(User user, Project project, Folder folderSub);

	/**
	 * Save the file for the project of the user.
	 * @param user
	 * @param project
	 * @param fileToSave
	 */
	void saveFileForProjectAndUser(User user, Project project, File fileToSave);

	/**
	 * Save the folder for the project of the user.
	 * @param user
	 * @param project
	 * @param folderToSave
	 */
	void saveFolderForProjectAndUser(User user, Project project, Folder folderToSave);

	/**
	 * Delete file for the project of the user.
	 * @param user
	 * @param project
	 * @param fileToDelete
	 */
	void deleteFileForProjectAndUser(User user, Project project, File fileToDelete);

	/**
	 * Delete folder for the project of the user.
	 * @param user
	 * @param project
	 * @param folderToDelete
	 */
	void deleteFolderForProjectAndUser(User user, Project project, Folder folderToDelete);

	/**
	 * Get ZIP file to download source code project
	 * @param user
	 * @param project
	 * @return
	 */
	java.io.File getFileZipToDownload(User user, Project project);
	
}
