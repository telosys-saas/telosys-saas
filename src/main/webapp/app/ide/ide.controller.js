'use strict';

angular.module('ide').
controller('ideCtrl',['ProjectsService', 'FilesService', '$scope', '$routeParams', function (ProjectsService, FilesService, $scope, $routeParams) {
    // data
    $scope.initialized = false;
    $scope.data = {
        project: {},
        tree: {},
        events: {},
        workingFiles: {}
        };

    $scope.addFile = function(file) {
        //console.log(file);
        $scope.data.workingFiles[file.id] = file;
        $scope.$apply();
    };

    function defineEvents() {
        $scope.data.events = {
            addFile: $scope.addFile
        }
    }
    
    // init
    function init(){
        defineEvents($scope.data);
        ProjectsService.getProjectById($routeParams.projectId, function (result){
            $scope.data.project = result;
            FilesService.getFilesForProject('', $routeParams.projectId, function (result) {
                $scope.data.tree = FilesService.convertFolderToJson(result, null, null);
                $scope.initialized = true;
            })
        });
    }
    init();
}]);
