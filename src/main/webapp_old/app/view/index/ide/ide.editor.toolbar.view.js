
var IDEEditorToolbar = {
  init: function () {
    this.display();
  },

  display: function() {
    var state = Store.getState();
    if(state.fileId) {
      var fileId = state.fileId;
      var filename = fileId.substring(fileId.lastIndexOf('/')+1);
      var filepath = fileId.substring(0,fileId.lastIndexOf('/'));
      var html = 
        '<button class="waves-effect waves-green btn" onclick="IDEEditorToolbar.saveFile()">' +
          '<span class="fa fa-floppy-o fa-lg"></span> Save' +
        '</button>' +
        '&nbsp;'

      var openFile = state.openFiles[fileId];
      if(openFile.isModified) {
        html += 
          '<i class="fa fa-circle"></i>'
      }

      html +=
        filename + 
        '<span style="font-size: smaller; color: gray;">' + filepath + '</span>' +
        '<a href="#" style="float:right" onclick="IDEWorkingFiles.closeFile(\'' + fileId + '\')"><i class="fa fa-times fa-2x"></i></a>' +
        '<a href="#" style="float:right" onclick="IDEEditorCodemirror.refreshFile(\'' + fileId + '\', true)"><i class="fa fa-refresh fa-2x"></i> </a>'
    } else {
      var html = 
        '&nbsp;'
    }
    $('#editorToolbar').html(html);
  },

  saveFile: function() {
    IDEEditorCodemirror.saveFile();
  }

};
