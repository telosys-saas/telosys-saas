'use strict';

angular.module('toolbar')
  .component('toolbar', {

    templateUrl: 'app/toolbar/toolbar.html',

    controller: ['$scope','ProjectsService', function ($scope,ProjectsService) {

      /**
       * List of projects
       */
      $scope.projects = [];

      /**
       * Current project
       */
      $scope.project = {};

      // init
      function init() {
        ProjectsService.getProjects(function (result) {
          $scope.projects = result;
        })
      }
      init();

    }]
  });