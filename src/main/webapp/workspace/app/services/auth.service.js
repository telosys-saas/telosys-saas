'use strict';

angular.module('app')
  .factory('AuthService', ['$http', function ($http) {

    var host = '/';

    return {
      status: function () {
        return $http({
          method: 'GET',
          url: host + 'api/v1/profile/user',
          dataType: 'json'
        })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  }]);
 
