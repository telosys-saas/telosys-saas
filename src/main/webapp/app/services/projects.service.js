'use strict';

angular.module('app')
    .factory('ProjectsService', ['$http', function ($http) {

      var host = '';

        return {
            getProjects: function (callback) {
                 return $http({
                    method: 'GET',
                    url: 'api/v1/users/user/projects'
                })
                    .then(function (result) {
                        if (callback) callback(result.data);
                    })
            },

            getProjectById: function (projectId, callback) {
              return $http({
                    method: 'GET',
                    url: 'api/v1/users/user/projects/' + projectId
                })
                    .then(function (result) {
                        if (callback) {
                            callback(result.data);
                        }
                    })
            },

          createProject: function (userId, projectName) {
            return $http({
              method: "PUT",
              url: host + "api/v1/users/"+userId+"/projects/"+projectName,
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
          }
        }
    }]);
