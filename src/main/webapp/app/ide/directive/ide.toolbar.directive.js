'use strict';

angular.module('ide')
  .directive('idetoolbar', ['$uibModal',function ($uibModal) {
    return {
      
      scope: {
        data: '='
      },

      templateUrl: 'app/ide/directive/ide.toolbar.directive.html',

      link: function ($scope, element, attrs) {

        $scope.download = function () {
          console.log('download');
          $scope.data.events.onDownload();
        };

        $scope.addProject = function () {
          console.log('addProject');
          var modalInstance = $uibModal.open({
            templateUrl: 'app/modal/modal.createproject.html',
            controller: 'modalCtrl',
            resolve: {
              data: {}
            }
          });
          modalInstance.result.then(function (project) {
            $scope.data.projects.push(project);
          })
        };
      }
  }
  }]);