'use strict';

angular.module('modal').controller('modalCtrl', function ($scope, $uibModalInstance, data) {

  // data
  $scope.data = data;

  $scope.ifExist = true;

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
    $uibModalInstance.close($scope.projectName);
  };

  /**
   * Create a new folder
   */
  $scope.createFolder = function () {
    console.log('createFolder modal', $scope.folderName);
    $uibModalInstance.close($scope.folderName);
  };

  /**
   * Create a new file
   */
  $scope.createFile = function () {
    console.log('createFile modal', $scope.fileName);
    $uibModalInstance.close($scope.fileName);

  };

  $scope.saveFile = function () {
    console.log('saveFile modal');
  };

  $scope.cancel = function () {
    console.log('cancel modal');
    $uibModalInstance.dismiss();
  };

  $scope.isExisting = function () {
    if ($scope.data.allFiles[$scope.data.nodeParent.id + '/' + $scope.fileName] || $scope.fileName == "") {
      console.log('file already exist');
      $scope.ifExist = true;
    }else {
      $scope.ifExist = false;
    }
  };
});
