'use strict';

angular.module('app')
  .factory('TelosysService', ['$http', function ($http) {

      var host = '/telosys-saas/';
    
    return {
        
      /**
       * Get the Telosys folder
       * @param userId the authenticated user
       * @param projectId Project ID
       * @returns {*}
       */
      getTelosysFolderForProject: function (userId, projectId) {
        return $http({
          method: 'GET',
          url: host + "api/v1/users/" + userId + "/projects/" + projectId + "/telosys",
          dataType: 'json'
        })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  }]);
