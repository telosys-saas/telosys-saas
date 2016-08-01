'use strict';

angular.module('modal').controller('modalCtrl', ['$scope', '$uibModalInstance', 'FilesService', 'ProjectsService', 'data',
  function ($scope, $uibModalInstance, FilesService, ProjectsService, data) {

    /** authentication */
    $scope.auth = {
      userId: 'user'
    };

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
     * Create a new project
     */
    $scope.createProject = function () {
      console.log('createProject modal');
      ProjectsService.createProject($scope.auth.userId, $scope.projectName)
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
      FilesService.createFolderForProject($scope.auth.userId, $scope.data.project.id, folder)
        .then(function (result) {
          var folder = result.data;
          console.log('createFolderForProject', folder);
          if (folder.existing == true) {
            $scope.errorMessage = "Folder already exists";
          } else {
            $uibModalInstance.close(folder);
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
      FilesService.createFileForProject($scope.auth.userId, $scope.data.project.id, file)
        .then(function (result) {
          var file = result.data;
          console.log('createFileForProject', file);
          if (file.existing == true) {
            $scope.errorMessage = "File already exists";
          } else {
            $uibModalInstance.close(file);
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
     * Close the modal window
     */
    $scope.cancel = function () {
      console.log('cancel modal');
      $uibModalInstance.dismiss();
    };
  }])
;
