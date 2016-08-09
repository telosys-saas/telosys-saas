'use strict';

angular.module('ide')
  .directive('idemaintoolbar', ['$uibModal',function ($uibModal) {
    return {

      scope: {
        data: '=',
        profile: '='
      },

      templateUrl: 'app/ide/directive/ide.maintoolbar.directive.html',

      link: function ($scope, element, attrs) {
      }
    }
  }]);