package org.telosys.saas.rest;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.telosys.saas.dao.StorageDao;
import org.telosys.saas.dao.StorageDaoProvider;
import org.telosys.saas.domain.*;
import org.telosys.saas.security.Security;
import org.telosys.saas.services.BundleService;
import org.telosys.saas.services.ProjectService;
import org.telosys.saas.services.TelosysFolderService;
import org.telosys.tools.users.User;

@Path("/users/{userId}/projects/{projectId}")
public class ProjectResource {

    // private StorageDao storage = new MockStorageDao();
//	private StorageDao storage = new FileStorageDao();
    private StorageDao storage = StorageDaoProvider.getStorageDao();

    private BundleService bundleService = new BundleService();
    private ProjectService projectService = new ProjectService();
    private TelosysFolderService telosysFolderService = new TelosysFolderService();
    @Context
    private HttpServletRequest request;
    @Context
    private HttpServletResponse response;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Project getProject(@PathParam("userId") String userId, @PathParam("projectId") String projectId) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        return project;
    }

    @GET
    @Path("/zip")
    @Produces("application/zip")
    public Response downloadZipProject(@PathParam("userId") String userId, @PathParam("projectId") String projectId) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        java.io.File file = storage.getFileZipToDownload(user, project);
        return Response.ok(file).header("Content-Disposition", "attachment; filename=\"" + projectId + ".zip\"").build();
    }

    @GET
    @Path("/configuration")
    @Produces(MediaType.APPLICATION_JSON)
    public ProjectConfiguration getProjectConfiguration(@PathParam("userId") String userId, @PathParam("projectId") String projectId) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        ProjectConfiguration projectConfiguration = projectService.getProjectConfiguration(user, project);
        return projectConfiguration;
    }

    @PUT
    @Path("/configuration")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public ProjectConfiguration saveProjectConfiguration(@PathParam("userId") String userId, @PathParam("projectId") String projectId, ProjectConfiguration projectConfiguration) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        projectService.saveProjectConfiguration(user, project, projectConfiguration);
        return projectConfiguration;
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Project saveProject(@PathParam("userId") String userId, @PathParam("projectId") String projectId, Project project) {
        User user = Security.getUser();
        Project projectExisting = storage.getProjectForUser(user, project.getId());
        if (projectExisting == null) {
            // Create
            storage.createProjectForUser(user, project);
            // Init
            projectService.initProject(user, project);
            return project;
        }
        return project;
    }

    @Path("/bundles")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Bundle> getBundlesOfProject(@PathParam("userId") String userId, @PathParam("projectId") String projectId) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        return bundleService.getBundlesOfProject(user, project);
    }

    @Path("/bundles/{githubUserName}/{bundleName}")
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    public void addBundleToTheProject(@PathParam("userId") String userId, @PathParam("projectId") String projectId, @PathParam("githubUserName") String githubUserName, @PathParam("bundleName") String bundleName) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        projectService.addBundleToTheProject(user, project, githubUserName, bundleName);
    }

    @Path("/bundles/{bundleName}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public void removeBundleFromTheProject(@PathParam("userId") String userId, @PathParam("projectId") String projectId, @PathParam("bundleName") String bundleName) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        projectService.removeBundleFromTheProject(user, project, bundleName);
    }

    @Path("/templates/{bundleName}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getTemplatesForGeneration(@PathParam("userId") String userId, @PathParam("projectId") String projectId, @PathParam("bundleName") String bundleName){
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        List<Template> templateList = projectService.getTemplatesForGeneration(user, project, bundleName);
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        String json = null;
        try {
            json = ow.writeValueAsString(templateList);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(e);
        }
        return json;
    }

    /**
     * Get root folder with all sub folders and all files of the project of the authenticated user
     *
     * @param projectId Project id
     * @return Root folder
     */
    @Path("/workspace")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Folder getWorkspace(@PathParam("userId") String userId, @PathParam("projectId") String projectId) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        List<String> filters = new ArrayList<>();
        filters.add("TelosysTools");
        filters.add("telosys-tools.cfg");
        return storage.getFilesForProjectAndUser(user, project, filters);
    }

    /**
     * Get Telosys folder with all sub folders and all files of the project of the authenticated user
     *
     * @param projectId Project id
     * @return Root folder
     */
    @Path("/telosys")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Folder getTelosysFolder(@PathParam("userId") String userId, @PathParam("projectId") String projectId) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        return telosysFolderService.getTelosysFolder(user, project);
    }

    @Path("/folders")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Folder saveFolder(@PathParam("userId") String userId, @PathParam("projectId") String projectId, @QueryParam("folderId") String folderId, Folder folderToSave) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        List<String> filters = new ArrayList<>();
        Folder folder = storage.getFolderForProjectAndUser(user, project, folderId, filters);
        if (!folder.isExisting()) {
            // Create
            storage.createFolderForProjectAndUser(user, project, folderToSave);
        } else {
            // Update
            storage.saveFolderForProjectAndUser(user, project, folderToSave);
        }
        return folderToSave;
    }

    @Path("/createFolder")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Folder createFolder(@PathParam("userId") String userId, @PathParam("projectId") String projectId, @QueryParam("folderId") String folderId, Folder folderToSave) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        List<String> filters = new ArrayList<>();
        Folder folder = storage.getFolderForProjectAndUser(user, project, folderId, filters);
        if (!folder.isExisting()) {
            // Create
            storage.createFolderForProjectAndUser(user, project, folderToSave);
        } else {
            folderToSave.setExisting(true);
        }
        return folderToSave;
    }


    @Path("/folders")
    @DELETE
    public void deleteFolder(@PathParam("userId") String userId, @PathParam("projectId") String projectId, @QueryParam("folderId") String folderId) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        List<String> filters = new ArrayList<>();
        Folder folder = storage.getFolderForProjectAndUser(user, project, folderId, filters);
        if (!folder.isExisting()) {
            throw new IllegalStateException("Folder does not exists : " + folderId);
        }
        storage.deleteFolderForProjectAndUser(user, project, folder);
    }

    @Path("/files")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public File getFile(@PathParam("userId") String userId, @PathParam("projectId") String projectId, @QueryParam("fileId") String fileId) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        return storage.getFileForProjectAndUser(user, project, fileId);
    }

    @Path("/files")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public File saveFile(@PathParam("userId") String userId, @PathParam("projectId") String projectId, @QueryParam("fileId") String fileId, File fileToSave) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        File file = storage.getFileForProjectAndUser(user, project, fileId);
        if (!file.isExisting()) {
            // Create
            storage.createFileForProjectAndUser(user, project, fileToSave);
        } else {
            // Update
            storage.saveFileForProjectAndUser(user, project, fileToSave);
        }
        return fileToSave;
    }

    @Path("/createFile")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public File createFile(@PathParam("userId") String userId, @PathParam("projectId") String projectId, @QueryParam("fileId") String fileId, File fileToSave) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        File file = storage.getFileForProjectAndUser(user, project, fileId);
        if (!file.isExisting()) {
            // Create
            storage.createFileForProjectAndUser(user, project, fileToSave);
        } else {
            fileToSave.setExisting(true);
        }
        return fileToSave;
    }

    @Path("/files")
    @DELETE
    public void deleteFile(@PathParam("userId") String userId, @PathParam("projectId") String projectId, @QueryParam("fileId") String fileId) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        File file = storage.getFileForProjectAndUser(user, project, fileId);
        if (file == null) {
            throw new IllegalStateException("File does not exists : " + fileId);
        }
        storage.deleteFileForProjectAndUser(user, project, file);
    }

    /*
    @Path("/models")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public ModelNames getModels(@PathParam("userId") String userId, @PathParam("projectId") String projectId) {
    	User user = Security.getUser(); 
    	Project project = storage.getProjectForUser(user, projectId);
    	List<String> names = projectService.getModelNames(user, project);
    	ModelNames modelNames = new ModelNames();
    	modelNames.setNames(names);
    	return modelNames;
    }*/

    @Path("/models")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Model> getModels(@PathParam("userId") String userId, @PathParam("projectId") String projectId) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        return projectService.getModels(user, project);
    }

    @Path("/models/{modelName}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Model getModel(@PathParam("userId") String userId, @PathParam("projectId") String projectId, @PathParam("modelName") String modelName) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        return projectService.getModel(user, project, modelName);
    }

    @Path("/models/{modelName}")
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    public Model saveModel(@PathParam("userId") String userId, @PathParam("projectId") String projectId, @PathParam("modelName") String modelName) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        return projectService.createModel(user, project, modelName);
    }

    @Path("/models/{modelName}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public void deleteModel(@PathParam("userId") String userId, @PathParam("projectId") String projectId, @PathParam("modelName") String modelName) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        projectService.deleteModel(user, project, modelName);
    }

    @Path("/models/{modelName}/entities/{entityName}")
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    public void createEntity(@PathParam("userId") String userId, @PathParam("projectId") String projectId, @PathParam("modelName") String modelName, @PathParam("entityName") String entityName) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        projectService.createEntityForModel(user, project, modelName, entityName);
    }

    @Path("/action/generate")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public GenerationResult launchGeneration(@PathParam("userId") String userId, @PathParam("projectId") String projectId, Generation generation) {
        User user = Security.getUser();
        Project project = storage.getProjectForUser(user, projectId);
        return projectService.launchGeneration(user, project, generation);
    }

}
