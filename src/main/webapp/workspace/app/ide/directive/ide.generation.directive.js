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

        /**
         * Change the selected model
         */
        $scope.changeSelectedModel = function () {
          console.log('changeSelectedModel', $scope.data.generation.selectedModel);
          if($scope.data.generation.selectedModel) {
            $scope.data.generation.model = $scope.data.generation.selectedModel.text;
            $scope.selectModelEntitys();
            $scope.selectAllEntity();
          }
        };

        /**
         * Check if the model contains some errors
         */
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

        /**
         * Automatically redirect to the model view
         * @param fileId File to display in the editor
         */
        $scope.goToModelEntity = function (fileId) {
          console.log('goToModelEntity', fileId);
          $scope.data.events.onDoubleClickFile($scope.data.models, fileId);
        };

        /**
         * Select the entity
         * @param entity Entity to select
         */
        $scope.selectEntity = function (entity) {
          entity.selected = !entity.selected;
        };

        /**
         * Select all entities for the selected model
         */
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

        /**
         * Deselect all entities for the selected model
         */
        $scope.deselectAllEntity = function () {
          if ($scope.data.generation.selectedModelEntitys) {
            for (var index = 0; index < $scope.data.generation.selectedModelEntitys.length; index++) {
              var entity = $scope.data.generation.selectedModelEntitys[index];
              entity.selected = true;
              $scope.selectEntity(entity);
            }
          }
        };

        /**
         * Automatically redirect to the bundle view
         * @param fileId File to display in the editor
         */
        $scope.goToBundleTemplate = function (fileId) {
          console.log('goToBundleTemplate', fileId);
          $scope.data.events.onDoubleClickFile($scope.data.bundles, fileId);
        };

        /**
         * Change the selected bundle
         */
        $scope.changeSelectedBundle = function () {
          console.log('changeSelectedBundle', $scope.data.generation.selectedBundle);
          $scope.data.bundles.events.getTemplateForGeneration($scope.data.generation.selectedBundle.text, function (result) {
            $scope.data.generation.selectedBundleTemplates = result.data;
            $scope.data.generation.bundle = $scope.data.generation.selectedBundle.text;
          });
        };

        /**
         * Select the template
         * @param template Template to select
         */
        $scope.selectTemplate = function (template) {
          template.selected = !template.selected;
        };

        /**
         * Select all templates for the selected bundle
         */
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

        /**
         * Deselect all templates for the selected bundle
         */
        $scope.deselectAllTemplate = function () {
          if ($scope.data.generation.selectedBundleTemplates) {
            for (var index = 0; index < $scope.data.generation.selectedBundleTemplates.length; index++) {
              var template = $scope.data.generation.selectedBundleTemplates[index];
              template.selected = true;
              $scope.selectTemplate(template);
            }
          }
        };

        /**
         * Compute the generation and launch it
         */
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

        /**
         * Automatically redirect to the bundle view
         * and open the template.cfg associated to the selected bundle
         */
        $scope.goToBundleConfiguration = function () {
          if ($scope.data.generation.bundle || $scope.data.generation.bundle != "") {
            var fileId = 'TelosysTools/templates/' + $scope.data.generation.bundle + '/templates.cfg';
            $scope.goToBundleTemplate(fileId);
          }
        };

        /**
         * Refresh the list of selectable model and entity
         */
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

        /**
         * Init the generation view
         */
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