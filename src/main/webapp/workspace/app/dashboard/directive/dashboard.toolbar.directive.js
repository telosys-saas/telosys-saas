'use strict';

angular.module('dashboard')
  .directive('dashboardtoolbar', ['$uibModal', function ($uibModal) {
    return {

      scope: {
        /**
         * List of projects
         */
        projects: '=',

        /**
         * User's profile
         */
        profile: '='
      },

      templateUrl: 'app/dashboard/directive/dashboard.toolbar.directive.html',

      link: function ($scope, element, attrs) {

        /**
         * Add a new project
         */
        $scope.addProject = function () {
          console.log('addProject');
          // Modal window to create a new project
          var modalInstance = $uibModal.open({
            templateUrl: 'app/modal/modal.createproject.html',
            controller: 'modalCtrl',
            resolve: {
              data: {}
            }
          });
        };
        
        $scope.logout = function() {
          console.log(document.location);
          document.location = 'profile/logout?url='+document.location.href;
        };

        $scope.changePassword = function () {
          var modalInstance = $uibModal.open({
            templateUrl: 'app/modal/modal.changepassword.html',
            controller: 'modalCtrl',
            resolve: {
              data: {}
            }
          });
        };
      }
    }
  }]);