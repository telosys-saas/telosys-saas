'use strict';

/**
 * IDE Controller
 */
angular.module('ide').controller('ideCtrl', ['AuthService', '$location', 'ProjectsService', 'FilesService', 'BundlesService', 'TelosysService', 'ModelService', '$scope', '$routeParams', '$log', '$uibModal',

  function (AuthService, $location, ProjectsService, FilesService, BundlesService, TelosysService, ModelService, $scope, $routeParams, $log, $uibModal) {

    /** authentication */
    $scope.profile = {};

    /** Indicates if the IDE is initialized and could be displayed */
    $scope.initialized = false;

    $scope.defaultView = 'configuration';

    function initData() {
      /** IDE data */
      $scope.data = {
        /** Current project */
        project: {},
        /** List of projects */
        projects: [],
        /** View to display */
        isDisplay: $scope.defaultView,
        /** Common events */
        events: getCommonEvents(),
        /** The Telosys Tools Folder */
        telosysFolder: {},
        /** The result of the generation */
        generationResults: [],

        /**
         * Data for model created by the user
         */
        models: {
          name: 'models',
          /** Current project */
          project: {},
          /** All files of models as a tree*/
          tree: [],
          /** All files of the project in only one level */
          allFiles: {},
          /** Working files */
          workingFiles: {},
          /** Selected file */
          selectedFile: null,
          /** Counter of modified file */
          countModifiedFile: 0,
          /** Open File */
          openFile: null,
          /** Select element in the treeview */
          selectedElement: null,
          /** IDE events redirected to controller functions */
          events: getEventsForModels()
        },

        /**
         * All templates to generate files from the model
         */
        bundles: {
          name: 'bundles',
          /** Current project */
          project: {},
          /** All files of bundles as a tree*/
          tree: [],
          /** All files of the project in only one level */
          allFiles: {},
          /** Working files */
          workingFiles: {},
          /** Selected file */
          selectedFile: null,
          /** Counter of modified file */
          countModifiedFile: 0,
          /** Open File */
          openFile: null,
          /** Select element in the treeview */
          selectedElement: null,
          /** Bundles of the project */
          bundlesOfProject: {},
          /** All bundles in public repository */
          allBundles: {},
          /** Git hub user name to get the bundle */
          githubUserName: 'telosys-tools',
          /** IDE events redirected to controller functions */
          events: getEventsForBundles()
        },

        /**
         * Data for generated files
         */
        files: {
          name: 'files',
          /** Current project */
          project: {},
          /** All files of the project as a tree*/
          tree: [],
          /** All files of the project in only one level */
          allFiles: {},
          /** Working files */
          workingFiles: {},
          /** Selected file */
          selectedFile: null,
          /** Counter of modified file */
          countModifiedFile: 0,
          /** Open File */
          openFile: null,
          /** Select element in the treeview */
          selectedElement: null,
          /** IDE events redirected to controller functions */
          events: getEventsForFiles()
        },

        configuration: {
          name: 'configuration',
          /** The environment variables of the current project*/
          variables: {},
          /** IDE events redirected to controller functions */
          events: getEventsForConfiguration()
        }
      };
    }

    /**
     * Common events
     */
    function getCommonEvents() {
      return {
        // File creation
        onCreateFile: $scope.onCreateFile,
        // Folder creation
        onCreateFolder: $scope.onCreateFolder,
        // Select a file
        onClickFile: $scope.onClickFile,
        // Open a file
        onDoubleClickFile: $scope.onDoubleClickFile,
        // Delete the folder
        onDeleteFolder: $scope.onDeleteFolder,
        // Delete the file
        onDeleteFile: $scope.onDeleteFile,
        // Close the file
        onCloseFile: $scope.onCloseFile,
        // Close all files
        closeAll: $scope.closeAll,
        // File content changes
        onContentChange: $scope.onContentChange,
        // Save the file
        saveFile: $scope.saveFile,
        // Save all files
        saveAll: $scope.saveAll,
        // Refresh the file
        onRefreshFile: $scope.onRefreshFile,
        // Donwload the project in zip file
        onDownload: $scope.onDownload,
        // change the view to display
        changeView: $scope.changeView,
        // Launch the generation
        generation: $scope.generation
      }
    }

    /**
     * Events functions of this controller which will be called by sub components to manage user actions
     */
    function getEventsForFiles() {
      var events = getCommonEvents();
      events.refreshAll = $scope.refreshAllFiles;
      return events;
    }

    /**
     * Events functions of this controller which will be called by sub components to manage user actions
     */
    function getEventsForBundles() {
      var events = getCommonEvents();
      events.removeBundle = $scope.removeBundle;
      events.refreshAll = $scope.refreshAllBundles;
      return events;
    }

    /**
     * Events functions of this controller which will be called by sub components to manage user actions
     */
    function getEventsForModels() {
      var events = getCommonEvents();
      events.refreshAll = $scope.refreshAllModels;
      return events;
    }

    /**
     * Events functions of this controller which will be called by sub components to manage user actions
     */
    function getEventsForConfiguration() {
      var events = getCommonEvents();
      events.saveConfig = $scope.saveConfig;
      return events;
    }

    /**
     * Change view : 'models', 'bundles' or 'files'
     * @param view
     */
    $scope.changeView = function (view) {
      $scope.data.isDisplay = view;
    };

    /**
     * Call $apply if there is no $digest currently
     */
    $scope.safeApply = function () {
      var phase = $scope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        $log.info("apply or digest already in progress")
      } else {
        $scope.$apply();
      }
    };

    /**
     * Close all editors
     */
    $scope.closeAll = function (data) {
      $log.info("close all");
      var hasModifiedFile = false;
      // Check if one of the opened file is modified
      for (var fileOpened in data.workingFiles) {
        if (data.workingFiles[fileOpened].isModified) {
          hasModifiedFile = true;
        }
      }
      if (hasModifiedFile) {
        if (!confirm("Les modifications seront perdues. Souhaitez-vous continuer ?")) {
          return;
        }
      }
      // Close the opened file
      for (var fileOpened in data.workingFiles) {
        // Save the modified file(s)
        if (data.workingFiles[fileOpened].isModified) {
          $scope.saveFile(data.workingFiles[fileOpened]);
        }
        // and close all
        delete data.workingFiles[fileOpened];
        data.allFiles[fileOpened].hasContent = false;
      }
      if (data.selectedFile) {
        data.selectedFile.hasContent = true;
        data.selectedFile = null;
      }
      if (data.openFile) {
        data.openFile.hasContent = false;
        data.openFile = null;
      }
      console.log(data.workingFiles);
    };

    /**
     * Close the fileId
     * @param fileId File id
     */
    $scope.onCloseFile = function (data, fileId) {
      if (data.selectedFile.isModified &&
        confirm("Voulez-vous enregistrez les modifications apportées à " + data.selectedFile.name + "?")) {
        $scope.saveFile(data);
      }
      $log.info("close file", fileId);
      // Select the next file to display
      var workingFilesArray = [];
      var indexFile;
      for (var fileKey in data.workingFiles) {
        var tempFile = {};
        tempFile = data.workingFiles[fileKey];
        if (fileKey == fileId) {
          indexFile = workingFilesArray.length - 1;
        }
        workingFilesArray.push(tempFile);
      }
      console.log('workingFilesArray', workingFilesArray[indexFile]);
      data.allFiles[fileId].hasContent = false;
      delete data.workingFiles[fileId];

      if (data.selectedFile) {
        if (data.selectedFile.id == fileId) {
          data.selectedFile.hasContent = true;
          data.selectedFile = workingFilesArray[indexFile];
        }
      }
      if (data.openFile) {
        if (data.openFile.id == fileId) {
          data.openFile.hasContent = false;
          data.openFile = null;
        }
      }
      $scope.onClickFile(data, workingFilesArray[indexFile].id);
    };

    /**
     * Save all modified files
     */
    $scope.saveAll = function (data) {
      $log.info("save all");
      data.countModifiedFile = 0;
      for (var file in data.workingFiles) {
        FilesService.saveFileForProject($scope.profile.userId, data.project.id, data.workingFiles[file]);
        data.workingFiles[file].isModified = false;
      }
      if (data.selectedFile) {
        if (!data.workingFiles[data.selectedFile.id]) {
          data.selectedFile.isModified = false;
          FilesService.saveFileForProject($scope.profile.userId, data.project.id, data.selectedFile);
        }
      }
    };

    /**
     * Save the selected file or the file if defined
     * @param file File to save
     */
    $scope.saveFile = function (data, file) {

      if (file) {
        if (file.isModified) {
          data.countModifiedFile--;
        }
        $log.info('save file', file);
        FilesService.saveFileForProject($scope.profile.userId, data.project.id, file);
      } else {
        $log.info('save selectedFile');
        if (data.selectedFile.isModified) {
          data.countModifiedFile--;
        }
        data.selectedFile.isModified = false;
        FilesService.saveFileForProject($scope.profile.userId, $scope.data.project.id, data.selectedFile);
      }
    };

    /**
     * After file creation
     * @param file File to create
     */
    $scope.onCreateFile = function (data, file) {
      $log.info('onCreateFile', file);
      data.workingFiles[file.id] = file;
      data.allFiles[file.id] = file;
      data.selectedFile = file;
      file.isModified = false;
      $scope.safeApply();
    };

    /**
     * After folder creation
     * @param folder Folder to create
     */
    $scope.onCreateFolder = function (folder) {
      $log.info('onCreateFolder', folder);
      $scope.safeApply();
    };

    /**
     * Delete the folder
     * @param folderId Folder id to delete
     */
    $scope.onDeleteFolder = function (data, folderId) {
      $log.info('onDeleteFolder', folderId);
      FilesService.deleteFolderForProject($scope.profile.userId, data.project.id, folderId);
    };

    /**
     * Delete the file
     * @param fileId File id to delete
     */
    $scope.onDeleteFile = function (data, fileId) {
      FilesService.deleteFileForProject($scope.profile.userId, data.project.id, fileId);
      if(data.workingFiles[fileId]) {
        delete data.workingFiles[fileId];
      }
      if (data.selectedFile && data.selectedFile.id == fileId) {
        data.selectedFile = null;
      }
      if (data.openFile && data.openFile.id == fileId) {
        data.openFile = null;
      }
    };

    /**
     * Remove bundle
     */
    $scope.removeBundle = function (bundleName) {
      BundlesService.removeBundle($scope.profile.userId, $scope.data.project.id, bundleName)
        .then(function () {
          delete $scope.data.bundles.bundlesOfProject[bundleName];
          $scope.refreshAllBundles();
        })
    };
    
    /**
     * Select a file
     * @param fileId File id to select
     */
    $scope.onClickFile = function (data, fileId) {
      var file = data.allFiles[fileId];

      if (!data.workingFiles[fileId]) {
        data.openFile = file;
      }

      if (!file.hasContent) {
        FilesService.getFileForProject($scope.profile.userId, $scope.data.project.id, fileId)
          .then(function (result) {
            var file = result.data;
            $log.info('getFileForProject', file);
            data.allFiles[file.id].hasContent = true;
            data.allFiles[file.id].content = file.content;
            data.allFiles[file.id].isModified = false;
            data.selectedFile = data.allFiles[file.id];
          });
      } else {
        data.selectedFile = file;
      }
      $scope.safeApply();
    };

    /**
     * Open a file and pinned it
     * @param fileId File id to open
     */
    $scope.onDoubleClickFile = function (data, fileId) {
      $log.info('onDoubleClickFile', fileId);
      var file = data.allFiles[fileId];
      if (data.selectedFile.id != fileId) {
        data.selectedFile = file;
      }
      data.workingFiles[file.id] = file;
      $scope.safeApply();
    };

    /**
     * The user changes the file content
     * @param data
     * @param fileId File id modified by user
     */
    $scope.onContentChange = function (data, fileId) {
      $log.info('onContentChange', fileId);
      if (!data.allFiles[fileId].isModified) {
        data.countModifiedFile++;
        data.allFiles[fileId].isModified = true;
        data.workingFiles[fileId] = data.allFiles[fileId];
      }
      $scope.safeApply();
    };

    /**
     * Refresh all opened files
     */
    $scope.refreshAllFiles = function (callback) {
      console.log('refreshAllFiles');
      FilesService.getFilesForProject($scope.profile.user, $scope.data.project.id)
        .then(function (result) {
          var filesFoder = result.data;
          filesFoder.id = '@@_root_@@';
          $scope.data.files.tree = [];
          $scope.data.files.tree.push(FilesService.convertFolderToJson(filesFoder, null, 'folder'));
          $scope.data.files.allFiles = FilesService.getAllFilesFromTree(result.data);
          if (callback) {
            callback();
          }
        });
    };

    /**
     * Refresh all models
     */
    $scope.refreshAllModels = function (callback) {
      console.log('refreshAllModels');
      getTelosysFolder()
        .then(function (result) {
          $scope.telosysFolder = result.data;
          ModelService.getModels($scope.profile.userId, $scope.data.project.id)
            .then(function (result) {
              initModels(result.data);
              if (callback) {
                callback();
              }
            })
        })
    };

    /**
     * Refresh all bundles
     */
    $scope.refreshAllBundles = function (callback) {
      console.log('refreshAllBundles');
      getTelosysFolder()
        .then(function (result) {
          $scope.telosysFolder = result.data;
          var templateFolder = getFolderByName($scope.telosysFolder, 'templates');
          if (templateFolder.folders) {
            $scope.data.bundles.tree = [];
            for (var index = 0; index < templateFolder.folders.length; index++) {
              templateFolder.folders[index].id = '@@_root_@@_' + index;
              $scope.data.bundles.tree.push(FilesService.convertFolderToJson(templateFolder.folders[index], null, 'bundle'));
            }
            $scope.data.bundles.allFiles = FilesService.getAllFilesFromTree(templateFolder);
            BundlesService.getBundlesInPublicRepository($scope.data.bundles.githubUserName)
              .then(function (result) {
                $scope.data.bundles.allBundles = result.data;
                if (callback) {
                  callback();
                }
              });
          }
        });

    };

    /**
     * Refresh the selected file
     * @param data
     * @param callback Callback to update the file content in the editor
     */
    $scope.onRefreshFile = function (data, callback) {
      FilesService.getFileForProject($scope.profile.userId, $scope.data.project.id, data.selectedFile.id)
        .then(function (result) {
          var file = result.data;
          $log.info('refresh file', file);
          data.allFiles[file.id].hasContent = true;
          data.allFiles[file.id].content = file.content;
          data.selectedFile = data.allFiles[file.id];
          if (callback) {
            callback();
          }
        })
    };

    /**
     * Download the project in a ZIP file
     */
    $scope.onDownload = function () {
      ProjectsService.downloadZip($scope.profile.userId, $scope.data.project.id)
    };

    /**
     * Launch the generation
     */
    $scope.generation = function (entitiesByModels, templatesByBundle) {
      $scope.generations = [];
      for (var model in entitiesByModels) {
        var entities = entitiesByModels[model];
        for (var bundle in templatesByBundle) {
          var templates = templatesByBundle[bundle];
          var generation = {
            model: model,
            entities: entities,
            bundle: bundle,
            templates: templates
          };
          console.log('generation: ', generation);
          $scope.generations.push(generation);
        }
      }

      // do only one generation at times
      var i = 0;
      if (i < $scope.generations.length) {
        var generation = $scope.generations[i];
        $scope.launchGenerationCallback = (function launchGenerationCallback(generation, result) {
          console.log('generation callback', result);
          var generationResult = {
            generation: generation,
            result: result,
            isDisplay: false
          };
          $scope.data.generationResults.push(generationResult);
          // next generation
          i++;
          if (i < $scope.generations.length) {
            var generation = $scope.generations[i];
            ProjectsService.launchGeneration($scope.profile.userId, $scope.data.project.id, generation)
              .then(function (result) {
                $scope.launchGenerationCallback(generation, result);

              })
          } else {
            // When the generation is finished, get the generated file
            $scope.refreshAllFiles();
          }
        });
        ProjectsService.launchGeneration($scope.profile.userId, $scope.data.project.id, generation)
          .then(function (result) {
            $scope.launchGenerationCallback(generation, result);
          });
      }
    };

    function getTelosysFolder() {
      return TelosysService.getTelosysFolderForProject($scope.profile.userId, $scope.data.project.id);
    }

    /**
     * Get a specific folder by its name
     * @param folderParent Parent folder
     * @param name Name of searched folder
     * @returns {*}
     */
    function getFolderByName(folderParent, name) {
      if (folderParent.folders) {
        for (var index = 0; index < folderParent.folders.length; index++) {
          if (folderParent.folders[index].name == name) {
            return folderParent.folders[index];
          }
        }
      }
    }

    function getAuthStatus(callback) {
      AuthService.status().then(function (result) {
        $scope.profile = result.data;
        if (callback) callback($scope.profile.authenticated);
      });
    }

    function initBundles() {
      // Get Bundles
      var templateFolder = getFolderByName($scope.telosysFolder, 'templates');
      if (templateFolder.folders) {
        for (var index = 0; index < templateFolder.folders.length; index++) {
          templateFolder.folders[index].id = '@@_root_@@_' + index;
          $scope.data.bundles.tree.push(FilesService.convertFolderToJson(templateFolder.folders[index], null, 'bundle'));
        }
        $scope.data.bundles.allFiles = FilesService.getAllFilesFromTree(templateFolder);
      }
      // Public bundles
      return BundlesService.getBundlesOfProject($scope.profile.userId, $scope.data.project.id);
    }

    function initModels(models) {
      var allModelsFolder = {
        folders: []
      };
      if (models && models.length > 0) {
        $scope.data.models.tree = [];
        for (var index = 0; index < models.length; index++) {
          var modelName = models[index].name;
          var modelFolder = getFolderByName($scope.telosysFolder, modelName);
          allModelsFolder.folders.push(modelFolder);
          modelFolder.id = '@@_root_@@_' + index;
          $scope.data.models.tree.push(FilesService.convertFolderToJson(modelFolder, null, 'models'));
        }
        $scope.data.models.allFiles = FilesService.getAllFilesFromTree(allModelsFolder);
      }
    }

    /**
     * Init the configuration of the project
     * @param config configuration project from the server
     */
    function initConfiguration(config) {
      // Init the environment variables
      $scope.data.configuration.variables = config.variables;
      // Init the specific variables
      $scope.data.configuration.variables.specificVariables = JSON.parse(config.variables.specificVariables);
      $scope.data.configuration.variables.specificVariablesKeys = Object.keys($scope.data.configuration.variables.specificVariables);
    }
    
    function convertBundleArrayToBundleMap(bundelArray) {
      for(var index = 0; index < bundelArray.length; index++){
        var bundle = bundelArray[index];
        $scope.data.bundles.bundlesOfProject[bundle.name] = bundle;
      }
    }

    /**
     * Save the new configuration of the project
     */
    $scope.saveConfig = function () {
      ProjectsService.saveProjectConfiguration($scope.profile.userId, $routeParams.projectId, $scope.data.configuration)
        .then(function (result) {
          initConfiguration(result.data);
        })
    };

    /**
     * Initialize the IDE
     */
    function init() {
      initData();
      getAuthStatus(function (authenticated) {
        if (!authenticated) {
          console.log('authenticated false');
          return;
        }
        ProjectsService.getProjects($scope.profile.userId)
          .then(function (result) {
            // Get the selected project by the user
            $scope.data.projects = result.data;
            return ProjectsService.getProjectById($scope.profile.userId, $routeParams.projectId);
          })
          .then(function (result) {
            // Init the current project
            $scope.data.project = $scope.data.bundles.project = $scope.data.models.project = $scope.data.files.project = result.data;
            // Get the telosys folder
            return getTelosysFolder();
          })
          .then(function (result) {
            // Init the telosys folder
            $scope.telosysFolder = result.data;
            // Get Files
            return FilesService.getFilesForProject($scope.profile.user, $scope.data.project.id);
          })
          .then(function (result) {
            // Init Files
            var filesFoder = result.data;
            filesFoder.id = '@@_root_@@';
            $scope.data.files.tree.push(FilesService.convertFolderToJson(filesFoder, null, 'folder'));
            $scope.data.files.allFiles = FilesService.getAllFilesFromTree(result.data);
            // Get bundles
            return initBundles();
          })
          .then(function (result) {
            convertBundleArrayToBundleMap(result.data);
            // Get bundles from Github repository
            return BundlesService.getBundlesInPublicRepository($scope.data.bundles.githubUserName);
          })
          .then(function (result) {
            // Init bundles
            $scope.data.bundles.allBundles = result.data;
            //Get models
            return ModelService.getModels($scope.profile.userId, $scope.data.project.id)
          })
          .then(function (result) {
            // Init models
            initModels(result.data);
            // Get the configuration of the project
            return ProjectsService.getProjectConfiguration($scope.profile.userId, $scope.data.project.id);
          })
          .then(function (result) {
            // Init the configuration of the project
            initConfiguration(result.data);
            // Indicates that the IDE is initialized and can be displayed
            $scope.initialized = true;
          })
          .catch(function (e) {
            console.log(e);
          });
      });
    }

    init();
  }
]);