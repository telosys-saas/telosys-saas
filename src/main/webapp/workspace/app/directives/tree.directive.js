'use strict';

/**
 * Generation view
 */
angular.module('directives')
  .directive('tree', function () {
    return {
      scope: {
        name: '=',
        elts: '='
      },
      templateUrl: 'app/directives/tree.directive.html',

      link: function ($scope) {

        $scope.init = function () {
          $scope.elts = [
            {
              id: 'elt-1', name: 'elt1', label: 'Element 1', elts: [
              {id: 'elt-1-1', name: 'elt11', label: 'Element 1.1'},
              {id: 'elt-1-2', name: 'elt12', label: 'Element 1.2'},
              {id: 'elt-1-3', name: 'elt13', label: 'Element 1.3'}
            ]
            },
            {
              id: 'elt-2', name: 'elt2', label: 'Element 2', elts: [
              {id: 'elt-2-1', name: 'elt21', label: 'Element 2.1'},
              {id: 'elt-2-2', name: 'elt22', label: 'Element 2.2'},
              {id: 'elt-2-3', name: 'elt23', label: 'Element 2.3'}
            ]
            }
          ];

          for (var i = 0; i < $scope.elts.length; i++) {
            var elt = $scope.elts[i];
            for (var j = 0; j < elt.elts.length; j++) {
              var subelt = elt.elts[j];
              subelt.parent = elt;
            }
          }
        };

        $scope.onchange = function (elt, isChecked) {
          console.log('onchange', elt.id, isChecked, elt.isSelected);
          elt.isSelected = isChecked;

          // select children
          if (elt.elts instanceof Array) {
            for (var i = 0; i < elt.elts.length; i++) {
              var subelt = elt.elts[i];
              $scope.selectChild(subelt, isChecked);
            }
          }
        };

        $scope.selectChild = function(elt, isChecked) {
          elt.isChecked = isChecked;
          elt.isSelected = isChecked;

          // select children
          if (elt.elts instanceof Array) {
            for (var i = 0; i < elt.elts.length; i++) {
              var subelt = elt.elts[i];
              $scope.selectChild(subelt, isChecked);
            }
          }
        };

        $scope.isSelected = function (elt) {
          if (elt.elts instanceof Array) {
            var hasOneSelected = false;
            var isAllSelected = true;
            for (var i = 0; i < elt.elts.length; i++) {
              var subelt = elt.elts[i];
              if (!subelt) continue;
              if (subelt.isSelected) {
                hasOneSelected = true;
              }
              if (!subelt.isSelected) {
                isAllSelected = false;
              }
            }
            return hasOneSelected && isAllSelected;
          } else {
            return false;
          }
        };

        $scope.isIndeterminate = function (elt) {
          if (elt.elts instanceof Array) {
            var hasOneChecked = false;
            var isAllChecked = true;
            for (var i = 0; i < elt.elts.length; i++) {
              var subelt = elt.elts[i];
              if (!subelt) continue;
              if (subelt.isSelected) {
                hasOneChecked = true;
              }
              if (!subelt.isSelected) {
                isAllChecked = false;
              }
            }
            return hasOneChecked && !isAllChecked;
          } else {
            return false;
          }
        };

        $scope.init();
      }
    }
  });
