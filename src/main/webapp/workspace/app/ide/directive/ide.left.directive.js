'use strict';

angular.module('ide').directive('left', function () {
  return {
    scope: {
      data: '=',
      events: '='
    },  
    templateUrl: 'app/ide/directive/ide.left.directive.html',
    link: function (scope, element, attrs) {
    }
  };
});
