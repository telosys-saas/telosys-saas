'use strict';

angular.module('app')
  .factory('BundlesService', ['$http', function ($http) {

    var host = '/';

    return {

      /**
       * Get the public bundles from github
       * @returns {*}
       */
      getBundlesInPublicRepository: function () {
        return $http({
          method: 'GET',
          url: host + "api/v1/bundles",
          dataType: 'json'
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      /**
       * Get bundles files
       */
      getBundlesFiles: function (userId, projectName) {
        return $http({
          method: "GET",
          url: host + "api/v1/users/" + userId + "/projects/" + projectName + "/bundles",
          dataType: 'json'
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      /**
       * Add a bundle to the project
       */
      addBundle: function (userId, projectName, bundleName) {
        return $http({
          method: "PUT",
          url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/bundles/"+bundleName,
          dataType: 'json'
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      removeBundle: function (userId, projectName, bundleName) {
        return $http({
          method: "DELETE",
          url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/bundles/"+bundleName,
          dataType: 'json'
        })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  }]);