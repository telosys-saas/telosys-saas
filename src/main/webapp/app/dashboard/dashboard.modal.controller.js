'use strict';

angular.module('dashboard').controller('dashboardModalCtrl', ['$scope', '$uibModalInstance', 'ProjectsService',
  function ($scope, $uibModalInstance, ProjectsService) {

    /** authentication */
    $scope.auth = {
      userId: 'user'
    };

  $scope.projectName = "";

  $scope.ok = function () {
    console.log('ok modal', $scope.projectName);
    ProjectsService.createProject($scope.auth.userId,$scope.projectName)
      .then(function () {
        $uibModalInstance.close();
      });
  };

  $scope.cancel = function () {
    console.log('cancel modal');
    $uibModalInstance.dismiss();
  };

}]);
