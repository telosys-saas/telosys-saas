'use strict';

angular.module('dashboard')
    .directive('project', ['ProjectsService', function() {
        return {
            restrict: 'E',
            scope: {
                project : '='
            },
            templateUrl: '/app/dashboard/dashboard.project.directive.html'
        };
    }]);