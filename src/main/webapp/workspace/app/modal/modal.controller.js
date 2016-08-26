'use strict';

angular.module('modal').controller('modalCtrl', ['$scope', '$uibModalInstance', 'FilesService', 'ProjectsService', 'BundlesService', 'ModelService', 'AuthService', '$uibModal', 'data',
  function ($scope, $uibModalInstance, FilesService, ProjectsService, BundlesService, ModelService, AuthService, $uibModal, data) {

    /** authentication */
    $scope.profile = {};

    // data
    $scope.data = data;

    $scope.errorMessage = "";

    /**
     * The new project name
     */
    $scope.projectName = "";
    /**
     * The new model name
     */
    $scope.modelName = "";
    /**
     * The new folder name
     */
    $scope.folderName = "";
    /**
     * The new file name
     */
    $scope.fileName = "";

    /**
     * The new entity name
     */
    $scope.entityName = "";

    /**
     * The new specific variable
     */
    $scope.specificVariable = {
      name: "",
      value: ""
    };

    /** The selected bundle */
    $scope.selectedBundle = {};

    /** The new password */
    $scope.changePassword = {
      oldPassword: "",
      password: "",
      confirmPassword: ""
    };

    /**
     * Create a new project
     */
    $scope.createProject = function () {
      console.log('createProject modal');
      ProjectsService.createProject($scope.profile.userId, $scope.projectName)
        .then(function (result) {
          var project = result.data;
          ModelService.createModel($scope.profile.userId, project.id, $scope.modelName)
            .then(function () {
              if ($scope.data.refreshAll) {
                $scope.data.refreshAll();
              }
              $uibModalInstance.close(project);
            })
        })
    };

    /**
     * User changes the project name
     */
    $scope.projectNameChange = function () {
      if (!$scope.hasUserChangedModelName) {
        $scope.modelName = $scope.projectName;
      }
    };

    /**
     * User changes the model name
     */
    $scope.modelNameChange = function () {
      if ($scope.modelName == null || $scope.modelName == '') {
        delete $scope.hasUserChangedModelName;
      } else {
        $scope.hasUserChangedModelName = true;
      }
    };

    /**
     * User changes the model name
     */
    $scope.modelNameOnBlur = function () {
      if ($scope.modelName == null || $scope.modelName == '') {
        $scope.modelName = $scope.projectName;
      }
    };

    /**
     * Create a new folder
     */
    $scope.createFolder = function () {
      console.log('createFolder modal', $scope.data.nodeParent);
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
            $scope.data.refreshAll();
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
        .then(function () {
          if ($scope.data.refreshAll) {
            $scope.data.refreshAll();
          }
          $uibModalInstance.close();
        })
    };

    /**
     * Create an entity
     */
    $scope.createEntity = function () {
      ModelService.createEntityForModel($scope.profile.userId, $scope.data.project.id, $scope.data.modelName, $scope.entityName)
        .then(function () {
          $scope.data.refreshAll();
          $uibModalInstance.close();
        })
    };

    /**
     * Add a specific variable to the project
     */
    $scope.addVariable = function () {
      $uibModalInstance.close($scope.specificVariable);
    };

    /**
     * Download the selected bundle from github
     */
    $scope.downloadBundle = function () {
      BundlesService.addBundle($scope.profile.userId, $scope.data.project.id, $scope.data.githubUserName, $scope.selectedBundle.name)
        .then(function () {
          $scope.data.refreshAll();
          $scope.data.bundlesOfProject[$scope.selectedBundle.name] = $scope.selectedBundle;
        });
    };

    /**
     * Get a list of bundles from github
     */
    $scope.getbundles = function () {
      BundlesService.getBundlesInPublicRepository($scope.data.githubUserName)
        .then(function (result) {
          $scope.data.allBundles = result.data;
        })
    };

    $scope.selectBundle = function (bundle) {
      $scope.selectedBundle = bundle;
    };
    
    $scope.confirmPasswordChange = function () {
      if($scope.changePassword.confirmPassword != $scope.changePassword.password){
        $scope.passwordDontMatch = true;
      }else{
        $scope.passwordDontMatch = false;
      }
    };

    $scope.submitNewPassword = function () {
      if($scope.passwordDontMatch){
        return
      }
      AuthService.changePassword($scope.profile.userId, $scope.changePassword);
      $uibModalInstance.close();
    };

    /**
     * Close the modal window
     */
    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };

    function init() {
      AuthService.status().then(function (result) {
        $scope.profile = result.data;
        if (data.modelName) {
          $scope.modelName = data.modelName.toLowerCase();
        }
      })
    }

    init();

  }
])
;