'use strict';

angular.module('dashboard')
.controller('dashboardCtrl', ['ProjectsService', '$scope', '$location', function(ProjectsService, $scope, $location) {
    // data
    $scope.projects = [];
    
    // methods
    $scope.goToProject = function (projectId) {
        $location.path('/ide/'+projectId);
    };

    // init
    function init() {
        ProjectsService.getProjects(function(result) {
            $scope.projects = result;
        })
        
    }
    init();
}]);