'use strict';

angular.module('app')
  .factory('BundlesService', ['$http', function ($http) {

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

      getBundlesOfProject: function (userId, projectName) {
        return $http({
          method: 'GET',
          url: host + "/api/v1/users/"+userId+"/projects/"+projectName+"/bundles",
          dataType: 'json'
        })
          .catch(function (e) {
            console.log(e);
          });
      },
      
      /**
       * Get the public bundles from github
       * @returns {*}
       */
      getBundlesInPublicRepository: function (githubRepository) {
        return $http({
          method: 'GET',
          url: host + "/api/v1/bundles/"+githubRepository,
          dataType: 'json'
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      /**
       * Add a bundle to the project
       */
      addBundle: function (userId, projectName, githubUserName, bundleName) {
        return $http({
          method: "PUT",
          url: host + "/api/v1/users/" + userId + "/projects/" + projectName + "/bundles/" + githubUserName + "/" + bundleName,
          dataType: 'json'
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      removeBundle: function (userId, projectName, bundleName) {
        return $http({
          method: "DELETE",
          url: host + "/api/v1/users/"+userId+"/projects/"+projectName+"/bundles/"+bundleName,
          dataType: 'json'
        })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  }]);