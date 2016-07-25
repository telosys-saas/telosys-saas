'use strict';

angular.module('ide').directive('treeview', function () {
  return {
    scope: {
      data: '='
    },
    templateUrl: 'app/ide/directive/ide.treeview.directive.html',

    link: function ($scope, element, attrs) {

      $scope.$watchCollection('data.allFiles', function (newValue, oldValue) {
        if (newValue)
          console.log("allFiles change in treeview");
      }, true);

      $scope.createFile = function () {
        var tree = $(element[0].children[1]).jstree();
        var nodeParent = $scope.data.selectedElement;
        console.log('create file',nodeParent);
        if(nodeParent == null){
          nodeParent = {
            id : '@@_root_@@'
          };
          $scope.onCreateFile(nodeParent, tree)();
        }else if(nodeParent.type == "file"){
          nodeParent = {
            id : $scope.data.selectedElement.parent
          };
          $scope.onCreateFile(nodeParent, tree)();
        }else {
          $scope.onCreateFile(nodeParent, tree)();
        }
      };

      $scope.onCreateFile = function (nodeParent, tree) {
        return (function (obj) {
          var node = {
            type: 'file'
          };
          console.log('creating file', tree);
          node = tree.create_node(nodeParent, node);
          tree.edit(node, null, function (node, status) {
            if (nodeParent.id == '@@_root_@@') {
              var file = {
                id: node.text,
                name: node.text,
                folderParentId: ''
              };
            } else {
              var file = {
                id: nodeParent.id + '/' + node.text,
                name: node.text,
                folderParentId: nodeParent.id
              };
            }
            tree.set_id(node, file.id);
            console.log('file created', file);
            if ($scope.data.events.onCreateFile) {
              $scope.data.events.onCreateFile(file);
            }
          });
        });
      };

      $scope.createFolder = function () {
        console.log('create Folder');
        var tree = $(element[0].children[1]).jstree();
        var nodeParent = $scope.data.selectedElement;
        if(nodeParent == null){
           nodeParent = {
            id : '@@_root_@@'
          };
          $scope.onCreateFolder(nodeParent, tree)();
        }else if(nodeParent.type == 'file'){
          nodeParent = {
            id : $scope.data.selectedElement.parent
          };
          $scope.onCreateFolder(nodeParent, tree)();
        }else {
          $scope.onCreateFolder(nodeParent, tree)();
        }
      };

      $scope.onCreateFolder = function (nodeParent, tree) {
        return (function (obj) {
          var node = {
            type: 'folder'
          };
          node = tree.create_node(nodeParent, node);
          tree.edit(node, null, function (node, status) {
            if (nodeParent.id == '@@_root_@@') {
              var folder = {
                id: node.text,
                name: node.text,
                folderParentId: ''
              };
            } else {
              var folder = {
                id: nodeParent.id + '/' + node.text,
                name: node.text,
                folderParentId: nodeParent.id
              };
            }
            tree.set_id(node, folder.id);
            console.log('folder created');
            if ($scope.data.events.onCreateFolder) {
              $scope.data.events.onCreateFolder(folder);
            }
          });
        });
      };

      $scope.collapseAll = function (event) {
        console.log('collapseAll');
        if (event) {
          event.stopPropagation();
        }
        var tree = $(element[0].children[1]).jstree();
        tree.close_all();
      };

      $scope.refreshAll = function () {
        console.log('refreshAll');
        var tree = $(element[0].children[1]).jstree();
        $scope.data.events.refreshAll();
        tree.settings.core.data = $scope.data.tree;
        tree.refresh();
      };

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

      function init() {
        //console.log('tree :', $scope.tree);
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

              /*
               separator_before - a boolean indicating if there should be a separator before this item
               separator_after - a boolean indicating if there should be a separator after this item
               _disabled - a boolean indicating if this action should be disabled
               label - a string - the name of the action (could be a function returning a string)
               action - a function to be executed if this item is chosen
               icon - a string, can be a path to an icon or a className, if using an image that is in the current directory use a ./ prefix, otherwise it will be detected as a class
               shortcut - keyCode which will trigger the action if the menu is open (for example 113 for rename, which equals F2)
               shortcut_label - shortcut label (like for example F2 for rename)
               */
              //console.log(node);
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
  };
});