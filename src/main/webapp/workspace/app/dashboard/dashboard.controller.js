'use strict';

angular.module('dashboard')
  .controller('dashboardCtrl', ['AuthService','ProjectsService', '$scope', '$location', '$uibModal',
    function (AuthService, ProjectsService, $scope, $location, $uibModal) {

      /** authentication */
      $scope.data = {
        /** Profile of the authenticated user */
        profile: {},

        /**
         * Projects list
         */
        projects: [],

        /** the host of the app */
        host : ""
    };

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
       $uibModal.open({
          templateUrl: 'app/modal/modal.createproject.html',
          controller: 'modalCtrl',
          resolve: {
            data: {}
          }
        });
      };

      function getContextPath() {
        var context = window.location.pathname.split('/');
        var contextPath = "";
        for (var index = 0; index < context.length; index++) {
          if(context[index] == "workspace") {
            break;
          }
          if(context[index] != "") {
            contextPath += '/' + context[index];
          }
        }
        return contextPath;
      }

      /**
       * Init the dashboard toolbar
       */
      function init() {
        AuthService.status()
          .then(function (result) {
            console.log('authentication:', result.data);
            $scope.data.profile = result.data;
            if (!$scope.data.profile.authenticated) {
              document.location = '../login.jsp';
              return {};
            }
            $scope.data.host = getContextPath();
            return ProjectsService.getProjects($scope.data.profile.userId);
          })
          .then(function (result) {
            $scope.data.projects = result.data;
          })
          .catch(function(e) {
            console.log(e);
            document.location = '../login.jsp';
          });
      }
      init();

    }]);