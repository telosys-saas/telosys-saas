var IDEAction = {

  closeFile: function(fileId) {
    var state = Store.getState();
    IDEWorkingFiles.closeFile(fileId);
    if(fileId == state.fileId) {
      var state = Store.getState();
      delete state.fileId;
      IDEEditorCodemirror.closeFile();
    }
    IDEEditor.init();
  },

  openFile: function(fileId) {
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
  },

  saveFile: function(fileId) {
    var state = Store.getState();

    if(fileId == null) {
      fileId = state.fileId;
    }

    if(fileId && state.openFiles[fileId]) {
      var file = {
        id: fileId,
        content: state.openFiles[fileId].editor.getValue()
      };
      FilesService.saveFileForProject(state.auth.userId, state.projectId, file,
        function () {
          console.log('file saved : ',fileId);
          IDEEditorCodemirror.setFileIsModified(fileId, false);

          if(fileId.indexOf('.entity') != -1) {
            IDEConsoleModel.refresh();
          }

        }.bind(this));
    }
  }

};