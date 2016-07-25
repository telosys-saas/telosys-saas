'use strict';

angular.module('ide').directive('editor', function () {
    return {
      scope: {
        data: '='
      },

      templateUrl: 'app/ide/directive/ide.editor.directive.html',

      link: function ($scope, element, attrs) {
        $scope.$watch('data.selectedFile', function (newValue, oldValue) {
          console.log("selectedFile change in editor", newValue);
          if (newValue && newValue != null) {
            if (oldValue == null || newValue.id != oldValue.id) {

              $scope.addEditor(newValue);
            }
          } else if (oldValue != null) {
            console.log("close editor", oldValue);
            var formatedFileId = $scope.formatFileId(oldValue.id);
            var numDiv = $scope.editors[formatedFileId].numDiv;
            element[0].children[0].children[numDiv].remove();
          }
        }, true);

        $scope.$watchCollection('workingFiles', function (newValue, oldValue) {
          if (newValue) {
            // calculate new files
            var newFileIds = [];
            if (oldValue == null) {
              newFileIds = Object.keys(newValue);
            } else {
              for (var fileId in newValue) {
                if (oldValue[fileId] == null) {
                  newFileIds.push(fileId);
                }
              }
            }
            // add editor for new files
            for (var i = 0; i < newFileIds.length; i++) {
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

        $scope.addEditor = function (file) {
          if ($scope.editors[$scope.formatFileId(file.id)] != null) {
            $scope.showEditor(file.id);
            return;
          }

          $scope.hideAllEditors();
          var formatedFileId = $scope.formatFileId(file.id);
          var newElement = $(element[0].children[0]).append('<div id="editorCodemirror_' + formatedFileId + '" class="codemirror"></div>');
          var editor = CodeMirror(newElement[0].children[newElement[0].children.length - 1], $scope.editorOptions);
          editor.setValue(file.content);
          editor.on('change', $scope.contentChange);
          $scope.editors[formatedFileId] = {
            editor: editor,
            numDiv: newElement[0].children.length - 1
          };
        };

        $scope.hideAllEditors = function () {
          for (var i = 0; i < element[0].children[0].children.length; i++) {
            var div = element[0].children[0].children[i];
            if (div.style.display != 'none') {
              div.style.display = 'none';
            }
          }
        };

        $scope.showEditor = function (fileId) {
          var formatedFileId = $scope.formatFileId(fileId);
          if ($scope.editors[formatedFileId] == null) {
            return;
          }

          $scope.hideAllEditors();
          var numDiv = $scope.editors[formatedFileId].numDiv;
          var div = element[0].children[0].children[numDiv];
          div.style.display = 'block';
        };

        $scope.formatFileId = function (fileId) {
          return fileId.replace(/\./g, '_').replace(/\//g, '__').replace(/\\/g, '__');
        };

        $scope.contentChange = function () {
          var formatedFileId = $scope.formatFileId($scope.data.selectedFile.id);
          $scope.data.selectedFile.content = $scope.editors[formatedFileId].editor.getValue();
          if($scope.data.events.onContentChange) {
            $scope.data.events.onContentChange($scope.data.selectedFile.id);
          }
        };
      }
    }
  }
);