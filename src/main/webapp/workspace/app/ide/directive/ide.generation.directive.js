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
          $scope.checkModelError();
          $scope.selectAllEntity();
          $scope.data.generation.model = $scope.data.generation.selectedModel.text;
        };

        $scope.checkModelError = function () {
          console.log('checkModelError',$scope.data.generation.selectedModelEntitys)
        };

        $scope.goToModelEntity = function (fileId) {
          console.log('goToModelEntity', fileId);
          $scope.data.events.onClickFile($scope.data.models, fileId);
        };

        $scope.selectEntity = function (entity) {
          entity.selected = !entity.selected;
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
        $scope.goToBundleTemplate = function (fileId) {
          console.log('goToBundleTemplate', fileId);
          $scope.data.events.onClickFile($scope.data.bundles, fileId);
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
          for(var index = 0; index < $scope.data.generation.selectedModelEntitys.length; index++){
            var entity = $scope.data.generation.selectedModelEntitys[index];
            if(entity.selected){
              $scope.data.generation.entities.push(entity.text);
            }
          }
          for(var index = 0; index < $scope.data.generation.selectedBundleTemplates.length; index++){
            var template = $scope.data.generation.selectedBundleTemplates[index];
            if(template.selected){
              $scope.data.generation.templates.push(template.name);
            }
          }
          $scope.data.events.generation();
        };

        $scope.goToBundleConfiguration = function () {
          if ($scope.data.generation.bundle || $scope.data.generation.bundle != "") {
            var fileId = 'TelosysTools/templates/' + $scope.data.generation.bundle + '/templates.cfg';
            $scope.goToBundleTemplate(fileId);
          }
        };

        $scope.refreshModel = function () {
          if ($scope.data.models.tree) {
            if ($scope.data.models.tree[0]) {
              $scope.data.generation.selectedModel = $scope.data.models.tree[0];
              $scope.changeSelectedModel();
            }
          }
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