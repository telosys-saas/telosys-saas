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

        /**
         * When the server send the result of the generation
         * the function transform the result and display it in the console
         */
        $scope.$watchCollection('data.generation.generationResults', function () {
          console.log('console generationResults', $scope.data.generation.generationResults);
          $scope.data.generation.errorTransformeds = $scope.transformGenerationErrors($scope.data.generation, $scope.data.generation.generationResults.errors);
          $scope.displayTab = 'generation'
        });

        /**
         * When the server send the errors fr the model
         * the function transform the result and display it in the console
         */
        $scope.$watchCollection('data.models.modelErrors', function () {
          console.log('console modelErrors', $scope.data.models.modelErrors);
          // Model entity errors
          var modelErrors = $scope.data.models.modelErrors;

          // Nb errors
          var countModelsErrors = 0;
          for (var index = 0; index < modelErrors.length; index++) {
            var model = modelErrors[index];
            if (model.parsingErrors) {
              countModelsErrors += model.parsingErrors.length;
            }
          }
          $scope.data.models.countModelsErrors = countModelsErrors;

          // Errors to display in console
          var errorTransformeds = [];
          for (var i = 0; i < modelErrors.length; i++) {
            var model = modelErrors[i];
            var modelName = model.name;
            var entityErrors = model.parsingErrors;
            if (!entityErrors) continue;

            for (var j = 0; j < entityErrors.length; j++) {
              var error = entityErrors[j];
              var entityName = error.entityName;
              var message = error.message;

              var errorTransformed = {
                entityFileId: 'TelosysTools/' + modelName + '_model/' + entityName + '.entity',
                entityName: entityName,
                modelName: modelName,
                message: message
              };
              errorTransformeds.push(errorTransformed);
            }
          }
          $scope.data.models.errorTransformeds = errorTransformeds;
          if ($scope.data.models.countModelsErrors > 0) {
            $scope.displayTab = 'model';
            $scope.data.generation.selectedModelEntitys = null;
          }else{
            if($scope.data.generation.selectedModel) {
              $scope.data.generation.selectedModelEntitys = $scope.data.generation.selectedModel.children;
            }
          }
        });

        /**
         * Parse all errors 
         * @param generation The executed generation
         * @param errors Errors during the generation
         */
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

        /**
         * Pasre one error
         * @param generation The executed generation
         * @param error One error during the generation
         */
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

        /**
         * Parse one error of the model
         * @param modelName The model name where an error occurred
         * @param error the Error
         */
        $scope.transformModelsError = function (modelName, error) {
          return {
            entityFileId: 'TelosysTools/' + modelName + '_model/' + error.entityName + '.entity',
            entityName: error.entityName,
            modelName: modelName,
            message: error.message
          }
        };

        /**
         * Change the tab to display
         * @param tabToDisplay Name of the next tab
         */
        $scope.onClickTab = function (tabToDisplay) {
          $scope.displayTab = tabToDisplay;
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
         * Automatically redirect to the model view
         * @param fileId File to display in the editor
         */
        $scope.goToModelEntity = function (fileId) {
          console.log('goToModelEntity', fileId);
          $scope.data.events.onDoubleClickFile($scope.data.models, fileId);
        };

        /**
         * Erase everything in the console
         */
        $scope.clearLog = function () {
          $scope.data.generation.generationResults = [];
          $scope.data.generation.errorTransformeds = {};
          $scope.data.models.countModelsErrors = 0;
          $scope.generation.errorMessage = null;
        };

        /**
         * Compute the generate and launch it
         */
        $scope.generateAgain = function () {
          $scope.data.generation.entities = [];
          $scope.data.generation.templates = [];
          for (var index = 0; index < $scope.data.generation.selectedModelEntitys.length; index++) {
            var entity = $scope.data.generation.selectedModelEntitys[index];
            if (entity.selected) {
              $scope.data.generation.entities.push(entity.text);
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
            $scope.data.generation.errorMessageTemplate = "Please select a template";
          }
          if ($scope.data.generation.entities.length == 0) {
            $scope.data.generation.errorMessageModel = "Please select an entity";
            return;
          }
          $scope.data.generation.errorMessage = null;
          $scope.data.generation.events.generate();
        }
      }
    }
  });