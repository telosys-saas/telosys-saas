'use strict';

angular.module('ide').controller('ideCtrl', ['ProjectsService', 'FilesService', '$scope', '$routeParams', function (ProjectsService, FilesService, $scope, $routeParams) {
  // data
  $scope.auth = {
    userId: 'user',

  };
  $scope.projectId = 'Project 1';

  $scope.initialized = false;
  $scope.data = {
    project: {},
    tree: {},
    allFiles: {},
    events: {},
    workingFiles: {},
    selectedFile: {}
  };

  $scope.closeAll = function () {
    console.log("close all");
    $scope.data.workingFiles = {};
  };

  $scope.addFile = function (file) {
    console.log('addFile', file);
    $scope.data.workingFiles[file.id] = file;
    $scope.data.allFiles[file.id] = file;
    $scope.data.selectedFile = file;
    $scope.$apply();
  };

  $scope.onClickFile = function (fileId) {
    console.log('onClickFile', fileId);

    var file = $scope.data.allFiles[fileId];
    if(file.content == null || file.content == '') {
      FilesService.getFileForProject($scope.auth.userId, $scope.projectId, fileId)
        .then(function (result) {
          console.log('getFileForProject', result);
          var file = result.data;
          $scope.data.workingFiles[file.id] = file;
          $scope.data.selectedFile = file;
        })
    } else {
      $scope.data.workingFiles[file.id] = file;
      $scope.data.selectedFile = file;
    }
  };

  $scope.onDoubleClickFile = function (fileId) {
    console.log('onDoubleClickFile', fileId);
    var file = $scope.data.allFiles[fileId];
    $scope.data.workingFiles[file.id] = file;
    $scope.data.selectedFile = file;
    $scope.$apply();
  };

  function defineEvents() {
    $scope.data.events = {
      addFile: $scope.addFile,
      onClickFile: $scope.onClickFile,
      onDoubleClickFile: $scope.onDoubleClickFile
    }
  }

  // init
  function init() {
    defineEvents($scope.data);
    ProjectsService.getProjectById($routeParams.projectId, function (result) {
      $scope.data.project = result;
      FilesService.getFilesForProject($scope.auth.user, $routeParams.projectId, function (result) {
        $scope.data.tree = FilesService.convertFolderToJson(result, null, null);
        $scope.data.allFiles = FilesService.getAllFiles();
        $scope.initialized = true;
      })
    });
  }

  init();
}]);
