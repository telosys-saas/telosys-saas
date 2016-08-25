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
            console.log(e);
          });
      },

      /**
       * Change the current password of the user
       * @param login User login
       * @param oldPassword Old password
       * @param password NEw password
       * @returns {*}
       */
      changePassword: function (login, oldPassword, password) {
        return $http({
          method: "PUT",
          url: host + "api/v1/users/" + login + "/action/changePassword",
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify({
            oldPassword: oldPassword,
            password: password
          })
        })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  }]);
 
