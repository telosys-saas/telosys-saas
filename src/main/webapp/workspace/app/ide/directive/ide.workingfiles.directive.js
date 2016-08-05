'use strict';

angular.module('ide').directive('workingfiles', function () {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      events: '='
    },

    templateUrl: 'app/ide/directive/ide.workingfiles.directive.html',

    controller: ['$scope', function ($scope) {
      
      /**
       * Select a file
       * @param file File to select
       */
      $scope.onClickFile = function (file) {
        if ($scope.events.onClickFile != null) {
          $scope.events.onClickFile(file.id);
        }
      }

    }]
  }
});
