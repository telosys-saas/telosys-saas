'use strict';

angular.module('dashboard')
  .controller('dashboardCtrl', ['AuthService','ProjectsService', '$scope', '$location', '$uibModal',
    function (AuthService, ProjectsService, $scope, $location, $uibModal) {

      /** authentication */
      $scope.profile = {};
      
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
      };

      /**
       * Init the dashboard toolbar
       */
      function init() {
        AuthService.status()
          .then(function (result) {
            console.log('authentication:', result.data);
            $scope.profile = result.data;
            if (!$scope.profile.authenticated) {
              $location.path('/error');
              return {};
            }
            return ProjectsService.getProjects($scope.profile.userId);
          })
          .then(function (result) {
            $scope.projects = result.data;
          })
          .catch(function(e) {
            console.log(e);
            $location.path('/error');
          });
      }
      init();

    }]);