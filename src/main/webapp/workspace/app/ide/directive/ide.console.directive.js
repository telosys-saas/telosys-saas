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
          $scope.displayTab = 'generation';
        });

        $scope.$watchCollection('data.models.modelErrors', function () {
          console.log('console modelErrors', $scope.data.models.modelErrors);
          // Model entity errors
          var modelErrors = $scope.data.models.modelErrors;

          // Nb errors
          var countModelsErrors = 0;
          for(var index = 0; index < modelErrors.length; index++) {
            var model = modelErrors[index];
            if(model.parsingErrors) {
              model.hasError = true;
              countModelsErrors += model.parsingErrors.length;
            }else{
              model.hasError = false;
            }
          }
          $scope.data.models.countModelsErrors = countModelsErrors;

          // Errors to display in console
          var errorTransformeds = [];
          for(var i=0; i<modelErrors.length; i++) {
            var model = modelErrors[i];
            var modelName = model.name;
            var entityErrors = model.parsingErrors;
            if(!entityErrors) continue;

            for(var j=0; j<entityErrors.length; j++){
              var error = entityErrors[j];
              var entityName = error.entityName;
              var message = error.message;

              var errorTransformed = {
                entityFileId : 'TelosysTools/' + modelName + '_model/' + entityName + '.entity',
                entityName : entityName,
                modelName: modelName,
                message: message
              };

              errorTransformeds.push(errorTransformed);
            }
          }
          $scope.data.models.errorTransformeds = errorTransformeds;
          $scope.displayTab = 'model';
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

        $scope.transformModelsError = function(modelName,error){
          return {
            entityFileId : 'TelosysTools/' + modelName + '_model/' + error.entityName + '.entity',
            entityName : error.entityName,
            modelName: modelName,
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