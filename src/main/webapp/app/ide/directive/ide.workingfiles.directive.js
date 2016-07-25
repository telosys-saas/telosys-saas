'use strict';

angular.module('ide').directive('workingfiles', function () {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },

    templateUrl: 'app/ide/directive/ide.workingfiles.directive.html',

    link: function ($scope, element, attrs) {
      $scope.$watchCollection('data.workingFiles', function (newValue, oldValue) {
        if (newValue)
          console.log("workingFiles change");
      }, true);
    },

    controller: ['$scope', function ($scope) {
      $scope.onClickFile = function (file) {
        if ($scope.data.events.onClickFile != null) {
          console.log('working file', $scope.data.selectedFile);
          $scope.data.events.onClickFile(file);
        }
      }

    }]
  }
});
