'use strict';

angular.module('dashboard')
  .controller('dashboardCtrl', ['AuthService', 'ProjectsService', '$scope', '$location', '$uibModal',
    function (AuthService, ProjectsService, $scope, $location, $uibModal) {

      /** Profile of the authenticated user */
      $scope.profile = {};

      /** authentication */
      $scope.data = {

        /**
         * Projects list
         */
        projects: [],

        /** the host of the app */
        host: "",

        /** Indicates if the IDE is initialized and could be displayed */
        initialized: false
      };

      function getContextPath() {
        var context = window.location.pathname.split('/');
        var contextPath = "";
        for (var index = 0; index < context.length; index++) {
          if (context[index] == "workspace") {
            break;
          }
          if (context[index] != "") {
            contextPath += '/' + context[index];
          }
        }
        return contextPath;
      }

      /**
       * Init the dashboard toolbar
       */
      function init() {
        // Check authentication
        AuthService.status()
          .then(function (result) {
            console.log('authentication:', result.data);
            $scope.profile = result.data;
            if (!$scope.profile.authenticated) {
              document.location = '../login.jsp';
              return {};
            }
            $scope.data.host = getContextPath();
            // Get the list of projects
            return ProjectsService.getProjects($scope.profile.userId);
          })
          .then(function (result) {
            $scope.data.projects = result.data;
          })
          .catch(function (e) {
            console.log(e);
            document.location = '../login.jsp';
          });
      }

      init();

    }]);