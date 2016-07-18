'use strict';

angular.module('ide').
    controller('ideCtrl',['ProjectsService', 'FilesService', '$scope', '$routeParams', function (ProjectsService, FilesService, $scope, $routeParams) {
    
        // data
        $scope.project = {};
        $scope.folder = {};
        
        // init
        function init(){
            ProjectsService.getProjectById($routeParams.projectId, function (result){
                $scope.project = result;
                console.log($scope.project);
            });
            
        }
        init();
}]);
