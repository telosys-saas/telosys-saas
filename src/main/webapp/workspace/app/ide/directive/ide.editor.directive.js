'use strict';

/**
 * File editor
 */
angular.module('ide').directive('editor', function () {
    return {
      scope: {
        data: '='
      },

      templateUrl: 'app/ide/directive/ide.editor.directive.html',

      link: function ($scope, element, attrs) {

        $scope.events = $scope.data.events;

        /**
         * Watch "selected file", when the selected file change
         * @param oldValue : before change
         * @param newValue : after change
         */
        $scope.$watch('data.selectedFile', function (newValue, oldValue) {
          console.log(newValue);
          if (newValue && newValue != null) {
            if (oldValue == null || newValue.id != oldValue.id) {
              // Cases :
              // - no selected file : the user opens a first file
              // - selected file id changed : it is another file
              $scope.addEditor(newValue);
              element[0].children[0].children[0].style.display = 'block';
            }
          } else if (oldValue != null) {
            // Case :
            // - the user closes the selected file
            console.log("close editor", oldValue);
            $scope.closeEditor(oldValue.id);
          }
        }, true);

        /**
         * Update the display of Opened and pinned files
         * @param oldValue : before change
         * @param newValue : after change
         */
        $scope.$watchCollection('data.workingFiles', function (newValue, oldValue) {
          // Files opened by user
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
          } else {
            // Case : new value = null so the user close all files
            if (oldValue != null) {
              for (var fileId in oldValue) {
                $scope.closeEditor(fileId);
              }
              $scope.data.workingFiles = {};
              return;
            }
          }

          // Files closed by user
          // calculate old files
          var oldFileIds = [];
          if (oldValue != null) {
            if (newValue == null) {
              oldFileIds = Object.keys(oldValue);
            } else {
              for (var oldFileId in oldValue) {
                if (newValue[oldFileId] == null) {
                  oldFileIds.push(oldFileId);
                }
              }
            }
          }
          //Close old Files
          for (var index = 0; index < oldFileIds.length; index++) {
            $scope.closeEditor(oldFileIds[i]);
          }
        }, true);

        /**
         * Codemirror options for editor
         */
        $scope.editorOptions = {
          value: '',
          lineNumbers: true,
          extraKeys: {
            'Ctrl-S': function (cm) {
              console.log('Ctrl-S save method');
              $scope.saveFile($scope.data);
            },
            'Cmd-S': function (cm) {
              console.log('Cmd-S save method');
              $scope.saveFile($scope.data);
            }
          }
        };

        /**
         * Opened editors
         */
        $scope.editors = {};

        /**
         * Save the current selected file
         */
        $scope.saveFile = function () {
          if ($scope.events.saveFile) {
            $scope.events.saveFile($scope.data);
          }
        };

        /**
         * Close the current selected file
         */
        $scope.closeSelectedFile = function () {
          if ($scope.data.selectedFile == null) {
            return;
          }
          if ($scope.events.onCloseFile) {
            $scope.events.onCloseFile($scope.data, $scope.data.selectedFile.id);
          }
        };

        /**
         * Add an editor for the file
         * @param file File to opened in a new editor
         */
        $scope.addEditor = function (file) {
          if ($scope.editors[$scope.formatFileId(file.id)] != null) {
            $scope.showEditor(file.id);
            return;
          }

          $scope.hideAllEditors();
          var formatedFileId = $scope.formatFileId(file.id);
          console.log("add editor");
          var newElement = $(element[0].children[2]).append('<div id="editorCodemirror_' + formatedFileId + '" class="codemirror"></div>');
          // Create a new editor
          var editor = CodeMirror(newElement[0].children[newElement[0].children.length - 1], $scope.editorOptions);
          editor.setValue(file.content);
          editor.on('change', $scope.onContentChange);
          // Save the new editor and the new DOM element in the list of editors
          $scope.editors[formatedFileId] = {
            editor: editor,
            div: element[0].children[2].children[newElement[0].children.length - 1]
          };
        };

        /**
         * Close the editor for the file
         * @param fileId File ID
         */
        $scope.closeEditor = function (fileId) {
          console.log('close editor', fileId);
          var formatedFileId = $scope.formatFileId(fileId);
          if ($scope.editors[formatedFileId]) {
            // Remove the editor from the list and the DOM
            $scope.editors[formatedFileId].div.remove();
            delete $scope.editors[formatedFileId];
            if ($scope.data.selectedFile != null) {
              if (fileId == $scope.data.selectedFile.id) {
                element[0].children[0].children[0].style.display = 'none';
              }
            }
          }
        };

        /**
         * Hide all editors
         */
        $scope.hideAllEditors = function () {
          for (var i = 0; i < element[0].children[2].children.length; i++) {
            var div = element[0].children[2].children[i];
            if (div.style.display != 'none') {
              div.style.display = 'none';
            }
          }
        };

        /**
         * Show the editor for the file
         * @param fileId File id
         */
        $scope.showEditor = function (fileId) {
          var formatedFileId = $scope.formatFileId(fileId);
          if ($scope.editors[formatedFileId] == null) {
            return;
          }
          console.log('show editor', $scope.editors[formatedFileId]);
          $scope.hideAllEditors();
          $scope.editors[formatedFileId].div.style.display = 'block';
        };

        /**
         * Format the file id to an editor id
         * @param fileId File id
         * @returns Editor id
         */
        $scope.formatFileId = function (fileId) {
          return fileId.replace(/\./g, '_').replace(/\//g, '__').replace(/\\/g, '__');
        };

        /**
         * While editor content changes
         */
        $scope.onContentChange = function () {
          var formatedFileId = $scope.formatFileId($scope.data.selectedFile.id);
          $scope.data.selectedFile.content = $scope.editors[formatedFileId].editor.getValue();
          if ($scope.events.onContentChange) {
            $scope.events.onContentChange($scope.data, $scope.data.selectedFile.id);
          }
        };

        /**
         * Refresh the file content
         */
        $scope.refreshFile = function () {
          if ($scope.events.onRefreshFile) {
            $scope.events.onRefreshFile($scope.data, function () {
              var formatedFileId = $scope.formatFileId($scope.data.selectedFile.id);
              $scope.editors[formatedFileId].editor.setValue($scope.data.selectedFile.content);
            });
          }
        }
      }
    }
  }
);