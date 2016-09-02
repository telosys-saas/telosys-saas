'use strict';

angular.module('app')
  .factory('AuthService', ['$http', function ($http) {

    var host = '/';

    return {

      /**
       * Get the status authentication
       * @returns {*}
       */
      status: function () {
        return $http({
          method: 'GET',
          url: host + 'api/v1/profile/user',
          dataType: 'json'
        })
          .catch(function (e) {
            console.log('AuthService.status',e);
          });
      },

      /**
       * Change the current password of the user
       * @param login User login
       * @param changePassword Old and New password
       * @returns {*}
       */
      changePassword: function (login, changePassword) {
        return $http({
          method: "PUT",
          url: host + "api/v1/users/" + login + "/action/changePassword",
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(changePassword)
        })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  }]);
 
