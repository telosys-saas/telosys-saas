'use strict';

angular.module('app')
  .factory('TelosysService', ['$http', function ($http) {

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
       * Get the Telosys folder
       * @param userId the authenticated user
       * @param projectId Project ID
       * @returns {*}
       */
      getTelosysFolderForProject: function (userId, projectId) {
        return $http({
          method: 'GET',
          url: host + "/api/v1/users/" + userId + "/projects/" + projectId + "/telosys",
          dataType: 'json'
        })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  }]);
