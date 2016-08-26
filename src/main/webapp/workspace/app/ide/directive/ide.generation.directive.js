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

        $scope.selectedModelEntitys = {};
        $scope.selectedBundleTemplates = {};
        $scope.displayResultGeneration = null;

        $scope.changeSelectedModel = function () {
          console.log('changeSelectedModel', $scope.selectedModel);
          $scope.modelEntitys = $scope.selectedModel.children;
        };

        $scope.changeSelectedBundle = function () {
          console.log('changeSelectedBundle', $scope.selectedBundle);
          $scope.data.bundles.events.getTemplateForGeneration($scope.selectedBundle.text, function(result) {
            $scope.bundleTemplates = result.data;
          });
        };

        $scope.goToModelEntity = function (fileId) {
          console.log('goToModelEntity', fileId);
          $scope.data.events.onClickFile($scope.data.models, fileId);
        };
        $scope.goToBundleTemplate = function (fileId) {
          console.log('goToBundleTemplate', fileId);
          $scope.data.events.onClickFile($scope.data.bundles, fileId);
        };

        $scope.selectEntity = function(entity) {
          entity.selected = !entity.selected;
        };
        $scope.selectTemplate = function(template) {
          template.selected = !template.selected;
        };

        $scope.submitGeneration = function () {
          $scope.displayResultGeneration = true;
          var generation = {
            model: "",
            entities: [],
            bundle: "",
            templates: []
          };

          if($scope.selectedModel) {
            generation.model = $scope.selectedModel.text;
          }
          for(var index = 0; index < $scope.modelEntitys.length; index++) {
            var entity = $scope.modelEntitys[index];
            if(entity.selected) {
              generation.entities.push(entity.text);
            }
          }

          if($scope.selectedBundle) {
            generation.bundle = $scope.selectedBundle.text;
          }
          for(var index = 0; index < $scope.bundleTemplates.length; index++) {
            var template = $scope.bundleTemplates[index];
            if(template.selected) {
              generation.templates.push(template.name);
            }
          }

          $scope.data.events.generation(generation);
        };

        function init() {
          $scope.displayResultGeneration = false;
        }

        init();
      }
    }
  });