'use strict';

angular.module('ide').directive('editor', function () {
    return {
      scope: {
        workingFiles: '=',
        selectedFile: '='
      },

      templateUrl: 'app/ide/directive/ide.editor.directive.html',

      link: function ($scope, element, attrs) {
        $scope.$watch('selectedFile', function (newValue, oldValue) {
          if (newValue != null) {
            console.log("selectedFile", newValue);
            if(oldValue == null || newValue.id != oldValue.id) {
              $scope.showEditor(newValue.id);
            }
          }
        }, true);

        $scope.$watchCollection('workingFiles', function (newValue, oldValue) {
          if(newValue) {
            // calculate new files
            var newFileIds = [];
            if (oldValue == null) {
              newFileIds = Object.keys(newValue);
            } else {
              for(var fileId in newValue) {
                if(oldValue[fileId] == null) {
                  newFileIds.push(fileId);
                }
              }
            }
            // add editor for new files
            for(var i=0; i<newFileIds.length; i++) {
              var fileId = newFileIds[i];
              var file = newValue[fileId];
              $scope.addEditor(file);
            }
            console.log("new files", newFileIds);
          }

        }, true);

        $scope.editorOptions = {
          value: '',
          lineNumbers: true,
          extraKeys: {
            'Ctrl-S': function (cm) {
              console.log('Ctrl-S save method');
            },
            'Cmd-S': function (cm) {
              console.log('Cmd-S save method');
            }
          }
        };

        $scope.editors = {};

        $scope.addEditor = function addEditor(file) {
          $scope.hideAllEditors();
          var formatedFileId = $scope.formatFileId(file.id);
          var newElement = $(element[0].children[0]).append('<div id="editorCodemirror_'+formatedFileId+'" class="codemirror"></div>');
          var editor = CodeMirror(newElement[0].children[newElement[0].children.length - 1], $scope.editorOptions);
          editor.setValue(file.content);
          $scope.editors[formatedFileId] = {
            editor: editor,
            numDiv: newElement[0].children.length - 1
          };
        };

        $scope.hideAllEditors = function() {
          for(var i=0; i<element[0].children[0].children.length; i++) {
            var div = element[0].children[0].children[i];
            if(div.style.display != 'none') {
              div.style.display = 'none';
            }
          }
        };

        $scope.showEditor = function(fileId) {
          var formatedFileId = $scope.formatFileId(fileId);
          if($scope.editors[formatedFileId] == null) {
            return;
          }

          $scope.hideAllEditors();
          var numDiv = $scope.editors[formatedFileId].numDiv;
          var div = element[0].children[0].children[numDiv];
          div.style.display = 'block';
        };

        $scope.formatFileId = function formatFileId(fileId) {
          return fileId.replace(/\./g, '_').replace(/\//g, '__').replace(/\\/g, '__');
        };

      }
    }
  }
);

