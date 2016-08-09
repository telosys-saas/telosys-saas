'use strict';

angular.module('ide').directive('workingfiles', function () {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },

    templateUrl: 'app/ide/directive/ide.workingfiles.directive.html',

    link: function($scope) {
      $scope.events = $scope.data.events;
    },

    controller: ['$scope', function ($scope) {

      /**
       * Select a file
       * @param file File to select
       */
      $scope.onClickFile = function (file) {
        if ($scope.events.onClickFile != null) {
          $scope.events.onClickFile($scope.data, file.id);
        }
      }

    }]
  }
});
