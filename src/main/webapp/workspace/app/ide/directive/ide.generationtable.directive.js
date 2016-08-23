'use strict';

/**
 * Table for generation view
 */
angular.module('ide')
    .directive('generationtable', function () {
        return {
            scope: {
                data: '='
            },

            templateUrl: 'app/ide/directive/ide.generationtable.directive.html',

            link: function ($scope, element, attrs) {

                $scope.selectedElement = {};

                $scope.changeSelectedElement = function (element) {
                    console.log('changeSelectedElement', element);
                    if ($scope.data.events.getTemplateForGeneration) {
                        $scope.data.events.getTemplateForGeneration(element.text);
                    } else {
                        $scope.selectedElement = element;
                    }
                };

                $scope.goToFile = function (fileId) {
                    console.log('goToFile', fileId);
                };
            }
        }
    });
