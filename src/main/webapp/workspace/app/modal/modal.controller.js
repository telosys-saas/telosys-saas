'use strict';

angular.module('modal').controller('modalCtrl', ['$scope', '$uibModalInstance', 'FilesService', 'ProjectsService', 'BundlesService', 'ModelService', 'AuthService', '$uibModal', '$location', 'data',
  function ($scope, $uibModalInstance, FilesService, ProjectsService, BundlesService, ModelService, AuthService, $uibModal, $location, data) {

    /** authentication */
    $scope.profile = {};

    // data
    $scope.data = data;

    $scope.errorMessage = null;

    /**
     * The new project name
     */
    $scope.projectName = "";
    /**
     * The new model name
     */
    $scope.modelName = '';
    /**
     * The new folder name
     */
    $scope.folderName = '';
    /**
     * The new file name
     */
    $scope.fileName = '';

    /**
     * The new entity name
     */
    $scope.entityName = '';

    /** Data for Configuration */
    $scope.selectedVariable = null;
    $scope.rowToDeletes = {};
    $scope.displayConfigurationTab = 'folders';
    $scope.rowToAdd = {};

    /**
     * The new specific variable
     */
    $scope.specificVariable = {
      name: '',
      value: ''
    };

    /** The list of selected bundle */
    $scope.bundleToDownload = {};

    /** Bundles to remove */
    $scope.bundleToRemove = {};

    /** The new password */
    $scope.changePassword = {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    };

    /** The list of file to save */
    $scope.fileToSaves = {};

    /** When the server is downloading bundles */
    $scope.downloading = false;
    
    /** The selected folder to download */
    $scope.folderToDownload  = {
      /** If the user wants to download the generated file */
      generatedFiles : true,
      /** If the user wants to download the telosys folder (models and bundles) */
      telosysFolder : false
    };

    /** Projects to remove */
    $scope.projectsToRemove = {};

    /**
     * Create a new project
     */
    $scope.createProject = function () {
      console.log('createProject modal');
      if ($scope.projectName != "") {
        ProjectsService.createProject($scope.profile.userId, $scope.projectName)
          .then(function (result) {
            var project = result.data;
            if (project.existing) {
              $scope.errorMessage = "Project already exists";
              return;
            }
            if (project.tooManyProject) {
              $scope.errorMessage = "You have too many projects, please buy a premium account";
              return;
            }
            ModelService.createModel($scope.profile.userId, project.id, $scope.modelName)
              .then(function () {
                $location.path('/ide/' + project.id);
                $uibModalInstance.close(project);
              })
          })
      }
    };

    /**
     * User changes the project name
     */
    $scope.projectNameChange = function () {
      if (!$scope.hasUserChangedModelName) {
        $scope.modelName = $scope.projectName.toLowerCase();
      }
    };

    /**
     * User changes the model name
     */
    $scope.modelNameChange = function () {
      if ($scope.modelName == null || $scope.modelName == '') {
        delete $scope.hasUserChangedModelName;
        $scope.noModelName = true;
      } else {
        $scope.hasUserChangedModelName = true;
        $scope.noModelName = false;
      }
    };

    /**
     * User changes the model name
     */
    $scope.modelNameOnBlur = function () {
      if ($scope.modelName == null || $scope.modelName == '') {
        $scope.modelName = $scope.projectName.toLowerCase();
      }
    };

    /**
     * Create a new folder
     */
    $scope.createFolder = function () {
      console.log('createFolder modal', $scope.folderName);
      if ($scope.folderName != "") {
        var folder = {};
        // create the new folder object
        if ($scope.data.nodeParent.id == '@@_root_@@') {
          folder = {
            id: $scope.folderName,
            name: $scope.folderName,
            type: 'folder',
            folderParentId: ""
          };
        } else {
          folder = {
            id: $scope.data.nodeParent.id + '/' + $scope.folderName,
            name: $scope.folderName,
            type: 'folder',
            folderParentId: $scope.data.nodeParent.id
          }
        }
        FilesService.createFolderForProject($scope.profile.userId, $scope.data.project.id, folder)
          .then(function (result) {
            var folder = result.data;
            if (folder.existing == true) {
              $scope.errorMessage = "Folder already exists";
            } else {
              $scope.data.refreshAll();
              $uibModalInstance.close();
            }
          });
      }
    };

    /**
     * Create a new file
     */
    $scope.createFile = function () {
      console.log('createFile modal', $scope.data.nodeParent);
      var file = {};
      // create the new file object
      if ($scope.data.nodeParent.id == '@@_root_@@') {
        file = {
          id: $scope.fileName,
          name: $scope.fileName,
          type: 'file',
          folderParentId: ""
        };
      } else {
        file = {
          id: $scope.data.nodeParent.id + '/' + $scope.fileName,
          name: $scope.fileName,
          type: 'file',
          folderParentId: $scope.data.nodeParent.id
        }
      }
      FilesService.createFileForProject($scope.profile.userId, $scope.data.project.id, file)
        .then(function (result) {
          var file = result.data;
          if (file.existing == true) {
            $scope.errorMessage = "File already exists";
          } else {
            $scope.data.openCreatedFile(file.id);
            $uibModalInstance.close();
          }
        });
    };

    /**
     * Save current file
     */
    $scope.saveFile = function (result) {
      console.log('saveFile modal');
      $uibModalInstance.close(result);
    };

    /**
     * Create a new model
     */
    $scope.createModel = function () {
      ModelService.createModel($scope.profile.userId, $scope.data.project.id, $scope.modelName)
        .then(function (result) {
          var model = result.data;
          if (model.existing) {
            $scope.errorMessage = "Model already exists";
          } else {
            if ($scope.data.refreshAll) {
              $scope.data.refreshAll();
            }
            $uibModalInstance.close();
          }
        })
    };

    /**
     * Create an entity
     */
    $scope.createEntity = function () {
      if($scope.entityName[0] != $scope.entityName[0].toUpperCase()){
        $scope.errorMessage = "Entity name must start with an upper case";
        return;
      }
      ModelService.createEntityForModel($scope.profile.userId, $scope.data.project.id, $scope.data.selectedModel, $scope.entityName)
        .then(function (result) {
          var file = result.data;
          if (file.existing) {
            $scope.errorMessage = "Entity already exists";
          } else {
            $scope.data.openCreatedFile(file.id);
            $uibModalInstance.close();
          }
        })
    };

    /**
     * Download the selected bundle from github
     */
    $scope.downloadBundle = function () {
      $scope.downloading = true;
      for (var index = 0; index < $scope.data.allBundles.length; index++) {
        var bundle = $scope.data.allBundles[index];
        if ($scope.bundleToDownload[bundle.name]) {
          BundlesService.addBundle($scope.profile.userId, $scope.data.project.id, $scope.data.githubUserName, bundle.name)
            .then(function (result) {
              var bundle = result.data;
              $scope.bundleToDownload[bundle.name] = false;
              $scope.data.bundlesOfProject[bundle.name] = bundle;
              $scope.data.refreshAll();
              $scope.downloading = false;
            });
        }
      }
    };

    $scope.removeBundle = function () {
      for (var bundle in $scope.bundleToRemove) {
        if ($scope.bundleToRemove[bundle]) {
          $scope.data.removeBundle(bundle);
          $scope.bundleToRemove[bundle.name] = false;
          delete $scope.data.bundlesOfProject[bundle];
        }
      }
      $scope.data.refreshAll();
    };


    /**
     * Get a list of bundles from github
     */
    $scope.getbundles = function () {
      $scope.downloading = true;
      BundlesService.getBundlesInPublicRepository($scope.data.githubUserName)
        .then(function (result) {
          $scope.data.allBundles = result.data;
          $scope.downloading = false;
        })
    };

    $scope.selectBundle = function (bundle) {
      $scope.selectedBundle = bundle;
    };

    $scope.submitNewPassword = function () {
      AuthService.changePassword($scope.profile.userId, $scope.changePassword)
        .then(function (result) {
          var changePasswordResult = result.data;
          if (changePasswordResult.hasError) {
            $scope.errorMessage = changePasswordResult.message;
            return;
          }
          $uibModalInstance.close();
        })
    };

    $scope.onClickConfigurationTab = function (tabToDisplay) {
      $scope.displayConfigurationTab = tabToDisplay;
    };

    /**
     * Apply the new configuration
     */
    $scope.saveConfig = function () {
      $scope.data.events.saveConfig();
      $uibModalInstance.close();
    };

    /**
     * Add a specific variable
     */
    $scope.addConfigurationVariable = function () {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/modal/modal.addvariable.html',
        controller: 'modalCtrl',
        windowTopClass: 'top-modal',
        resolve: {
          data: {}
        }
      });
      modalInstance.result.then(function (specificVariable) {
        $scope.data.variables.specificVariables[specificVariable.name] = specificVariable.value;
      })
    };

    /**
     * Add a specific variable to the project
     */
    $scope.addSpecificVariable = function () {
      $uibModalInstance.close($scope.specificVariable);
    };

    /**
     * Delete a specific variable
     */
    $scope.deleteConfigurationVariable = function () {
      if ($scope.rowToDeletes) {
        for (var key in $scope.rowToDeletes) {
          if ($scope.rowToDeletes[key]) {
            delete $scope.data.variables.specificVariables[key];
          }
        }
      }
      $scope.rowToDeletes = {};
    };

    $scope.selectConfigurationVariable = function (key) {
      $scope.selectedVariable = key;
    };

    $scope.selectAllFileToSave = function () {
      for (var file in $scope.data.modifiedFiles) {
        $scope.fileToSaves[file] = true;
      }
    };

    $scope.deselectAllFileToSave = function () {
      for (var file in $scope.data.modifiedFiles) {
        $scope.fileToSaves[file] = false;
      }
    };

    $scope.closeAll = function () {
      $uibModalInstance.close($scope.fileToSaves)
    };

    $scope.removeElement = function () {
      $uibModalInstance.close()
    };

    /**
     * Download the project
     */
    $scope.downloadProject = function () {
      $uibModalInstance.close($scope.folderToDownload);
    };

    /**
     * Remove the projects selected by the user
     */
    $scope.removeProjects = function () {
      console.log('removeProject');
      for (var project in $scope.projectsToRemove) {
        if (project) {
          ProjectsService.removeProject($scope.profile.userId, project)
            .then(function () {
              $scope.data.events.refreshProjects();
              if($scope.data.project) {
                if (project == $scope.data.project.id) {
                  $location.path('/dashboard');
                }
              }
            });
        }
      }
      $uibModalInstance.close();
    };
    /**
     * Select all projects
     */
    $scope.selectAllProject = function () {
      for (var index = 0; index < $scope.data.projects.length; index++) {
        var project = $scope.data.projects[index];
        $scope.projectsToRemove[project.id] = true;
      }
    };

    /**
     * Deselect all projects
     */
    $scope.deselectAllProject = function () {
      for (var index = 0; index < $scope.data.projects.length; index++) {
        var project = $scope.data.projects[index];
        $scope.projectsToRemove[project.id] = false;
      }
    };
    
    /**
     * Close the modal window
     */
    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };

    function init() {
      console.log('init modal', data);
      AuthService.status().then(function (result) {
        $scope.profile = result.data;
      });
      if ($scope.data.modifiedFiles) {
        $scope.selectAllFileToSave();
      }
    }

    init();

  }
])
;