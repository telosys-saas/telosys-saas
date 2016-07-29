'use strict';

angular.module('dashboard')
  .controller('dashboardCtrl', ['ProjectsService', '$scope', '$location', '$uibModal',
    function (ProjectsService, $scope, $location, $uibModal) {

      /**
       * Projects list
       */
      $scope.projects = [];

      /**
       * Go to the projectID
       * @param projectId
       */
      $scope.goToProject = function (projectId) {
        // Change the url path
        $location.path('/ide/' + projectId);
      };

      /**
       * Create a new project
       */
      $scope.addProject = function () {
        console.log('addProject');
        // Modal window to create a new project
        var modalInstance = $uibModal.open({
          templateUrl: 'app/modal/modal.createproject.html',
          controller: 'modalCtrl',
          resolve: {
            data: {}
          }
        });
        modalInstance.result.then(function (project) {
          // When the creation is a success
          console.log('modalInstance.result.then', project);
          $scope.projects.push(project);
        })
      };

      /**
       * Init the dashboard toolbar
       */
      function init() {
        ProjectsService.getProjects(function (result) {
          $scope.projects = result;
        })
      }
      init();

    }]);