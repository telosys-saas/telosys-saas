var IDEWorkingFiles = {

  init: function() {
    this.display();
  },

  display: function() {
    var state = Store.getState();

    var html =
      '<ul class="collection">';

    for(var fileId in state.openFiles) {
      var openFile = state.openFiles[fileId];
      if(!openFile.isWorkingFile) {
        continue;
      }

      var filename = fileId.substring(fileId.lastIndexOf(fileseparator)+1);
      var filepath = fileId.substring(0,fileId.lastIndexOf(fileseparator));
      html +=
        '<li class="collection-item truncate';

      if(state.fileId == fileId) {
        html += ' working-file-selected';
      }

      html +=
        '" id="workingfiles_'+this.formatFileId(fileId)+'">';

      if(openFile.isModified) {
        html +=
          '<i class="fa fa-circle"></i> ';
      }
      else {
        html +=
          '<a href="#" onclick="IDEWorkingFiles.closeFile(\'' + fileId + '\')">' +
          '<i class="fa fa-times fa-lg"></i> ' +
          '</a>';
      }

      html +=
          '&nbsp; ' +
          '<a href="#" onclick="IDEWorkingFiles.showFile(\'' + fileId + '\')">' +
            filename +
            ' <span style="font-size: smaller; color: gray;">' + filepath + '</span>' +
          '</a>' +
        '</li>';
    }

    html +=
      '</ul>';
    $('#workingfiles').html(html);
  },

  refreshAll: function() {
    var state = Store.getState();
    for(var fileId in state.openFiles) {
      IDEEditorCodemirror.refreshFile(fileId);
    }
  },

  closeFile: function(fileId) {
    var state = Store.getState();
    $('#workingfiles_'+this.formatFileId(fileId)).remove();
    IDEEditorCodemirror.closeFile(fileId);
  },

  showFile: function(fileId) {
    var state = Store.getState();
    var oldStateFileId = state.fileId;
    state.fileId = fileId;
    IDEEditor.init();
    if(oldStateFileId != fileId) {
      this.display();
    }
    IDETreeview.focus(fileId);
  },

  formatFileId: function(fileId) {
    return fileId.replace(/\./g,'_').replace(/\//g,'__').replace(/\\/g,'__');
  },

  saveAll: function(event) {
    if(event != null) {
      event.stopPropagation();
    }

    var state = Store.getState();
    for(var fileId in state.openFiles) {
      IDEEditorCodemirror.saveFile(fileId);
    }
  },

  closeAll: function(event) {
    if(event != null) {
      event.stopPropagation();
    }

    var state = Store.getState();
    for(var fileId in state.openFiles) {
      this.closeFile(fileId);
    }

  }

};