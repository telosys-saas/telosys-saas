'use strict';

/**
 * Table for generation view
 */
angular.module('ide')
  .directive('generationtable', function () {
    return {
      scope: {
        data: '=',
        selectedGeneration: '='
      },

      templateUrl: 'app/ide/directive/ide.generationtable.directive.html',

      link: function ($scope, element, attrs) {

        // The selected Model
        $scope.selectedModel = {};
        // The selected element
        $scope.selectedElement = {};

        $scope.changeSelectedElement = function () {
          console.log('changeSelectedElement', $scope.selectedElement.text);
          if ($scope.data.name == 'bundles') {
            if (element == "") {
              $scope.selectedGeneration.bundle = "";
              $scope.data.templatesForGeneration = null;
              return;
            }
            if ($scope.data.events.getTemplateForGeneration) {
              $scope.data.events.getTemplateForGeneration($scope.selectedElement.text);
              $scope.selectedGeneration.bundle = $scope.selectedElement.text;
              return;
            }
          }
          if ($scope.data.name == 'models') {
            if (!element) {
              $scope.selectedGeneration.model = "";
              $scope.selectedModel = null;
              return;
            }
            $scope.selectedGeneration.model = $scope.selectedElement.text;
            $scope.selectedModel = element;
            $scope.selectedModel.entities = $scope.selectedElement.children;
          }
        };

        $scope.goToFile = function (fileId) {
          console.log('goToFile', fileId);
          $scope.data.events.onClickFile($scope.data, fileId);
        };

        $scope.goToBundleConfiguration = function () {
          if($scope.selectedGeneration.bundle || $scope.selectedGeneration.bundle != "") {
            var fileId = 'TelosysTools/templates/' + $scope.selectedGeneration.bundle + '/templates.cfg';
            $scope.goToFile(fileId);
          }
        };

        $scope.onSelect = function (element) {
          if (element.type == 'template') {
            if (element.selected) {
              $scope.selectedGeneration.templates.push(element.name);
            } else {
              var index = $scope.selectedGeneration.templates.indexOf(element.name);
              $scope.selectedGeneration.templates.splice(index, 1);
            }
          }
          if (element.type == 'entity') {
            if (element.selected) {
              $scope.selectedGeneration.entities.push(element.text);
            } else {
              var index = $scope.selectedGeneration.entities.indexOf(element.name);
              $scope.selectedGeneration.entities.splice(index, 1);
            }
          }
        };

        $scope.selectAll = function () {
          if ($scope.data.name == 'bundles') {
            if ($scope.data.templatesForGeneration) {
              for (var index = 0; index < $scope.data.templatesForGeneration.length; index++) {
                $scope.data.templatesForGeneration[index].selected = true;
                $scope.onSelect($scope.data.templatesForGeneration[index]);
              }
            }
          }
          if ($scope.data.name == 'models') {
            if($scope.selectedModel) {
              for (var index = 0; index < $scope.selectedModel.entities.length; index++) {
                $scope.selectedModel.entities[index].selected = true;
                $scope.onSelect($scope.selectedModel.entities[index]);
              }
            }
          }
        };

        $scope.deselectAll = function () {
          if ($scope.data.name == 'bundles') {
            if($scope.data.templatesForGeneration) {
              for (var index = 0; index < $scope.data.templatesForGeneration.length; index++) {
                $scope.data.templatesForGeneration[index].selected = false;
                $scope.onSelect($scope.data.templatesForGeneration[index]);
              }
            }
          }
          if ($scope.data.name == 'models') {
            if ($scope.selectedModel) {
              for (var index = 0; index < $scope.selectedModel.entities.length; index++) {
                $scope.selectedModel.entities[index].selected = false;
                $scope.onSelect($scope.selectedModel.entities[index]);
              }
            }
          }
        }
      }
    }
  });
