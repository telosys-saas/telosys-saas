'use strict';

/**
 * IDE Configuration
 */
angular.module('ide')
  .directive('configuration',['$uibModal',function ($uibModal) {
    return {
      scope: {
        data: '='
      },

      templateUrl: 'app/ide/directive/ide.configuration.directive.html',

      link: function ($scope, element, attrs) {

        $scope.displayTab = 'variables';
        $scope.selectedRow = null;

        $scope.onClickTab = function (tabToDisplay) {
          $scope.displayTab = tabToDisplay;
        };

        /**
         * Apply the new configuration
         */
        $scope.saveConfig = function () {
          console.log('saveConfig', $scope.data);
          $scope.data.events.saveConfig();
        };

        /**
         * Add a specific variable
         */
        $scope.addVariable = function () {
          var modalInstance = $uibModal.open({
            templateUrl: 'app/modal/modal.addvariable.html',
            controller: 'modalCtrl',
            resolve: {
              data: {}
            }
          });
          
          modalInstance.result.then(function (specificVariable) {
            $scope.data.variables.specificVariables[specificVariable.name] = specificVariable.value;
            $scope.data.variables.specificVariablesKeys.push(specificVariable.name);
          })
        };

        $scope.deleteVariable = function () {
          delete $scope.data.variables.specificVariables[$scope.selectedRow];
          $scope.data.variables.specificVariablesKeys = Object.keys($scope.data.variables.specificVariables);
        };
        
        $scope.selectRow = function (key) {
          $scope.selectedRow = key;
        }
      }
    }
  }]);
