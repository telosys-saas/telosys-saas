'use strict';

angular.module('ide').directive('workingfiles', function () {
    return {
        restrict: 'E',
        scope: {
            selectedFile: '=',
            workingFiles: '=',
            events: '='
        },
        
        templateUrl: 'app/ide/directive/ide.workingfiles.directive.html',

        link: function ($scope, element, attrs) {
            $scope.$watchCollection('workingFiles', function (newValue, oldValue) {
                if (newValue)
                    console.log("workingFiles change");
            }, true);
        },

        controller: ['$scope', function($scope) {

            $scope.onClickFile = function(file) {
                console.log('onClickFile',file);
                if($scope.events.onClickFile != null) {
                    $scope.events.onClickFile(file);
                }
            }

        }]
    }
});
