'use strict';

/**
 * Checkbox view
 */
angular.module('directives')
  .directive('checkbox2', function () {
    return {
      scope: {
        htmlId: '=',
        name: '=',
        label: '=',
        checked: '=',
        indeterminate: '=',
        onchange: '=',
        elt: '='
      },
      templateUrl: 'app/directives/checkbox2.directive.html',

      link: function ($scope, element, attrs) {

        $scope.change = function() {
          console.log('change:',$scope);
          $scope.onchange($scope.elt, $scope.checked);
        };

        $scope.$watch('checked', function() {
          setState()
        });

        $scope.$watch('indeterminate', function() {
          setState();
        });

        function setState() {
          if(!$scope.checked && $scope.indeterminate) {
            var checkbox = $(element[0].children[0]);
            checkbox.prop("indeterminate", true);
          } else {
            var checkbox = $(element[0].children[0]);
            checkbox.prop("indeterminate", false);
          }
        }
      }
    }
  });