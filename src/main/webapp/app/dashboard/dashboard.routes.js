'use strict';

angular.module('dashboard')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/dashboard', {
                    templateUrl: 'app/dashboard/dashboard.html',
                    controller: 'dashboardCtrl'
                });
        }
    ]);