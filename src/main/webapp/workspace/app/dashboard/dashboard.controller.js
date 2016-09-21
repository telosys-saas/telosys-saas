'use strict';

angular.module('dashboard')
  .controller('dashboardCtrl', ['AuthService', 'ProjectsService', '$scope', '$location', '$uibModal',
    function (AuthService, ProjectsService, $scope, $location, $uibModal) {

      /** Profile of the authenticated user */
      $scope.profile = {};

      function initData() {
        /** Data for dashboard */
        $scope.data = {

          /**
           * Projects list
           */
          projects: [],

          events: getCommonEvents(),

          /** The host of the app */
          host: "",

          /** Indicates if the IDE is initializedIDE and could be displayed */
          initialized: false
        };
      }
      /**
       * Common events
       */
      function getCommonEvents() {
        return {
          refreshProjects: $scope.refreshProjects
        };
      }

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
       * Go to the projectID
       * @param projectId
       */
      $scope.goToProject = function (projectId) {
        // Change the url path
        $location.path('/ide/' + projectId);
      };

      /**
       * Open the modal to create a new project
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

      /**
       * Refresh the list of projects
       */
      $scope.refreshProjects = function () {
        ProjectsService.getProjects($scope.profile.userId)
          .then(function (result) {
            $scope.data.projects = result.data;
          })
      };

      /**
       * Init the dashboard
       */
      function init() {
        initData();
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

    }

  ]);