angular.module('dashboard')
    .directive('projects', ['ProjectsService', function(ProjectsService) {
        return {
            restrict: 'E',
            scope: {

            },
            template: '<div ng-repeat="project in projects"><project project="project"/></div>',
            link: function($scope, element, attrs) {
                $scope.projects = [];
                function init() {
                    ProjectsService.getProjects(function(result) {
                        $scope.projects = result;
                    })
                }
                init();
            }
        };
    }]);