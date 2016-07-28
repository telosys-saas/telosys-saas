'use strict';

angular.module('dashboard')
  .controller('dashboardCtrl', ['ProjectsService', '$scope', '$location', '$uibModal', function (ProjectsService, $scope, $location, $uibModal) {
    /**
     * Projects list
     */
    $scope.projects = [];

    // methods
    $scope.goToProject = function (projectId) {
      $location.path('/ide/' + projectId);
    };

    $scope.addProject = function () {
      console.log('addProject');
      var modalInstance = $uibModal.open({
        templateUrl: 'app/modal/modal.createproject.html',
        controller: 'modalCtrl'
      });

      modalInstance.result.then(function (project) {
        console.log('modalInstance.result.then', project);
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