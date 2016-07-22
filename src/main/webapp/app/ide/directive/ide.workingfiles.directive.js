'use strict';

angular.module('ide').directive('workingfiles', function () {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },

    templateUrl: 'app/ide/directive/ide.workingfiles.directive.html',

    link: function ($scope, element, attrs) {
      $scope.$watchCollection('data.workingFiles', function (newValue, oldValue) {
        if (newValue)
          console.log("workingFiles change");
      }, true);

      $scope.data.events.selectedFileIsModified = function () {
        var el = element.find("li");
        el[0].innerHTML = '<i class="fa fa-circle"></i>' + '&nbsp;' +
                          '<a href>' + $scope.data.selectedFile.name +
                          '<span style="font-size: smaller; color: gray;">' +
                          '</span></a>';
        console.log(el[0]);
      }
    },

    controller: ['$scope', function ($scope) {
      $scope.onClickFile = function (file) {
        console.log('onClickFile', file);
        if ($scope.data.events.onClickFile != null) {
          console.log('working file', $scope.data.selectedFile);
          $scope.data.events.onClickFile(file);
        }
      }

    }]
  }
});
