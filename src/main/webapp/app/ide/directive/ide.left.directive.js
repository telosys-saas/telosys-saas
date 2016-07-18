'use strict';

angular.module('ide').
    directive('left', ['FilesService', function (FilesService) {
   return {
       scope : {
           folder : '='
       },
       templateUrl : 'app/ide/directive/ide.left.directive.html',

       link : function($scope){
           $scope.rootTree = {};
           function init() {
               FilesService.getFilesForProject('', '', function (result) {
                   $scope.rootTree = FilesService.convertFolderToJson(result, null, null);
                   console.log($scope.rootTree);
               })
           }
           init();
       }
   };
}]);
