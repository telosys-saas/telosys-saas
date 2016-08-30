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

        $scope.displayTab = 'folders';

        /** Data for Variables tab*/
        $scope.selectedVariable = null;

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
          })
        };

        $scope.rowToDeletes = {};

        /**
         * Delete a specific variable
         */
        $scope.deleteVariable = function () {
          if($scope.rowToDeletes) {
            for(var key in $scope.rowToDeletes) {
              if($scope.rowToDeletes[key]) {
                delete $scope.data.variables.specificVariables[key];
              }
            }
          }
          $scope.rowToDeletes = {};
        };

        $scope.selectVariable = function (key) {
          $scope.selectedVariable = key;
        };
      }
    }
  }]);


