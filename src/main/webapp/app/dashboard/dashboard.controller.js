'use strict';

angular.module('dashboard')
  .controller('dashboardCtrl', ['ProjectsService', '$scope', '$location', '$uibModal', function (ProjectsService, $scope, $location, $uibModal) {
    // data
    $scope.projects = [];

    // methods
    $scope.goToProject = function (projectId) {
      $location.path('/ide/' + projectId);
    };

    $scope.addProject = function () {
      console.log('addProject');
      var modalInstance = $uibModal.open({
        templateUrl: 'app/dashboard/dashboard.modal.html',
        controller: 'dashboardModalCtrl'
      });

      modalInstance.result.then(function (project) {
        console.log('modalInstance.result.then', project);
        ProjectsService.getProjects(function (result) {
            $scope.projects = result;
          })
      })
    };

    // init
    function init() {
      ProjectsService.getProjects(function (result) {
        $scope.projects = result;
      })
    }
    init();
    
  }]);