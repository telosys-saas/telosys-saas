'use strict';

angular.module('toolbar')
    .controller('toolbarCtrl', ['$scope', function($scope) {
        
        
        $scope.changeProject = function(projectId){
            if(projectId != $scope.projectId) {
                $scope.projectId = projectId;
            }
        }
    }]);
