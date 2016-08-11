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

      $scope.events = $scope.data.events;

      /**
       * Create a file
       */
      $scope.createFile = function () {
        var nodeParent = $scope.data.selectedElement;
        if (nodeParent == null) {
          nodeParent = {
            id: '@@_root_@@'
          };
          $scope.onCreateFile(nodeParent);
        } else {
          $scope.onCreateFile(nodeParent);
        }
      };

      /**
       * During file creation
       * @param nodeParent Node parent
       * @returns {Function}
       */
      $scope.onCreateFile = function (nodeParent) {
        // Modal window to create a new file
        $uibModal.open({
          templateUrl: 'app/modal/modal.createfile.html',
          controller: 'modalCtrl',
          resolve: {
            data: {
              nodeParent: nodeParent,
              project: $scope.data.project,
              refreshAll: $scope.refreshAll
            }
          }
        });
      };

      /**
       * Create a folder
       */
      $scope.createFolder = function () {
        console.log('create Folder');
        var nodeParent = $scope.data.selectedElement;
        if (nodeParent == null) {
          nodeParent = {
            id: '@@_root_@@'
          };
          $scope.onCreateFolder(nodeParent);
        } else {
          $scope.onCreateFolder(nodeParent);
        }
      };

      /**
       * During folder creation
       * @param nodeParent Node parent
       */
      $scope.onCreateFolder = function (nodeParent) {
        // Modal window to create a new file
        $uibModal.open({
          templateUrl: 'app/modal/modal.createfolder.html',
          controller: 'modalCtrl',
          resolve: {
            data: {
              nodeParent: nodeParent,
              project: $scope.data.project,
              refreshAll: $scope.refreshAll
            }
          }
        });
      };

      /**
       * Manage the bundles for the current project
       */
      $scope.manageBundle = function () {
        $uibModal.open({
          templateUrl: 'app/modal/modal.managebundle.html',
          controller: 'modalCtrl',
          resolve: {
            data: {
              project: $scope.data.project,
              bundlesForProject: $scope.data.tree.children,
              allBundles: $scope.data.allBundles,
              refreshAll: $scope.refreshAll
            }
          }
        });
      };

      /**
       * Manage the bundles for the current project
       */
      $scope.createEntity = function () {
        $uibModal.open({
          templateUrl: 'app/modal/modal.createentity.html',
          controller: 'modalCtrl',
          resolve: {
            data: {
              modelName: $scope.data.tree.text,
              project: $scope.data.project,
              refreshAll: $scope.refreshAll
            }
          }
        });
      };

      $scope.createModel = function () {
        $uibModal.open({
          templateUrl: 'app/modal/modal.createmodel.html',
          controller: 'modalCtrl',
          resolve: {
            data: {
              project: $scope.data.project
            }
          }
        });
      };

      /**
       * Collapse all elements in the treeview
       */
      $scope.collapseAll = function () {
        console.log('collapseAll');
        var tree = $(element[0].children[1]).jstree();
        if (tree) {
          tree.close_all();
        }
      };

      /**
       * Force a refresh the treeview
       */
      $scope.refreshAll = function () {
        console.log('refreshAll');
        var tree = $(element[0].children[1]).jstree();
        $scope.events.refreshAll(function () {
          tree.settings.core.data = $scope.data.tree;
          tree.refresh();
        });
      };


      /**
       * During file remove
       * @param node File node to remove
       * @param tree Treeview
       */
      $scope.onRemove = function (node, tree) {
        console.log('onRemove');
        tree.delete_node(node);
        if (node.type == 'folder' || node.type == 'models') {
          var folderId = node.id;
          $scope.events.onDeleteFolder($scope.data, folderId)
        }
        if (node.type == 'file' || node.type == 'entity') {
          var fileId = node.id;
          $scope.events.onDeleteFile($scope.data, fileId);
        }
      };

      /**
       * Delete the selected element (folder or file) in the treeview
       */
      $scope.deleteSelectedElementForFiles = function () {
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
       * Delete the selected element (model or entity) in the treeview
       */
      $scope.deleteSelectedElementForModels = function () {
        var elementToDelete = $scope.data.selectedElement;
        var tree = $(element[0].children[1]).jstree();
        console.log('deleteSelectedElement', $scope.data.selectedElement);
        if (elementToDelete && elementToDelete != null) {
          var result = confirm("Voulez-vous supprimer \"" + elementToDelete.text + "\" ?");
          if (result) {
            if (elementToDelete.type == 'entity') {
              $scope.onRemove(elementToDelete, tree);
              $scope.data.selectedElement = null;
            }
            if (elementToDelete.type == 'models') {
              $scope.onRemove(elementToDelete, tree);
              $scope.data.selectedElement = null;
            }
          }
        }
      };

      /**
       * Treeview initialization
       */
      function init() {
        console.log('init treeview', $scope.data.name, $scope.data.tree);
        $(element[0].children[1]).jstree({
          'core': {
            'data': [$scope.data.tree],
            // so that create works
            "check_callback": true
          },
          "types": {
            "default": {
              "icon": "fa fa-exclamation"
            },
            "folder": {
              "icon": "fa fa-folder-o"
            },
            "file": {
              "icon": "fa fa-file-text-o"
            },
            "bundle": {
              "icon": "fa fa-archive"
            },
            "models": {
              "icon": "fa fa-cubes"
            },
            "entity": {
              "icon": "fa fa-cube"
            }
          },
          "contextmenu": {
            // Customize context menu items : http://stackoverflow.com/questions/21096141/jstree-and-context-menu-modify-items
            "items": function (node) {
              var tree = $(element[0].children[1]).jstree(true);
              var items = {};
              if (node.type == 'folder' || node.id == '@@_root_@@' || node.type == 'bundle') {
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
              if (node.type == 'models') {
                items.CreateFolder = {
                  label: "Create entity",
                  action: $scope.createEntity()
                };
                items.RemoveFolder = {
                  label: "Remove models",
                  action: $scope.onRemove(node, tree)
                }
              }
              if (node.type == 'entity') {
                items.CreateFolder = {
                  label: "Create entity",
                  action: $scope.onRemove()
                };
                items.RemoveFolder = {
                  label: "Remove entity",
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
          console.log('treeview one click', $scope.data.selectedElement);
          if (fileFound && (fileFound.type == 'file' || fileFound.type == 'entity')) {
            $scope.data.tree.selectedFile = fileFound;
            if ($scope.events.onClickFile) {
              $scope.events.onClickFile($scope.data, data.node.id);
            }
          }
        }.bind(this));

        // double click
        $(element[0].children[1]).bind("dblclick.jstree", function () {
          if ($scope.events.onDoubleClickFile) {
            if ($scope.data.tree.selectedFile != null) {
              $scope.events.onDoubleClickFile($scope.data, $scope.data.tree.selectedFile.id);
            }
          }
        }.bind(this));
      }

      init();
    }
  }
}])
;