'use strict';

angular.module('app')
    .factory('ProjectsService', ['$http', function ($http) {

        return {
            getProjects: function (callback) {
                $http({
                    method: 'GET',
                    url: 'api/v1/users/user/projects'
                })
                    .then(function (result) {
                        if (callback) callback(result.data);
                    })
            },

            getProjectById: function (projectId, callback) {
                $http({
                    method: 'GET',
                    url: 'api/v1/users/user/projects/'+projectId
                })
                    .then(function (result) {
                        if (callback){
                            callback(result.data);
                        }
                    })
            }
        }
    }]);
