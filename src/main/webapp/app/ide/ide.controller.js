'use strict';

angular.module('ide').controller('ideCtrl', ['ProjectsService', 'FilesService', '$scope', '$routeParams',
  function (ProjectsService, FilesService, $scope, $routeParams) {
    // data
    $scope.auth = {
      userId: 'user'
    };
    $scope.projectId = 'Project 1';

    $scope.initialized = false;
    $scope.data = {
      project: {},
      tree: {},
      allFiles: {},
      events: {},
      workingFiles: {},
      selectedFile: null,
      selectedElement: null
    };

    $scope.closeAll = function () {
      console.log("close all");
      $scope.data.workingFiles = {};
      $scope.data.selectedFile = null;
    };

    $scope.onCloseFile = function (fileId) {
      console.log("close file", fileId);
      delete $scope.data.workingFiles[fileId];
      if ($scope.data.selectedFile.id == fileId) {
        $scope.data.selectedFile = null;
      }
    };

    $scope.saveAll = function () {
      console.log("save all");
      for (var file in $scope.data.workingFiles) {
        console.log("save all for loop", $scope.data.workingFiles[file]);
        FilesService.saveFileForProject($scope.auth.userId, $scope.projectId, $scope.data.workingFiles[file]);
        $scope.data.events.fileIsModified(file);
      }
      if ($scope.data.selectedFile) {
        if (!$scope.data.workingFiles[$scope.data.selectedFile.id]) {
          console.log("save all selectedFile");
          $scope.data.selectedFile.isModified = false;
          $scope.data.events.fileIsModified($scope.data.selectedFile);
          FilesService.saveFileForProject($scope.auth.userId, $scope.projectId, $scope.data.selectedFile);
        }
      }
    };

    $scope.onCreateFile = function (file) {
      console.log('onCreateFile', file);
      FilesService.createFileForProject($scope.auth.userId, $scope.projectId, file)
        .then(function (result) {
          var file = result.data;
          console.log('createFileForProject', file);
          $scope.data.workingFiles[file.id] = file;
          $scope.data.allFiles[file.id] = file;
          $scope.data.selectedFile = file;
          file.isModified = true;
        });
      $scope.$apply();
    };

    $scope.onCreateFolder = function (folder) {
      console.log('onCreateFolder', folder);
      FilesService.createFolderForProject($scope.auth.userId, $scope.projectId, folder);
      $scope.$apply();
    };

    $scope.onDeleteFolder = function (folderId) {
      console.log('onDeleteFolder', folderId);
      FilesService.deleteFolderForProject($scope.auth.userId, $scope.projectId, folderId);
    };

    $scope.onDeleteFile = function (fileId) {
      FilesService.deleteFileForProject($scope.auth.userId, $scope.projectId, fileId);
      delete $scope.data.workingFiles[fileId];
      if ($scope.data.selectedFile.id == fileId) {
        $scope.data.selectedFile = null;
      }
    };

    $scope.onClickFile = function (fileId) {
      var file = $scope.data.allFiles[fileId];
      if (!file.isGet) {
        FilesService.getFileForProject($scope.auth.userId, $scope.projectId, fileId)
          .then(function (result) {
            var file = result.data;
            console.log('getFileForProject', file);
            $scope.data.allFiles[file.id].isGet = true;
            $scope.data.allFiles[file.id].content = file.content;
            $scope.data.allFiles[file.id].isModified = false;
          })
      } else {
        console.log('before onClickFile', $scope.data.selectedFile);
        $scope.data.selectedFile = file;
        console.log('after onClickFile', $scope.data.selectedFile);
      }
    };

    $scope.onDoubleClickFile = function (fileId) {
      console.log('onDoubleClickFile', fileId);
      var file = $scope.data.allFiles[fileId];
      $scope.data.selectedFile = file;
      $scope.data.workingFiles[file.id] = file;
      $scope.$apply();
    };

    $scope.onContentChange = function(fileId) {
      console.log('onContentChange', fileId);
      $scope.data.allFiles[fileId].isModified = true;
      $scope.$apply();
    };

    $scope.refreshAll = function () {
      ProjectsService.getProjectById($routeParams.projectId, function (result) {
        $scope.data.project = result;
        FilesService.getFilesForProject($scope.auth.user, $routeParams.projectId, function (result) {
          $scope.data.tree = FilesService.convertFolderToJson(result, null, 'root');
          $scope.data.allFiles = FilesService.getAllFiles();
        })
      });
    };

    function defineEvents() {
      $scope.data.events = {
        onCreateFile: $scope.onCreateFile,
        onCreateFolder: $scope.onCreateFolder,
        onClickFile: $scope.onClickFile,
        onDoubleClickFile: $scope.onDoubleClickFile,
        onDeleteFolder: $scope.onDeleteFolder,
        onDeleteFile: $scope.onDeleteFile,
        onCloseFile: $scope.onCloseFile,
        refreshAll: $scope.refreshAll,
        onContentChange: $scope.onContentChange
      }
    }

    // init
    function init() {
      defineEvents();
      ProjectsService.getProjectById($routeParams.projectId, function (result) {
        $scope.data.project = result;
        FilesService.getFilesForProject($scope.auth.user, $routeParams.projectId, function (result) {
          $scope.data.tree = FilesService.convertFolderToJson(result, null, 'root');
          $scope.data.allFiles = FilesService.getAllFiles();
          $scope.initialized = true;
        })
      });
    }

    init();
  }]);
