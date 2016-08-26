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

        $scope.displayTab = 'generation';
        $scope.errorTransformeds = [];

        $scope.$watch('data.generation.generationResults', function () {
          console.log('console generationResults', $scope.data.generation.generationResults);
          $scope.errorTransformeds  = $scope.transformGenerationErrors($scope.data.generation, $scope.data.generation.generationResults);
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
        
        $scope.onClickTab = function (tabToDisplay) {
          $scope.displayTab = tabToDisplay;
        }
      }
    }
  });