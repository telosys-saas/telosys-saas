'use strict';

/**
 * IDE files treeview
 */
angular.module('ide').directive('treeview', ['$uibModal', function ($uibModal) {
  return {
    scope: {
      data: '='
    },
    templateUrl: 'app/ide/directive/ide.treeview.directive.html',

    link: function ($scope, element, attrs) {

      /**
       * Create a file
       */
      $scope.createFile = function () {
        var tree = $(element[0].children[1]).jstree();
        var nodeParent = $scope.data.selectedElement;
        if (nodeParent == null) {
          nodeParent = {
            id: '@@_root_@@'
          };
          $scope.onCreateFile(nodeParent, tree)();
        } else {
          $scope.onCreateFile(nodeParent, tree)();
        }
      };

      /**
       * During file creation
       * @param nodeParent Node parent
       * @param tree Treeview
       * @returns {Function}
       */
      $scope.onCreateFile = function (nodeParent, tree) {
        return (function (obj) {
          var modalInstance = $uibModal.open({
            templateUrl: 'app/modal/modal.createfile.html',
            controller: 'modalCtrl',
            resolve: {
              data: {
                  nodeParent: nodeParent,
                  project: $scope.data.project
              }
            }
          });
          console.log('onCreateFile nodeParent:', nodeParent);
          modalInstance.result.then(function (file) {
            var node = {
              id: file.id,
              text: file.name,
              type: file.type,
              nodeParentId: file.folderParentId
            };
            tree.create_node(nodeParent, node);
            console.log('creating node', node);
            if ($scope.data.events.onCreateFile) {
              $scope.data.events.onCreateFile(file);
            }
          });
        });
      };

      /**
       * Create a folder
       */
      $scope.createFolder = function () {
        console.log('create Folder');
        var tree = $(element[0].children[1]).jstree();
        var nodeParent = $scope.data.selectedElement;
        if (nodeParent == null) {
          nodeParent = {
            id: '@@_root_@@'
          };
          $scope.onCreateFolder(nodeParent, tree)();
        } else {
          $scope.onCreateFolder(nodeParent, tree)();
        }
      };

      /**
       * During folder creation
       * @param nodeParent Node parent
       * @param tree Treeview
       */
      $scope.onCreateFolder = function (nodeParent, tree) {
        return (function (obj) {
          var modalInstance = $uibModal.open({
            templateUrl: 'app/modal/modal.createfolder.html',
            controller: 'modalCtrl',
            resolve: {
              data: {
                nodeParent: nodeParent,
                project: $scope.data.project
              }
            }
          });

          modalInstance.result.then(function (folder) {
            var node = {
              id: folder.id,
              text: folder.name,
              type: folder.type,
              nodeParentId: folder.folderParentId
            };
            tree.create_node(nodeParent, node);
            console.log('creating node', node);
            if ($scope.data.events.onCreateFolder) {
              $scope.data.events.onCreateFolder(folder);
            }
          });
        });
      };

      /**
       * Collapse all elements in the treeview
       */
      $scope.collapseAll = function () {
        console.log('collapseAll');
        var tree = $(element[0].children[1]).jstree();
        tree.close_all();
      };

      /**
       * Force a refresh of all files
       */
      $scope.refreshAll = function () {
        console.log('refreshAll');
        var tree = $(element[0].children[1]).jstree();
        $scope.data.events.refreshAll();
        tree.settings.core.data = $scope.data.tree;
        tree.refresh();
      };

      /**
       * During file remove
       * @param node File node to remove
       * @param tree Treeview
       */
      $scope.onRemove = function (node, tree) {
        return (function (obj) {
          console.log('onRemove');
          tree.delete_node(node);
          if (node.type == 'folder') {
            var folderId = node.id;
            $scope.data.events.onDeleteFolder(folderId)
          }
          if (node.type == 'file') {
            var fileId = node.id;
            $scope.data.events.onDeleteFile(fileId);
          }
        });
      };

      /**
       * Delete the selected element (folder, file, etc) in the treeview
       */
      $scope.deleteSelectedElement = function () {
        var elementToDelete = $scope.data.selectedElement;
        var tree = $(element[0].children[1]).jstree();
        console.log('deleteSelectedElement', $scope.data.selectedElement);
        if (elementToDelete && elementToDelete != null && elementToDelete.id != '@@_root_@@') {
          var result = confirm("Voulez-vous supprimer \"" + elementToDelete.text + "\" ?");
          if (result) {
            $scope.onRemove(elementToDelete, tree)();
            $scope.data.selectedElement = null;
          }
        }
      };

      /**
       * Treeview initialization
       */
      function init() {
        $(element[0].children[1]).jstree({
          'core': {
            'data': [
              $scope.data.tree
            ],
            // so that create works
            "check_callback": true
          },
          "types": {
            "default": {
              "icon": "fa fa-folder-o"
            },
            "folder": {
              "icon": "fa fa-folder-o"
            },
            "file": {
              "icon": "fa fa-file-text-o"
            }
          },
          "contextmenu": {
            // Customize context menu items : http://stackoverflow.com/questions/21096141/jstree-and-context-menu-modify-items
            "items": function (node) {
              var tree = $(element[0].children[1]).jstree();
              var items = {};
              if (node.type == 'folder' || node.id == '@@_root_@@') {
                items.CreateFile = {
                  label: "Create file",
                  action: $scope.onCreateFile(node, tree)
                };
                items.CreateFolder = {
                  label: "Create folder",
                  action: $scope.onCreateFolder(node, tree)
                };
              }
              if (node.type == 'folder') {
                items.RemoveFolder = {
                  label: "Remove folder",
                  action: $scope.onRemove(node, tree)
                }
              }
              if (node.type == 'file') {
                items.RemoveFile = {
                  label: "Remove file ",
                  action: $scope.onRemove(node, tree)
                }
              }

              return items;
            }.bind(this)
          },
          "plugins": ["contextmenu", "types"]
        });

        /** Functions to detect one click and double click on one node in the treeview */

        // click file (one click)
        $(element[0].children[1]).bind("activate_node.jstree", function (e, data) {
          var fileFound = $scope.data.allFiles[data.node.id];
          $scope.data.selectedElement = data.node;
          console.log('treeview one click', fileFound);
          if (fileFound && (fileFound.type == 'file')) {
            $scope.data.tree.selectedFile = fileFound;
            if ($scope.data.events.onClickFile) {
              $scope.data.events.onClickFile(data.node.id);
            }
          }
        }.bind(this));

        // double click
        $(element[0].children[1]).bind("dblclick.jstree", function () {
          if ($scope.data.events.onDoubleClickFile) {
            if ($scope.data.tree.selectedFile != null) {
              $scope.data.events.onDoubleClickFile($scope.data.tree.selectedFile.id);
            }
          }
        }.bind(this));
      }

      init();
    }
  }
    ;
}])
;