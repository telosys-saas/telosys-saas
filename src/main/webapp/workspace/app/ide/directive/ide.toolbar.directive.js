'use strict';

angular.module('ide')
  .directive('idetoolbar', ['$uibModal',function ($uibModal) {
    return {
      
      scope: {
        data: '=',
        profile: '='
      },

      templateUrl: 'app/ide/directive/ide.toolbar.directive.html',

      link: function ($scope, element, attrs) {

        $scope.events = $scope.data.events;

        /**
         * Change view
         */
        $scope.changeView = function(view) {
          $scope.data.events.changeView(view);
        };

        /**
         * Download the project in a ZIP file
         */
        $scope.download = function () {
          console.log('download');
          $scope.data.events.onDownload();
        };

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
          modalInstance.result.then(function (project) {
            // When the creation is a success
            $scope.data.projects.push(project);
          })
        };
        
        $scope.changePassword = function () {
          var modalInstance = $uibModal.open({
            templateUrl: 'app/modal/modal.changepassword.html',
            controller: 'modalCtrl',
            resolve: {
              data: {}
            }
          });
        }
        
      }
  }
  }]);