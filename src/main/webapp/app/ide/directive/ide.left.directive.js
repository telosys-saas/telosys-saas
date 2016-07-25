'use strict';

angular.module('ide').directive('left', function () {
  return {
    templateUrl: 'app/ide/directive/ide.left.directive.html',
    link: function (scope, element, attrs) {
      // activate collapse
      $(element[0].children[0]).collapsible({
        accordion: false  // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });
    }
  };
});
