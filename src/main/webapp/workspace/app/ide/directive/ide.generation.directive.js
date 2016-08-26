'use strict';

/**
 * Generation view
 */
angular.module('ide')
  .directive('generation', function () {
    return {
      scope: {
        data: '='
      },

      templateUrl: 'app/ide/directive/ide.generation.directive.html',

      link: function ($scope, element, attrs) {

        // Model and Entity function
        $scope.changeSelectedModel = function () {
          console.log('changeSelectedModel', $scope.data.generation.selectedModel);
          $scope.data.generation.selectedModelEntitys = $scope.data.generation.selectedModel.children;
          $scope.selectAllEntity();
          $scope.data.generation.model = $scope.data.generation.selectedModel.text;
        };

        $scope.goToModelEntity = function (fileId) {
          console.log('goToModelEntity', fileId);
          $scope.data.events.onClickFile($scope.data.models, fileId);
        };

        $scope.selectEntity = function (entity) {
          entity.selected = !entity.selected;
          if (entity.selected) {
            $scope.data.generation.entities.push(entity.text);
          } else {
            var index = $scope.data.generation.entities.indexOf(entity.name);
            if (index) {
              $scope.data.generation.entities.splice(index, 1);
            }
          }
        };

        $scope.selectAllEntity = function () {
          $scope.deselectAllEntity();
          if ($scope.data.generation.selectedModel) {
            for (var index = 0; index < $scope.data.generation.selectedModelEntitys.length; index++) {
              var entity = $scope.data.generation.selectedModelEntitys[index];
              entity.selected = false;
              $scope.selectEntity(entity);
            }
          }
        };

        $scope.deselectAllEntity = function () {
          if ($scope.data.generation.selectedModelEntitys) {
            for (var index = 0; index < $scope.data.generation.selectedModelEntitys.length; index++) {
              var entity = $scope.data.generation.selectedModelEntitys[index];
              entity.selected = true;
              $scope.selectEntity(entity);
            }
          }
        };

        // Bundle and Template function
        $scope.changeSelectedBundle = function () {
          console.log('changeSelectedBundle', $scope.data.generation.selectedBundle);
          $scope.data.bundles.events.getTemplateForGeneration($scope.data.generation.selectedBundle.text, function (result) {
            $scope.data.generation.selectedBundleTemplates = result.data;
            $scope.data.generation.bundle = $scope.data.generation.selectedBundle.text;
          });
        };

        $scope.goToBundleTemplate = function (fileId) {
          console.log('goToBundleTemplate', fileId);
          $scope.data.events.onClickFile($scope.data.bundles, fileId);
        };

        $scope.goToBundleConfiguration = function () {
          if($scope.data.generation.selectedGeneration.bundle || $scope.data.generation.selectedGeneration.bundle != "") {
            var fileId = 'TelosysTools/templates/' + $scope.data.generation.selectedGeneration.bundle + '/templates.cfg';
            $scope.goToFile(fileId);
          }
        };


        $scope.selectTemplate = function (template) {
          template.selected = !template.selected;
          if (template.selected) {
            $scope.data.generation.templates.push(template.name);
          } else {
            var index = $scope.data.generation.templates.indexOf(template.name);
            if (index) {
              $scope.data.generation.templates.splice(index, 1);
            }
          }
        };

        $scope.selectAllTemplate = function () {
          $scope.deselectAllTemplate();
          if ($scope.data.generation.selectedBundleTemplates) {
            for (var index = 0; index < $scope.data.generation.selectedBundleTemplates.length; index++) {
              var template = $scope.data.generation.selectedBundleTemplates[index];
              template.selected = false;
              $scope.selectTemplate(template);
            }
          }
        };

        $scope.deselectAllTemplate = function () {
          if ($scope.data.generation.selectedBundleTemplates) {
            for (var index = 0; index < $scope.data.generation.selectedBundleTemplates.length; index++) {
              var template = $scope.data.generation.selectedBundleTemplates[index];
              template.selected = true;
              $scope.selectTemplate(template);
            }
          }
        };

        $scope.submitGeneration = function () {
          $scope.data.events.generation();
        };

        function init() {
          if ($scope.data.generation.selectedModelEntitys == null) {
            if ($scope.data.models.tree) {
              if ($scope.data.models.tree[0]) {
                $scope.data.generation.selectedModel = $scope.data.models.tree[0];
                $scope.changeSelectedModel();
              }
            }
          }
        }

        init();
      }
    }
  });