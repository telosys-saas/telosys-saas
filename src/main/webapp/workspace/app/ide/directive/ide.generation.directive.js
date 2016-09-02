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
          if($scope.data.generation.selectedModel) {
            $scope.data.generation.model = $scope.data.generation.selectedModel.text;
            $scope.selectModelEntitys();
            $scope.selectAllEntity();
          }
        };

        $scope.selectModelEntitys = function () {
          console.log('selectModelEntitys');
          for (var i = 0; i < $scope.data.models.modelErrors.length; i++) {
            var model = $scope.data.models.modelErrors[i];
            if (model.name == $scope.data.generation.model) {
              if (model.parsingErrors.length > 0) {
                $scope.data.generation.selectedModelEntitys = null;
                return;
              } else {
                $scope.data.generation.selectedModelEntitys = $scope.data.generation.selectedModel.children;
              }
            }
          }
        };

        $scope.goToModelEntity = function (fileId) {
          console.log('goToModelEntity', fileId);
          $scope.data.events.onDoubleClickFile($scope.data.models, fileId);
        };

        $scope.selectEntity = function (entity) {
          entity.selected = !entity.selected;
        };

        $scope.selectAllEntity = function () {
          $scope.deselectAllEntity();
          if ($scope.data.generation.selectedModelEntitys) {
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
        $scope.goToBundleTemplate = function (fileId) {
          console.log('goToBundleTemplate', fileId);
          $scope.data.events.onDoubleClickFile($scope.data.bundles, fileId);
        };

        $scope.changeSelectedBundle = function () {
          console.log('changeSelectedBundle', $scope.data.generation.selectedBundle);
          $scope.data.bundles.events.getTemplateForGeneration($scope.data.generation.selectedBundle.text, function (result) {
            $scope.data.generation.selectedBundleTemplates = result.data;
            $scope.data.generation.bundle = $scope.data.generation.selectedBundle.text;
          });
        };

        $scope.selectTemplate = function (template) {
          template.selected = !template.selected;
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
          $scope.data.generation.entities = [];
          $scope.data.generation.templates = [];
          if($scope.data.generation.selectedModelEntitys) {
            for (var index = 0; index < $scope.data.generation.selectedModelEntitys.length; index++) {
              var entity = $scope.data.generation.selectedModelEntitys[index];
              if (entity.selected) {
                $scope.data.generation.entities.push(entity.text);
              }
            }
          }
          if ($scope.data.generation.selectedBundleTemplates) {
            for (var index = 0; index < $scope.data.generation.selectedBundleTemplates.length; index++) {
              var template = $scope.data.generation.selectedBundleTemplates[index];
              if (template.selected) {
                $scope.data.generation.templates.push(template.name);
              }
            }
          }
          if ($scope.data.generation.templates.length == 0) {
            $scope.data.generation.errorMessage = "Please select a template";
            return;
          }
          if ($scope.data.generation.entities.length == 0) {
            $scope.data.generation.errorMessage = "Please select an entity";
            return;
          }
          $scope.data.generation.errorMessage = null;
          $scope.data.generation.events.generate();
        };

        $scope.goToBundleConfiguration = function () {
          if ($scope.data.generation.bundle || $scope.data.generation.bundle != "") {
            var fileId = 'TelosysTools/templates/' + $scope.data.generation.bundle + '/templates.cfg';
            $scope.goToBundleTemplate(fileId);
          }
        };

        $scope.refreshModel = function () {
          $scope.data.models.events.refreshAll(function () {
            for (var index = 0; index < $scope.data.models.tree.length; index++) {
              var model = $scope.data.models.tree[index];
              if(model.text ==  $scope.data.generation.selectedModel.text){
                $scope.data.generation.selectedModel = model;
              }
            }
            $scope.changeSelectedModel();
          })
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