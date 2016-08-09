'use strict';

angular.module('app')
  .factory('ModelService', ['$http', function ($http) {

    var host = '/';
    
    return {

      getModels: function (userId, projectName) {
        return $http({
          method: "GET",
          url: host + "api/v1/users/" + userId + "/projects/" + projectName + "/models",
          dataType: 'json'
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      getModel: function(userId, projectName, modelName) {
        return $http({
          method: "GET",
          url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/models/"+modelName,
          dataType: 'json'
        })
          .catch(function (e) {
          console.log(e);
        });
      }
    }
  }]);
