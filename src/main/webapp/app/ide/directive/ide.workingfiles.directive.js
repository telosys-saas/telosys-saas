'use strict';

angular.module('ide').directive('workingfiles', function () {
    return {
        restrict: 'E',
        scope: {
           data: '='
        },
        templateUrl: 'app/ide/directive/ide.workingfiles.directive.html',
        link: function ($scope, element, attrs) {
            $scope.$watchCollection('data', function(newValue, oldValue) {
                if (newValue)
                    console.log("I see a data change!");
            }, true);
/*
            function display() {

            }
            display();
            */
        }
    }
});
