'use strict';

angular.module('modal').controller('modalCtrl', ['$scope', '$uibModalInstance', 'FilesService', 'ProjectsService', 'BundlesService', 'ModelService', 'AuthService', 'data',
  function ($scope, $uibModalInstance, FilesService, ProjectsService, BundlesService, ModelService, AuthService, data) {

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
     * Create a new project
     */
    $scope.createProject = function () {
      console.log('createProject modal');
      ProjectsService.createProject($scope.profile.userId, $scope.projectName)
        .then(function (result) {
          var project = result.data;
          $uibModalInstance.close(project);
        })
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
     * Add bundle to the current project
     */
    $scope.addBundle = function (bundleName) {
      BundlesService.addBundle($scope.profile.userId, $scope.data.project.id, bundleName)
        .then(function () {
          $scope.data.refreshAll();
        })

    };

    /**
     * Add bundle to the current project
     */
    $scope.removeBundle = function (bundleName) {
      BundlesService.removeBundle($scope.profile.userId, $scope.data.project.id, bundleName)
        .then(function () {
          $scope.data.refreshAll();
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
     * Close the modal window
     */
    $scope.cancel = function () {
      console.log('cancel modal');
      $uibModalInstance.dismiss();
    };

    function init() {
      AuthService.status().then(function (result) {
        $scope.profile = result.data;
      })
    }

    init();

  }]);