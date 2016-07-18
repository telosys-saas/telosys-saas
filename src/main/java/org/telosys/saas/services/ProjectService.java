package org.telosys.saas.services;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.pac4j.core.profile.UserProfile;
import org.telosys.saas.dao.StorageDao;
import org.telosys.saas.dao.StorageDaoProvider;
import org.telosys.saas.domain.Entity;
import org.telosys.saas.domain.File;
import org.telosys.saas.domain.Folder;
import org.telosys.saas.domain.Generation;
import org.telosys.saas.domain.GenerationErrorResult;
import org.telosys.saas.domain.GenerationResult;
import org.telosys.saas.domain.Model;
import org.telosys.saas.domain.ParsingError;
import org.telosys.saas.domain.Project;
import org.telosys.saas.domain.ProjectConfiguration;
import org.telosys.saas.domain.ProjectConfigurationVariables;
import org.telosys.saas.util.FileUtil;
import org.telosys.tools.api.GenericModelLoader;
import org.telosys.tools.api.TelosysProject;
import org.telosys.tools.commons.TelosysToolsException;
import org.telosys.tools.commons.cfg.TelosysToolsCfg;
import org.telosys.tools.commons.variables.Variable;
import org.telosys.tools.dsl.DslModelUtil;
import org.telosys.tools.generator.GeneratorException;
import org.telosys.tools.generator.task.ErrorReport;
import org.telosys.tools.generator.task.GenerationTaskResult;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ProjectService {
	
//	private FileStorageDao storageDao = new FileStorageDao();
	private final StorageDao storageDao;

	public ProjectService() {
		this.storageDao = StorageDaoProvider.getStorageDao();
	}
	
	ProjectService(StorageDao storageDao) {
		this.storageDao = storageDao;
	}
	
	public TelosysProject getTelosysProject(UserProfile user, Project project) {
		String projectFolderAbsolutePath = storageDao.getProjectPath(user, project);
		TelosysProject telosysProject = new TelosysProject(projectFolderAbsolutePath);
		return telosysProject;
	}
	
	public void initProject(UserProfile user, Project project) {
		TelosysProject telosysProject = getTelosysProject(user, project);
		telosysProject.initProject();
	}

	public List<Model> getModels(UserProfile user, Project project) {
		List<Model> models = new ArrayList<Model>();
		for(String modelName : getModelNames(user, project)) {
			Model model = getModel(user, project, modelName);
			if(model != null) {
				models.add(model);
			}
		}
		return models;
	}

	public List<String> getModelNames(UserProfile user, Project project) {
    	List<String> filters = new ArrayList<>();
		Folder folder = storageDao.getFolderForProjectAndUser(user, project, "TelosysTools", filters);
		List<String> modelNames = new ArrayList<>();
		for(File file : folder.getFiles()) {
			if(file.getName().indexOf(".model") != -1) {
				modelNames.add(file.getName().substring(0, file.getName().indexOf(".model")));
			}
		}
		return modelNames;
	}

	public String getModelPath(UserProfile user, Project project, String modelName) {
		return FileUtil.join(storageDao.getProjectPath(user, project), "TelosysTools", modelName);
	}

	public Model getModel(UserProfile user, Project project, String modelName) {
		TelosysProject telosysProject = getTelosysProject(user, project);
		try {
			GenericModelLoader genericModelLoader = telosysProject.getGenericModelLoader() ;
			org.telosys.tools.generic.model.Model genericModel = genericModelLoader.loadModel(modelName+".model");
			Model model;
			if(genericModel == null) {
				model = new Model();
				model.setName(modelName);
			} else {
				model = map(telosysProject.loadModel(modelName+".model"), modelName);
			}
			if(genericModelLoader.getParsingErrors() != null && !genericModelLoader.getParsingErrors().isEmpty()) {
				Enumeration<String> keyEnumeration = genericModelLoader.getParsingErrors().keys();
				while(keyEnumeration.hasMoreElements()) {
					String file = keyEnumeration.nextElement();
					String message = genericModelLoader.getParsingErrors().get(file);
					String entityName = file;
					if(file.indexOf(".entity") != -1) {
					  entityName = file.substring(0, file.indexOf(".entity"));
					}
					ParsingError parsingError = new ParsingError();
					parsingError.setEntityName(entityName);
					parsingError.setMessage(message);
					model.getParsingErrors().add(parsingError);
				}
			}
			return model;
		} catch (TelosysToolsException e) {
			throw new IllegalStateException(e);
		}
	}

	public Model createModel(UserProfile user, Project project, String modelName) {
		TelosysProject telosysProject = getTelosysProject(user, project);
		try {
			java.io.File file = telosysProject.getDslModelFile(modelName);
			if(!file.exists()) {
				file = telosysProject.createNewDslModel(modelName);
			}
			return map(telosysProject.loadModel(modelName+".model"), modelName);
		} catch (TelosysToolsException e) {
			throw new IllegalStateException(e);
		}
	}

	public void deleteModel(UserProfile user, Project project, String modelName) {
		TelosysProject telosysProject = getTelosysProject(user, project);
		try {
			java.io.File file = telosysProject.getDslModelFile(modelName);
			if(file.exists()) {
				telosysProject.deleteDslModel(modelName);
			}
		} catch (TelosysToolsException e) {
			throw new IllegalStateException(e);
		}
	}

	private Model map(org.telosys.tools.generic.model.Model genericModel, String modelName) {
		Model model = new Model();
		model.setModelName(modelName);
		model.setName(genericModel.getName());
		model.setType(genericModel.getType());
		model.setVersion(genericModel.getVersion());
		model.setDescription(genericModel.getDescription());
		model.setDatabaseId(genericModel.getDatabaseId());
		model.setDatabaseProductName(genericModel.getDatabaseProductName());
		List<Entity> entities = new ArrayList<Entity>();
		for(org.telosys.tools.generic.model.Entity genericEntity : genericModel.getEntities()) {
			entities.add(map(genericEntity));
		}
		model.setEntities(entities);
		return model;
	}

	private Entity map(org.telosys.tools.generic.model.Entity genericEntity) {
		Entity entity = new Entity();
		entity.setFullName(genericEntity.getFullName());
		return entity;
	}

	public void addBundleToTheProject(UserProfile user, Project project, String bundleName) {
		TelosysProject telosysProject = getTelosysProject(user, project);
		try {
			telosysProject.downloadAndInstallBundle("telosys-tools", bundleName);
		} catch (TelosysToolsException e) {
			throw new IllegalStateException(e);
		}
	}

	public void removeBundleFromTheProject(UserProfile user, Project project, String bundleName) {
		String folderTemplatesPath = FileUtil.join("TelosysTools","templates",bundleName);
    	List<String> filters = new ArrayList<>();
    	Folder folderBundle = storageDao.getFolderForProjectAndUser(user, project, folderTemplatesPath, filters);
    	storageDao.deleteFolderForProjectAndUser(user, project, folderBundle);
	}

	public ProjectConfiguration getProjectConfiguration(UserProfile user, Project project) {
		try {
			TelosysProject telosysProject = getTelosysProject(user, project);
			TelosysToolsCfg telosysToolsCfg = telosysProject.loadTelosysToolsCfg();
		
			ProjectConfiguration projectConfiguration = new ProjectConfiguration();
			ProjectConfigurationVariables projectVariables = projectConfiguration.getVariables();
			
			projectVariables.setSRC(telosysToolsCfg.getSRC());
			projectVariables.setTEST_SRC(telosysToolsCfg.getTEST_SRC());
			projectVariables.setRES(telosysToolsCfg.getRES());
			projectVariables.setTEST_RES(telosysToolsCfg.getTEST_RES());
			projectVariables.setWEB(telosysToolsCfg.getWEB());
			projectVariables.setDOC(telosysToolsCfg.getDOC());
			projectVariables.setTMP(telosysToolsCfg.getTMP());
			projectVariables.setROOT_PKG(telosysToolsCfg.getRootPackage());
			projectVariables.setENTITY_PKG(telosysToolsCfg.getEntityPackage());
			
			Map<String, String> specificVariables = new HashMap<String, String>();
			for(Variable variable : telosysToolsCfg.getSpecificVariables()) {
				specificVariables.put(variable.getName(), variable.getValue());
			}
			String specificVariablesAsJson = new ObjectMapper().writeValueAsString(specificVariables);
			projectConfiguration.getVariables().setSpecificVariables(specificVariablesAsJson);
			
			return projectConfiguration;
		} catch (TelosysToolsException e) {
			throw new IllegalStateException(e);
		} catch (JsonProcessingException e) {
			throw new IllegalStateException(e);
		}
	}

	public void saveProjectConfiguration(UserProfile user, Project project, ProjectConfiguration projectConfiguration) {
		try {
			TelosysProject telosysProject = getTelosysProject(user, project);
			TelosysToolsCfg telosysToolsCfg = telosysProject.loadTelosysToolsCfg();
		
			ProjectConfigurationVariables projectVariables = projectConfiguration.getVariables();
			
			telosysToolsCfg.setSRC(projectVariables.getSRC());
			telosysToolsCfg.setTEST_SRC(projectVariables.getTEST_SRC());
			telosysToolsCfg.setRES(projectVariables.getRES());
			telosysToolsCfg.setTEST_RES(projectVariables.getTEST_RES());
			telosysToolsCfg.setWEB(projectVariables.getWEB());
			telosysToolsCfg.setDOC(projectVariables.getDOC());
			telosysToolsCfg.setTMP(projectVariables.getTMP());
			telosysToolsCfg.setRootPackage(projectVariables.getROOT_PKG());
			telosysToolsCfg.setEntityPackage(projectVariables.getENTITY_PKG());
			
			/*
			Map<Object, Object> specificVariables = new ObjectMapper().convertValue(projectVariables.getSpecificVariables(), HashMap.class);
			List<Variable> variables = new ArrayList<Variable>();
			for(Object key : specificVariables.keySet()) {
				String name = (String) key;
				String value = String.valueOf(specificVariables.get(key));
				Variable variable = new Variable(name, value);
				variables.add(variable);
			}
			telosysToolsCfg.setSpecificVariables(variables);
			*/
			
			telosysProject.saveTelosysToolsCfg(telosysToolsCfg);
		} catch (TelosysToolsException e) {
			throw new IllegalStateException(e);
		}
	}

	public GenerationResult launchGeneration(UserProfile user, Project project, Generation generation) {
		return launchGenerationByEntityAndBundle(user, project, generation.getModel(), generation.getEntities(), generation.getBundle());
	}

	public GenerationResult launchGenerationByEntityAndBundle(UserProfile user, Project project, String modelName, List<String> entityNames, String bundleName) {
		TelosysProject telosysProject = getTelosysProject(user, project);
		try {
			org.telosys.tools.generic.model.Model genericModel = telosysProject.loadModel(modelName+".model");
			GenerationTaskResult generationTaskResult = telosysProject.launchGeneration(genericModel, entityNames, bundleName);
			
			GenerationResult generationResult = new GenerationResult();
			generationResult.setNumberOfFilesGenerated(generationTaskResult.getNumberOfFilesGenerated());
			generationResult.setNumberOfGenerationErrors(generationTaskResult.getNumberOfGenerationErrors());
			generationResult.setNumberOfResourcesCopied(generationTaskResult.getNumberOfResourcesCopied());
			for(ErrorReport errorReport : generationTaskResult.getErrors()) {
				GenerationErrorResult error = new GenerationErrorResult();
				error.setException(errorReport.getException());
				error.setErrorType(errorReport.getErrorType());
				error.setMessage(errorReport.getMessage());
				generationResult.getErrors().add(error);
			}
			return generationResult;
		} catch (TelosysToolsException e) {
			throw new IllegalStateException(e);
		} catch (GeneratorException e) {
			throw new IllegalStateException(e);
		}
	}
	
	public GenerationResult launchGenerationByModelAndBundle(UserProfile user, Project project, String modelName, String bundleName) {
		TelosysProject telosysProject = getTelosysProject(user, project);
		try {
			org.telosys.tools.generic.model.Model genericModel = telosysProject.loadModel(modelName+".model");
			GenerationTaskResult generationTaskResult = telosysProject.launchGeneration(genericModel, bundleName);
			
			GenerationResult generationResult = new GenerationResult();
			generationResult.setNumberOfFilesGenerated(generationTaskResult.getNumberOfFilesGenerated());
			generationResult.setNumberOfGenerationErrors(generationTaskResult.getNumberOfGenerationErrors());
			generationResult.setNumberOfResourcesCopied(generationTaskResult.getNumberOfResourcesCopied());
			for(ErrorReport errorReport : generationTaskResult.getErrors()) {
				GenerationErrorResult error = new GenerationErrorResult();
				error.setException(errorReport.getException());
				error.setErrorType(errorReport.getErrorType());
				error.setMessage(errorReport.getMessage());
				generationResult.getErrors().add(error);
			}
			return generationResult;
		} catch (TelosysToolsException e) {
			throw new IllegalStateException(e);
		} catch (GeneratorException e) {
			throw new IllegalStateException(e);
		}
	}

	public void createEntityForModel(UserProfile user, Project project, String modelName, String entityName) {
		TelosysProject telosysProject = getTelosysProject(user, project);
		try {
			java.io.File modelIOFile = telosysProject.getDslModelFile(modelName);
			DslModelUtil.createNewEntity(modelIOFile, entityName);
		} catch (TelosysToolsException e) {
			throw new IllegalStateException(e);
		}
	}

}
