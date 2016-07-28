'use strict';

angular.module('dashboard')
  .directive('dashboardtoolbar', ['$uibModal', function ($uibModal) {
    return {

      scope: {
        /**
         * List of projects
         */
        projects: '='
      },

      templateUrl: 'app/dashboard/directive/dashboard.toolbar.html',

      link: function ($scope, element, attrs) {

        $scope.addProject = function () {
          console.log('addProject');
          var modalInstance = $uibModal.open({
            templateUrl: 'app/modal/modal.createproject.html',
            controller: 'modalCtrl'
          });

          modalInstance.result.then(function (project) {
            console.log('modalInstance.result.then', project);
          })
        };
      }
    }
  }]);