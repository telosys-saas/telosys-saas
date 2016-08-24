'use strict';

/**
 * Generation view
 */
angular.module('ide')
  .directive('generation', function () {
    return {
      
      scope : {
        data: '='
      },
      
      templateUrl: 'app/ide/directive/ide.generation.directive.html',

      link: function ($scope, element, attrs) {
        
        $scope.submitGeneration = function () {
         $scope.data.events.generation();
        };
      }
    }
  });