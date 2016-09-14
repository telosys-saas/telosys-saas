'use strict';

angular.module('app')
  .factory('ProjectsService', ['$http', function ($http) {

    var getContextPath = function () {
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
    };

    var host = getContextPath();
    
    return {

      /**
       * Get the list of all projects
       * @param userId User ID
       */
      getProjects: function (userId) {
        return $http({
          method: 'GET',
          url: host + '/api/v1/users/' + userId + '/projects'
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      /**
       * Get the project with the projectId
       * @param userId User ID
       * @param projectId Project ID
       */
      getProjectById: function (userId, projectId) {
        return $http({
          method: 'GET',
          url: host + '/api/v1/users/' + userId + '/projects/' + projectId
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      /**
       * Create a new project
       * @param userId User ID
       * @param projectName new Project name
       */
      createProject: function (userId, projectName) {
        return $http({
          method: "PUT",
          url: host + "/api/v1/users/" + userId + "/projects/" + projectName,
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify({
            id: projectName,
            name: projectName
          })
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      /**
       * Launch the code generation
       * @param userId User ID
       * @param projectName Current project Name
       * @param generation
       */
      launchGeneration: function (userId, projectName, generation) {
        return $http({
          method: "PUT",
          url: host + "/api/v1/users/" + userId + "/projects/" + projectName + "/action/generate",
          dataType: 'json',
          data: JSON.stringify(generation)
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      /**
       * Download the project in a ZIP file
       * @param userId User ID
       * @param projectName Project name
       */
      downloadZip: function (userId, projectName) {
        document.location = host + "/api/v1/users/" + userId + "/projects/" + projectName + "/zip";
      },

      /**
       * Get the configuration of the current project
       * @param userId USER ID
       * @param projectName Name of the current project
       */
      getProjectConfiguration: function (userId, projectName) {
        return $http({
          method: 'GET',
          url: host + "/api/v1/users/" + userId + "/projects/" + projectName + "/configuration",
          dataType: 'json'
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      /**
       * Save the configuration of the project
       * @param userId User ID
       * @param projectName Name of the current project
       * @param projectConfiguration The configuration of the project
       */
      saveProjectConfiguration: function (userId, projectName, projectConfiguration) {
        if (projectConfiguration && projectConfiguration.variables && projectConfiguration.variables.specificVariables) {
          projectConfiguration.variables.specificVariables = JSON.stringify(projectConfiguration.variables.specificVariables);
        }

        return $http({
          method: "PUT",
          url: host + "/api/v1/users/" + userId + "/projects/" + projectName + "/configuration",
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(projectConfiguration)
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      /**
       * Get the list template given a bundle name
       * @param userId user ID
       * @param projectName Name of the current project
       * @param bundleName Bundle name
       */
      getTemplateForGeneration: function (userId, projectName, bundleName) {
        return $http({
          method: 'GET',
          url: host + "/api/v1/users/" + userId + "/projects/" + projectName + "/templates/" + bundleName,
          dataType: 'json'
        })
          .catch(function (e) {
            console.log('getTemplateForGeneration', e);
          });
      }
    }
  }]);
