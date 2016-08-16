'use strict';

/**
 * Generation view
 */
angular.module('ide')
  .directive('generation', function () {
    return {
      templateUrl: 'app/ide/directive/ide.generation.directive.html',

      link: function ($scope, element, attrs) {

        $scope.submitGeneration = function () {
          $scope.entitiesByModels = {};
          for (var indexModel = 0; indexModel < $scope.data.models.tree.length; indexModel++) {
            var modelName = $scope.data.models.tree[indexModel].text;
            for (var indexEntity = 0; indexEntity < $scope.data.models.tree[indexModel].children.length; indexEntity++) {
              var entityId = $scope.data.models.tree[indexModel].children[indexEntity].id;
              var entity = $scope.data.models.allFiles[entityId];
              if (entity.isSelectedForGeneration) {
                if ($scope.entitiesByModels[modelName] == null) {
                  $scope.entitiesByModels[modelName] = [];
                }
                $scope.entitiesByModels[modelName].push(entity.name);
              }
            }
          }
          console.log('entitiesByModels', $scope.entitiesByModels);

          $scope.templatesByBundle = {};
          for (var indexBundle = 0; indexBundle < $scope.data.bundles.tree.length; indexBundle++) {
            var bundleName = $scope.data.bundles.tree[indexBundle].text;
            for (var indexTemplate = 0; indexTemplate < $scope.data.bundles.tree[indexBundle].children.length; indexTemplate++) {
              var templateId = $scope.data.bundles.tree[indexBundle].children[indexTemplate].id;
              var template = $scope.data.bundles.allFiles[templateId];
              if (template) {
                if (template.isSelectedForGeneration) {
                  if ($scope.templatesByBundle[bundleName] == null) {
                    $scope.templatesByBundle[bundleName] = [];
                  }
                  $scope.templatesByBundle[bundleName].push(template.name);
                }
              }
            }
          }
          console.log('templatesByBundle', $scope.templatesByBundle);
          $scope.data.events.generation($scope.entitiesByModels, $scope.templatesByBundle);
        };
      }
    }
  });