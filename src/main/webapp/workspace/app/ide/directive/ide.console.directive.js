'use strict';

/**
 * IDE Console
 */
angular.module('ide')
  .directive('console', function () {
    return {

      scope: {
        data: '='
      },

      templateUrl: 'app/ide/directive/ide.console.directive.html',

      link: function ($scope, element, attrs) {

        $scope.displayTab = 'model';

        $scope.$watchCollection('data.generation.generationResults', function () {
          console.log('console generationResults', $scope.data.generation.generationResults);
          $scope.data.generation.errorTransformeds = $scope.transformGenerationErrors($scope.data.generation, $scope.data.generation.generationResults.errors);
        });

        $scope.$watchCollection('data.models.modelErrors', function () {
          console.log('console modelErrors', $scope.data.models.modelErrors);
          $scope.data.models.countModelsErrors = 0;
          $scope.data.models.errorTransformeds = {};
          for(var index = 0; index < $scope.data.models.modelErrors.length; index++) {
            var model = $scope.data.models.modelErrors[index];
            $scope.data.models.countModelsErrors += model.parsingErrors.length;
            if(model.parsingErrors.length > 0) {
              $scope.data.models.hasError = true;
             $scope.data.models.errorTransformeds[model.name] = $scope.transformModelsErrors(model.name,model.parsingErrors);
            }
          }
        });
        
        $scope.transformGenerationErrors = function (generation, errors) {
          if (!errors) return [];
          var errorTransformeds = [];
          for (var i = 0; i < errors.length; i++) {
            var error = errors[i];
            var errorTransformed = $scope.transformGenerationError(generation, error);
           errorTransformeds.push(errorTransformed);
          }
          return errorTransformeds;
        };

        $scope.transformGenerationError = function (generation, error) {
          try {
            var posBegin = error.message.indexOf('Template "') + 10;
            var posEnd = error.message.indexOf('"', posBegin);
            var templateName = error.message.substring(posBegin, posEnd);
            var templateFileId = 'TelosysTools/templates/' + generation.bundle + '/' + templateName;

            var posBegin = error.message.indexOf(' ( line ') + 8;
            var posEnd = error.message.indexOf(' )', posBegin);
            var numLine = error.message.substring(posBegin, posEnd);

            var posBegin = error.message.indexOf('Entity "') + 8;
            var posEnd = error.message.indexOf('"', posBegin);
            var entityName = error.message.substring(posBegin, posEnd);
            var entityFileId = 'TelosysTools/' + generation.model + '_model/' + entityName + '.entity';

            var posBegin = posEnd + 2;
            if (error.message.indexOf('Exception ', posBegin) != -1) {
              posBegin = error.message.indexOf('Exception \'', posBegin);
            }
            var message = error.message.substring(posBegin);

            if (message.lastIndexOf('\n\n') == message.length - 2) {
              message = message.substring(0, message.lastIndexOf('\n\n'));
            }

            return {
              entityName: entityName,
              entityFileId: entityFileId,
              templateName: templateName,
              templateFileId: templateFileId,
              numLine: numLine,
              message: message
            };
          } catch (e) {
            throw e;
          }
        };

        $scope.transformModelsErrors = function(modelName,modelErrors){
          var errorTransformeds = [];
          for(var index = 0; index < modelErrors.length; index++){
            var error = modelErrors[index];
            var errorTransformed = $scope.transformModelsError(modelName,error);
            errorTransformeds.push(errorTransformed);
          }
          return errorTransformeds;
        };

        $scope.transformModelsError = function(modelName,error){
          return {
            entityFileId : 'TelosysTools/' + modelName + '_model/' + error.entityName + '.entity',
            entityName : error.entityName,
            message: error.message
          }
        };
        
        $scope.onClickTab = function (tabToDisplay) {
          $scope.displayTab = tabToDisplay;
        };

        $scope.goToBundleTemplate = function (fileId) {
          console.log('goToBundleTemplate', fileId);
          $scope.data.events.onClickFile($scope.data.bundles, fileId);
        };

        $scope.goToModelEntity = function (fileId) {
          console.log('goToModelEntity', fileId);
          $scope.data.events.onClickFile($scope.data.models, fileId);
        };
        
        $scope.clearLog = function () {
          $scope.data.generation.generationResults = [];
          $scope.data.generation.errorTransformeds = {};
          $scope.data.models.countModelsErrors = 0;
        }
      }
    }
  });