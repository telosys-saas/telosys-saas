'use strict';

angular.module('ide').directive('left', function () {
  return {
    scope: {
      data: '='
    },

    controller: ['$scope', function ($scope) {}],
    templateUrl: 'app/ide/directive/ide.left.directive.html',
    link: function ($scope, element, attrs) {
      $scope.events = $scope.data.events;
    }
  };
});
