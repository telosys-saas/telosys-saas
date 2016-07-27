'use strict';

angular.module('ide').directive('workingfiles', function () {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },

    templateUrl: 'app/ide/directive/ide.workingfiles.directive.html',

    controller: ['$scope', function ($scope) {
      
      /**
       * Select a file
       * @param file File to select
       */
      $scope.onClickFile = function (file) {
        if ($scope.data.events.onClickFile != null) {
          $scope.data.events.onClickFile(file.id);
        }
      }

    }]
  }
});
