package org.telosys.saas.dao;

import java.io.FileFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.commons.io.FileDeleteStrategy;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.pac4j.core.profile.UserProfile;
import org.telosys.saas.config.Configuration;
import org.telosys.saas.config.ConfigurationHolder;
import org.telosys.saas.domain.File;
import org.telosys.saas.domain.Folder;
import org.telosys.saas.domain.Project;
import org.telosys.saas.util.FileUtil;
import org.telosys.saas.util.Zip;

public class FileStorageDao implements StorageDao {

	private final Configuration configuration ;
	
	protected FileStorageDao() {
		configuration = ConfigurationHolder.getConfiguration();
	}

	FileStorageDao(Configuration configuration) {
		this.configuration = configuration;
	}
	
	private String getRootPath() {
		return configuration.getDataRootPath();
	}

//	private java.io.File getRootDir() {
//		return getIOFile(getRootPath());
//	}

	private String getUserPath(UserProfile user) {
		String userPath = FileUtil.join(getRootPath(), user.getId());
		java.io.File dir = new java.io.File(userPath);
		dir.mkdirs();
		return userPath;
	}

	private java.io.File getUserDir(UserProfile user) {
		String path = getUserPath(user);
		return getIOFile(path);
	}

	@Override
	public String getProjectPath(UserProfile user, Project project) {
		return FileUtil.join(getRootPath(), user.getId(), project.getId());
	}

	private java.io.File getProjectDir(UserProfile user, Project project) {
		String path = getProjectPath(user, project);
		return getIOFile(path);
	}

	private Project getProjectForDirectory(UserProfile user, java.io.File fileIO) {
		Project project = new Project();
		project.setId(fileIO.getName());
		project.setName(fileIO.getName());
		return project;
	}

	@Override
	public Project getProjectForUser(UserProfile user, String projectId) {
		Project project = new Project();
		project.setId(projectId);

		java.io.File projectDir = getProjectDir(user, project);
		if (!projectDir.exists()) {
			return null;
		}

		return getProjectForDirectory(user, projectDir);
	}

	@Override
	public List<Project> getProjectsForUser(UserProfile user) {
		java.io.File userDir = getUserDir(user);

		List<Project> projects = new ArrayList<Project>();

		FileFilter fileFilter = FileFilterUtils.directoryFileFilter();
		java.io.File[] directories = userDir.listFiles(fileFilter);
		if (directories != null) {
			for (java.io.File file : directories) {
				Project project = getProjectForDirectory(user, file);
				projects.add(project);
			}
		}

		return projects;
	}

	@Override
	public void createProjectForUser(UserProfile user, Project project) {
		java.io.File projectDir = getProjectDir(user, project);
		if (!projectDir.exists()) {
			projectDir.mkdirs();
		}
	}

	@Override
	public void deleteProjectForUser(UserProfile user, Project project) {
		java.io.File projectDir = getProjectDir(user, project);
		if (projectDir.exists()) {
			projectDir.delete();
		}

	}

	@Override
	public Folder getFilesForProjectAndUser(UserProfile user, Project project, List<String> filters) {
		java.io.File projectDir = getProjectDir(user, project);
		if (!projectDir.exists()) {
			throw new IllegalStateException("Project directory does not exist : " + projectDir.getPath());
		}
		return getRootFolderForProjectDir(projectDir, filters);
	}

	private Folder getRootFolderForProjectDir(java.io.File projectDir, List<String> filters) {
		Folder folder = new Folder();
		folder.setId("");
		folder.setName(projectDir.getName());
		folder.setFolderParentId("");

		folder.getFolders().addAll(getFoldersFromDirectory(projectDir, "", filters));
		folder.getFiles().addAll(getFilesFromDirectory(projectDir, "", filters));

		return folder;
	}

	private Folder getFolderForDir(java.io.File folderDir, String relativePath, List<String> filters) {
		String folderRelativePath = FileUtil.join(relativePath, folderDir.getName());
		Folder folder = new Folder();
		folder.setId(folderRelativePath);
		folder.setName(folderDir.getName());
		folder.setFolderParentId(relativePath);
		folder.setExisting(folderDir.exists());
		
		if(folderDir.exists()) {
			folder.getFolders().addAll(getFoldersFromDirectory(folderDir, folderRelativePath, filters));
			folder.getFiles().addAll(getFilesFromDirectory(folderDir, folderRelativePath, filters));
		}

		return folder;
	}

	private List<Folder> getFoldersFromDirectory(java.io.File directory, String relativePath, List<String> filters) {
		List<Folder> folders = new ArrayList<>();
		FileFilter directoryFilter = FileFilterUtils.directoryFileFilter();
		for (java.io.File file : directory.listFiles(directoryFilter)) {
			Folder folderSub = getFolderForDir(file, relativePath, filters);
			if(!filters.contains(folderSub.getId())) {
				folders.add(folderSub);
			}
		}
		return folders;
	}

	private List<File> getFilesFromDirectory(java.io.File directory, String relativePath, List<String> filters) {
		List<File> files = new ArrayList<>();
		FileFilter fileFilter = FileFilterUtils.fileFileFilter();
		for (java.io.File file : directory.listFiles(fileFilter)) {
			File fileSub = getFile(file, relativePath);
			if(!filters.contains(fileSub.getId())) {
				files.add(fileSub);
			}
		}
		return files;
	}

