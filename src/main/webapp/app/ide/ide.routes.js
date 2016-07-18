'use strict';

angular.module('ide')
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/ide/:projectId', {
                    templateUrl: 'app/ide/ide.html',
                    controller: 'ideCtrl'
                });
        }
    ]);