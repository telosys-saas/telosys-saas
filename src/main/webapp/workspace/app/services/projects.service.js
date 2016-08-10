'use strict';

angular.module('app')
  .factory('ProjectsService', ['$http', function ($http) {

    var host = '/';

    return {
      
      /**
       * Get the list of all projects
       * @param callback Callback function
       * @param userId User ID
       * @returns {*}
       */
      getProjects: function (userId) {
        return $http({
          method: 'GET',
          url: host + 'api/v1/users/' + userId + '/projects'
        })
      },

      /**
       * Get the project with the projectId
       * @param userId User ID
       * @param projectId Project ID
       * @param callback Callback
       * @returns {*}
       */
      getProjectById: function (userId, projectId) {
        return $http({
          method: 'GET',
          url: host + 'api/v1/users/' + userId + '/projects/' + projectId
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      /**
       * Create a new project
       * @param userId User ID
       * @param projectName new Project name
       * @returns {*}
       */
      createProject: function (userId, projectName) {
        return $http({
          method: "PUT",
          url: host + "api/v1/users/" + userId + "/projects/" + projectName,
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
       * @returns {*}
       */
      launchGeneration: function (userId, projectName, generation) {
        return $http({
          method: "PUT",
          url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/action/generate",
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
        document.location = host + "api/v1/users/" + userId + "/projects/" + projectName + "/zip";
      }
    }
  }]);
