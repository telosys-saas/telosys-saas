'use strict';

angular.module('ide').
    directive('left', function () {
   return {
       scope : {
           data : '='
       },
       templateUrl : 'app/ide/directive/ide.left.directive.html',
       link : function($scope, element, attrs){
           function init() {
               //console.log('Left - data :', $scope.data);
               //console.log('left',$(element[0].children[0]));
               $(element[0].children[0]).collapsible({
                   accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
               });
           }
           init();
       }
   };
});
