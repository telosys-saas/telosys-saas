'use strict';

angular.module('ide').
controller('ideCtrl',['ProjectsService', 'FilesService', '$scope', '$routeParams', function (ProjectsService, FilesService, $scope, $routeParams) {
    // data
    $scope.initialized = false;
    $scope.data = {
        project: {},
        tree: {},
        events: {},
        workingFiles: {
            'toto': {
                id:'toto', name:'toto.txt'
            }
        }
    };

    function defineEvents(data) {
        data.events.addFile = function(file) {
            console.log(file);
            data.workingFiles[file.id] = file;
            data.workingFiles = 'toto'
            console.log('defineEvents',$scope.data);
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
