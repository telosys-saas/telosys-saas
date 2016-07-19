var fileseparator = '/';

var IDETreeview = {
  init: function() {
    var state = Store.getState();
    state.tree = {};
    FilesService
      .getFilesForProject(state.auth.userId, state.projectId)
      .then(function(rootFolder) {
        var root = this.convertFolderToJson(rootTree, null, 'root');
        state.tree.root = root;

        return TelosysService
          .getTelosysFolderForProject(state.auth.userId, state.projectId)
      }.bind(this))
      .then(function(telosysFolder) {
        var telosys = this.convertFolderToJson(telosysFolder, null, 'telosys');
        state.tree.telosys = telosys;

        $('#jstree').html('<div id="jstreecontent" class="treeview"></div>');
        state.jstree = $('#jstreecontent').jstree({
                  'core': {
                    'data': [
                      state.tree.telosys,
                      state.tree.root
                    ],
                    // so that create works
                    "check_callback" : true
                  },
                  "types" : {
                    "folder" : {
                      "icon" : "fa fa-folder-o"
                    },
                    "project" : {
                      "icon" : "fa fa-folder-o"
                    },
                    "telosys" : {
                      "icon" : "icon-telosys-simple"
                    },
                    "bundles" : {
                      "icon" : "fa fa-archive"
                    },
                    "bundle" : {
                      "icon" : "fa fa-archive"
                    },
                    "model" : {
                      "icon" : "fa fa-cubes"
                    },
                    "entity" : {
                      "icon" : "fa fa-cube"
                    },
                    "file" : {
                      "icon" : "fa fa-file-text-o"
                    }
                  },
                  "contextmenu": {
                    // Customize context menu items : http://stackoverflow.com/questions/21096141/jstree-and-context-menu-modify-items
                    "items": function(node) {
                      var tree = $("#jstreecontent").jstree(true);
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
                      console.log(node);
                      var items = {};
                      if(node.id == '@@_root_@@' || node.type == 'folder' || node.type == 'bundle') {
                        items.CreateFile = {
                          label: "Create file",
                          action: this.onCreateFile(node, tree)
                        };
                        items.CreateFolder = {
                          label: "Create folder",
                          action: this.onCreateFolder(node, tree)
                        };
                      }
                      if(node.type == 'telosys') {
                        items.CreateFolder = {
                          label: "Create model",
                          action: this.onCreateModel(node, tree)
                        };
                      }
                      if(node.type == 'model') {
                        items.CreateFolder = {
                          label: "Create entity",
                          action: this.onCreateModelEntity(node, tree)
                        };
                      }
                      /*
                       if(node.type == 'file') {
                       items.Copy = {
                       "separator_before": true,
                       "separator_after": false,
                       "label": "Copy",
                       "action": this.onCopy(node, tree)
                       };
                       }
                       if(node.type == 'folder') {
                       var state = Store.getState();
                       if(state.tree.copy) {
                       items.Paste = {
                       "separator_before": true,
                       "separator_after": false,
                       "label": "Paste "+state.tree.copy,
                       "action": this.onPaste(node, tree)
                       };
                       }
                       }
                       */
                      /*
                       items.Rename = {
                       "separator_before": true,
                       "separator_after": false,
                       "label": "Rename",
                       "action": this.onRename(node, tree)
                       };
                       */
                      if(node.id != '@@_root_@@' && node.type != 'telosys' && node.type != 'bundles' && node.type != 'bundle') {
                        items.Remove = {
                          "separator_before": false,
                          "separator_after": false,
                          "label": "Remove",
                          "action": this.onRemove(node, tree)
                };
              }
              return items;
            }.bind(this)
          },
          "plugins" : [ "contextmenu", "types" ]
        });
        // For DoubleClick detection : http://stackoverflow.com/questions/3674625/how-can-i-attach-custom-behaviour-to-a-double-click-in-jstree
        state.tree.selected = null;
        // single click
        $('#jstreecontent').on("activate_node.jstree", function(e, data) {
          state.tree.selected = {
            e: e,
            data: data
          };
          this.onClick(e, data);
        }.bind(this));
        // double click
        $('#jstreecontent').bind("dblclick.jstree", function () {
          if (state.tree.selected) {
            this.onDoubleClick(state.tree.selected.e, state.tree.selected.data);
          }
        }.bind(this));
      }.bind(this));
  },

  refreshAll: function() {
    var state = Store.getState();
    FilesService
      .getFilesForProject(state.auth.userId, state.projectId)
      .then(function(rootFolder) {
        state.tree = {};
        var root = this.convertFolderToJson(rootTree, null);
        state.tree.root = root;

        return TelosysService
          .getTelosysFolderForProject(state.auth.userId, state.projectId)
      }.bind(this))
      .then(function(telosysFolder) {
        var telosys = this.convertFolderToJson(telosysFolder, null);
        state.tree.telosys = telosys;

        var jstree = $.jstree.reference('#jstreecontent');
        jstree.settings.core.data = [
          state.tree.telosys, state.tree.root
        ];
        jstree.refresh();
      }.bind(this));
  },

  onClick: function(e, data) {
    console.log('onClick');
    if(data.node.type == 'file' || data.node.type == 'entity') {
      //if(data.node.type == 'model') {
      //  var fileId = data.node.id.substring(0, data.node.id.indexOf('_model')) + '.model';
      //} else {
        var fileId = data.node.id;
      //}
      var state = Store.getState();
      var oldFocusFileId = state.fileId;
      state.fileId = fileId;
      if(!state.openFiles[fileId]) {
        state.openFiles[fileId] = {};
      }
      IDEEditor.init();
      if(oldFocusFileId != fileId) {
        IDEWorkingFiles.display();
      }
    }
    if(data.node.type == 'folder') {
      data.instance.toggle_node(data.node);
    }
    if(data.node.type == 'telosys' || data.node.type == 'bundles' || data.node.type == 'bundle' || data.node.type == 'model') {
      if(!data.instance.is_open(data.node)) {
        data.instance.open_node(data.node);
      }
      if(data.node.type == 'telosys') {
        IDESettings.open();
      }
      if(data.node.type == 'bundles') {
        IDEBundles.open();
      }
      if(data.node.type == 'model') {
        var state = Store.getState();
        state.modelName = data.node.text;
        IDEGeneration.open();
      }
    }
  },

  onDoubleClick: function(e, data) {
    console.log('onDoubleClick');
    if(data.node.type == 'file' || data.node.type == 'entity') {
      var state = Store.getState();
      var fileId = data.node.id;
      var openFile = state.openFiles[fileId];
      if(openFile) {
        IDEEditorCodemirror.setFileIsWorkingFile(fileId, true);
      }
    }
  },

  onCreateFile: function(nodeParent, tree) {
    return (function (obj) {
      var node = {
        type: 'file'
      };
      node = tree.create_node(nodeParent, node);
      tree.edit(node, null, function(node, status) {
        var state = Store.getState();
        if (nodeParent.id == '@@_root_@@') {
          var file = {
            id: node.text,
            name: node.text,
            folderParentId: ''
          };
        } else {
          var file = {
            id: nodeParent.id + fileseparator + node.text,
            name: node.text,
            folderParentId: nodeParent.id
          };
        }
        tree.set_id(node,file.id);
        FilesService.createFileForProject(state.auth.userId, state.projectId, file, function(folder) {
          console.log('file created', file);
        });
      });
    });
  },

  onCreateFolder: function(nodeParent, tree) {
    return (function (obj) {
      var node = {
        type: 'folder'
      };
      node = tree.create_node(nodeParent, node);
      tree.edit(node, null, function(node, status) {
        var state = Store.getState();
        if (nodeParent.id == '@@_root_@@') {
          var folder = {
            id: node.text,
            name: node.text,
            folderParentId: ''
          };
        } else {
          var folder = {
            id: nodeParent.id + fileseparator + node.text,
            name: node.text,
            folderParentId: nodeParent.id
          };
        }
        tree.set_id(node,folder.id);
        FilesService.createFolderForProject(state.auth.userId, state.projectId, folder, function(folder) {
          console.log('folder created', folder);
        });
      });
    });
  },

  onCreateModel: function(nodeParent, tree) {
    return (function (obj) {
      var node = {
        type: 'model'
      };
      node = tree.create_node(nodeParent, node);
      tree.edit(node, null, function(node, status) {
        var state = Store.getState();
        tree.set_id(node,node.text);
        ProjectsService.createModel(state.auth.userId, state.projectId, node.text, function(model) {
          console.log('model created', model);
          IDETreeview.refreshAll();
        });
      });
    });
  },

  onCreateModelEntity: function(nodeParent, tree) {
    return (function (obj) {
      var node = {
        type: 'entity'
      };
      node = tree.create_node(nodeParent, node);
      var modelName = nodeParent.text;

      tree.edit(node, null, function(node, status) {
        var state = Store.getState();
        var projectId = state.projectId;

        node.text = capitalize(node.text);

        var entityId = nodeParent.id + fileseparator + node.text
        if(entityId.indexOf('.entity') == -1) {
          entityId += '.entity';
        }

        var entity = {
          id: entityId,
          name: node.text,
          folderParentId: nodeParent.id
        };
        tree.set_id(node,entity.id);
        TelosysService.createEntityForModel(state.auth.userId, projectId, modelName, entity.name, function() {
          console.log('entity file created', entity.name);
          IDETreeview.refreshAll();
        });
      });
    });
  },

  onRemove: function(node, tree) {
    return (function(obj) {
      tree.delete_node(node);
      var state = Store.getState();
      if(node.type == 'file' || node.type == 'entity') {
        var fileId = node.id;
        FilesService.deleteFileForProject(state.auth.userId, state.projectId, fileId, function() {
          console.log("File '"+node.id+"' deleted");
          IDEAction.closeFile(node.id);
        });
      }
      if(node.type == 'folder') {
        var folderId = node.id;
        FilesService.deleteFolderForProject(state.auth.userId, state.projectId, folderId, function() {
          console.log("Folder '"+node.id+"' deleted");
          for(var openFileId in state.openFiles) {
            if(openFileId.indexOf(node.id) != -1) {
              IDEAction.closeFile(openFileId);
            }
          }
        });
      }
      if(node.type == 'model') {
        var modelName = node.text;
        ProjectsService.deleteModel(state.auth.userId, state.projectId, modelName, function() {
          console.log("Model '"+modelName+"' deleted");
          for(var openFileId in state.openFiles) {
            if(openFileId.indexOf(modelName) != -1) {
              IDEAction.closeFile(openFileId);
            }
          }
        });
      }
    }.bind(this));
  },

  onRename: function(node, tree) {
    return (function (obj) {
      tree.edit(node);
    }).bind(this);
  },

  onCopy: function(node, tree) {
    return (function(obj) {
      tree.copy(node);
      var state = Store.getState();
      state.tree.copy = node.text;
    }.bind(this));
  },

  onPaste: function(node, tree) {
    return (function(obj) {
      var state = Store.getState();
      if(state.tree.copy) {
        tree.paste(node);
      }
      delete state.tree.copy;
    }.bind(this));
  },

  focus: function(fileId) {
    var jstree = $.jstree.reference('#jstreecontent');
    jstree.deselect_all();
    jstree.select_node([fileId]);
  },

  focusAndOpenNode: function(fileId) {
    var jstree = $.jstree.reference('#jstreecontent');
    jstree.deselect_all();
    jstree.select_node([fileId]);
    jstree.open_node(fileId);
  },

  collapseAll: function(event) {
    if(event) {
      event.stopPropagation();
    }

    var jstree = $.jstree.reference('#jstreecontent');
    jstree.close_all();
  },

  convertFolderToJson: function(folder, parent, type) {
    console.log('folder : ', folder.name);

    if(type == 'root') {
      var currentNode = {
        id: '@@_root_@@',
        text: folder.name,
        type: 'project',
        children: []
      };
    }
    else if(type == 'telosys') {
      var currentNode = {
        id: '@@_telosys_@@',
        text: folder.name,
        type: 'telosys',
        children: []
      };
    }
    else {
      var currentNode = {
        id: folder.id,
        text: folder.name,
        type: folder.type,
        children: []
      };
    }

    if(!parent) {
      currentNode.state = {
        'opened' : true
      };
    }

    if (folder.folders) {
      for (var i = 0; i < folder.folders.length; i++) {
        var folderSub = folder.folders[i];
        var folderSubNode = this.convertFolderToJson(folderSub, currentNode);
        if(folderSubNode) {
          currentNode.children.push(folderSubNode);
        }
      }
    }

    if (folder.files) {
      for (var i = 0; i < folder.files.length; i++) {
        var file = folder.files[i];
        var fileNode = this.convertFileToJson(file, currentNode);
        if(fileNode) {
          currentNode.children.push(fileNode);
        }
      }
    }

    return currentNode;
  },

  convertFileToJson: function(file, parent) {

    var currentNode = {
      id: file.id,
      text: file.name,
      type: file.type
    };
    return currentNode;
  }

};

function capitalize(string) {
  if(string == null || string.length == 0) {
    return string;
  }
  var txt = string.charAt(0).toUpperCase();
  if(string.length > 1) {
    txt += string.slice(1);
  }
  return txt;
}