	private File getFile(java.io.File fileIO, String relativePath) {
		String fileRelativePath = FileUtil.join(relativePath, fileIO.getName());
		File file = new File();
		file.setId(fileRelativePath);
		file.setName(fileIO.getName());
		file.setFolderParentId(relativePath);
		file.setExisting(fileIO.exists());
		return file;
	}

	@Override
	public Folder getFolderForProjectAndUser(UserProfile user, Project project, String folderId, List<String> filters) {
		String projectPath = getProjectPath(user, project);
		String filePath = FileUtil.join(projectPath, folderId);
		String relativePath = FileUtil.dirname(folderId);
		java.io.File fileIO = getIOFile(filePath);
		Folder folder = getFolderForDir(fileIO, relativePath, filters);
		return folder;
	}

	@Override
	public File getFileForProjectAndUser(UserProfile user, Project project, String fileId) {
		String projectPath = getProjectPath(user, project);
		String filePath = FileUtil.join(projectPath, fileId);
		String relativePath = FileUtil.dirname(fileId);
		java.io.File fileIO = getIOFile(filePath);
		File file = getFile(fileIO, relativePath);
		
		if(fileIO.exists()) {
			try {
				file.setContent(FileUtil.readFile(filePath));
			} catch (IOException e) {
				throw new IllegalStateException(e);
			}
		}
	
		return file;
	}

	@Override
	public void createFileForProjectAndUser(UserProfile user, Project project, File file) {
		saveFileForProjectAndUser(user, project, file);
	}

	@Override
	public void createFolderForProjectAndUser(UserProfile user, Project project, Folder folderSub) {
		String projectPath = getProjectPath(user, project);
		String filePath = FileUtil.join(projectPath, folderSub.getId());
		java.io.File fileIO = getIOFile(filePath);
		fileIO.mkdirs();
	}

	@Override
	public void saveFileForProjectAndUser(UserProfile user, Project project, File fileToSave) {
		String projectPath = getProjectPath(user, project);
		String filePath = FileUtil.join(projectPath, fileToSave.getId());
		try {
			FileUtil.writeFile(filePath, fileToSave.getContent());
		} catch (IOException e) {
			throw new IllegalStateException(e);
		}
	}

	@Override
	public void saveFolderForProjectAndUser(UserProfile user, Project project, Folder folderToSave) {

	}

	@Override
	public void deleteFileForProjectAndUser(UserProfile user, Project project, File fileToDelete) {
		String projectPath = getProjectPath(user, project);
		String filePath = FileUtil.join(projectPath, fileToDelete.getId());
		java.io.File fileIO = getIOFile(filePath);
		try {
			delete(fileIO);
		} catch(IOException e) {
			throw new IllegalStateException(e);
		}
	}

	@Override
	public void deleteFolderForProjectAndUser(UserProfile user, Project project, Folder folderToDelete) {
		String projectPath = getProjectPath(user, project);
		String filePath = FileUtil.join(projectPath, folderToDelete.getId());
		java.io.File fileIO = getIOFile(filePath);
		try {
			delete(fileIO);
		} catch(IOException e) {
			throw new IllegalStateException(e);
		}
	}

	private void delete(java.io.File file) throws IOException {
		if (file.isDirectory()) {
			// directory is empty, then delete it
			if (file.list().length == 0) {
				forceDelete(file);
				System.out.println("Directory is deleted : " + file.getAbsolutePath());
			} else {
				// list all the directory contents
				String files[] = file.list();
				for (String temp : files) {
					// construct the file structure
					java.io.File fileDelete = new java.io.File(file, temp);
					// recursive delete
					delete(fileDelete);
				}
				// check the directory again, if empty then delete it
				if (file.list().length == 0) {
					forceDelete(file);
					System.out.println("Directory is deleted : " + file.getAbsolutePath());
				}
			}
		} else {
			// if file, then delete it
			forceDelete(file);
			System.out.println("File is deleted : " + file.getAbsolutePath());
		}
	}
	
	private void forceDelete(java.io.File fileIO) {
		fileIO.setWritable(true);
		if(!fileIO.delete()) {
			try {
				FileDeleteStrategy.FORCE.delete(fileIO);
			} catch (IOException e) {
				if(fileIO.isDirectory()) {
					throw new IllegalStateException("Folder can not be deleted : " + fileIO.getPath());
				} else {
					throw new IllegalStateException("File can not be deleted : " + fileIO.getPath());
				}
			}
		}
	}

	@Override
	public java.io.File getFileZipToDownload(UserProfile user, Project project) {
		String input = getProjectPath(user, project);
		String output = FileUtil.join(System.getProperty("java.io.tmpdir"),project.getId()+"_"+UUID.randomUUID().toString());
		// Create ZIP file in temporary directory
		//Zip zip = new Zip(input, output);
		//zip.zip();
		Zip zip = new Zip();
		zip.zip(input, output);
		// Return File on this ZIP
		return getIOFile(output);
	}
	
	protected java.io.File getIOFile(String path) {
		try {
			String pathFormatted = FileUtil.convertPathToIOPath(path);
			return new java.io.File(pathFormatted);
		} catch(Exception e) {
			throw new IllegalStateException(e);
		}
	}

}
