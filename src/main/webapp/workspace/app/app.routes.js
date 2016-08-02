'use strict';

angular.module('app')
  .config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/error', {
          templateUrl: 'app/error.html'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }
  ]);