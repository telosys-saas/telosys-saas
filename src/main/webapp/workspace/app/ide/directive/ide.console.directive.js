'use strict';

/**
 * IDE Console
 */
angular.module('ide')
  .directive('console', function () {
    return {

      scope : {
        generationResults: '=',
        events: '='
      },

      templateUrl: 'app/ide/directive/ide.console.directive.html',

      link: function ($scope, element, attrs) {

        $scope.displayTab = 'model';
        $scope.hasError = null;
        $scope.errors = [];

        $scope.$watchCollection('generationResults', function () {
          $scope.displayTab = 'generation';
          console.log('console generationResults', $scope.generationResults);
          for (var indexResult = 0; indexResult < $scope.generationResults.length; indexResult++) {
            var generationResult = $scope.generationResults[indexResult];
            if (!generationResult.isDisplay) {
              generationResult.isDisplay = true;
              if (generationResult.result && generationResult.result.errors && generationResult.result.errors.length > 0) {
                $scope.hasError = true;
                for (var j = 0; j < generationResult.result.errors.length; j++) {
                  var errorAsStr = generationResult.result.errors[j];
                  var error = $scope.getErrorAsObject(generationResult.generation, errorAsStr);
                  $scope.errors.push(error);
                }
              }else{
                $scope.hasError = false;
                $scope.result = {
                  numberOfFilesGenerated : generationResult.result.data.numberOfFilesGenerated,
                  numberOfGenerationErrors : generationResult.result.data.numberOfGenerationErrors,
                  numberOfResourcesCopied : generationResult.result.data.numberOfResourcesCopied
                }
              }
            }
          }
        });

        $scope.getErrorAsObject = function (generation, error) {
          try {
            var posBegin = error.message.indexOf('Template "') + 10;
            var posEnd = error.message.indexOf('"', posBegin);
            var templateName = error.message.substring(posBegin, posEnd);
            var templateFileId = 'TelosysTools/templates/' + generation.bundle + '/' + templateName;

            var posBegin = error.message.indexOf(' ( line ') + 8;
            var posEnd = error.message.indexOf(' )', posBegin);
            var numLine = error.message.substring(posBegin, posEnd);

            var posBegin = error.message.indexOf('Entity : "') + 10;
            var posEnd = error.message.indexOf('"', posBegin);
            var entityName = error.message.substring(posBegin, posEnd);
            var entityFileId = 'TelosysTools/' + generation.models + '_model/' + entityName + '.entity';

            var posBegin = posEnd + 2;
            if (error.message.indexOf('Exception :', posBegin) != -1) {
              posBegin = error.message.indexOf('Exception :', posBegin) + 11;
            }
            var message = error.message.substring(posBegin);

            return {
              entityName: entityName,
              entityFileId: entityFileId,
              templateName: templateName,
              templateFileId: templateFileId,
              numLine: numLine,
              message: message
            };

          } catch (e) {
            return {
              message: message
            }
          }
        };

        $scope.onClickTab = function (tabToDisplay) {
          $scope.displayTab = tabToDisplay;
        }
      }
    }
  });