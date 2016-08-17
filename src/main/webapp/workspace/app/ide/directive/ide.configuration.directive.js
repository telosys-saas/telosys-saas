'use strict';

/**
 * IDE Configuration
 */
angular.module('ide')
  .directive('configuration', function () {
    return {
      scope: {
        data: '='
      },

      templateUrl: 'app/ide/directive/ide.configuration.directive.html',

      link: function ($scope, element, attrs) {

        $scope.displayTab = 'folders';
        
        $scope.onClickTab = function (tabToDisplay) {
          $scope.displayTab = tabToDisplay;
        };
        
        $scope.saveConfig = function () {
          console.log('saveConfig', data);
          $scope.data.events.saveConfig();
        }
        
      }

      }
  });
