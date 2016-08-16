'use strict';

/**
 * Tree for generation view
 */
angular.module('directives')
  .directive('tree', function () {
    return {
      scope: {
        name: '=',
        data: '='
      },
      templateUrl: 'app/directives/tree.directive.html',

      link: function ($scope) {

        $scope.selectedElement = {};

        $scope.init = function () {
          $scope.elts = [];
          for (var parentIndex = 0; parentIndex < $scope.data.tree.length; parentIndex++) {
            var rootNode = {
              id: $scope.data.tree[parentIndex].id,
              name: $scope.data.tree[parentIndex].text,
              label: $scope.data.tree[parentIndex].text,
              type: $scope.data.tree[parentIndex].type,
              elts: []

            };
            $scope.elts.push(rootNode);
            convertDataToTree(parentIndex);
          }
          if ($scope.elts[0]) {
            $scope.selectedElement = $scope.elts[0];
          }
          console.log('$scope.elts :', $scope.elts);
        };

        function convertDataToTree(parentIndex) {
          for (var childIndex = 0; childIndex < $scope.data.tree[parentIndex].children.length; childIndex++) {
            var childNode = $scope.data.tree[parentIndex].children[childIndex];
            var elt = {
              id: childNode.id,
              name: childNode.text,
              label: childNode.text,
              type: childNode.type,
              parent: $scope.elts[parentIndex]
            };
            $scope.elts[parentIndex].elts.push(elt);
          }
        }

        $scope.onchange = function (elt, isChecked) {
          console.log('onchange', elt.id, isChecked, elt.isSelected);
          elt.isSelected = isChecked;
          if($scope.data.allFiles[elt.id]) {
            $scope.data.allFiles[elt.id].isSelectedForGeneration = elt.isSelected;
          }
          // select children
          if (elt.elts instanceof Array) {
            for (var i = 0; i < elt.elts.length; i++) {
              var subelt = elt.elts[i];
              $scope.selectChild(subelt, isChecked);
            }
          }
        };

        $scope.selectChild = function (elt, isChecked) {
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

        $scope.changeSelectedElement = function (element) {
          console.log('changeSelectedElement', element);
          $scope.selectedElement = element;
        };

        $scope.init();
      }
    }
  });
