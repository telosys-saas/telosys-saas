var IDEEditorTabs = {

  init: function() {
    var state = Store.getState();
    if(state.fileId) {
      var html = 
        '<div class="col s12">' +
          '<ul class="tabs">' +
            '<li class="tab col s3"><a class="active" href="#editor1">'+state.fileId+'</a></li>' +
          '</ul>' +
        '</div>'
      $('#editorTabs').html(html);
      $('#editorTabs ul.tabs').tabs();
    }
  }

};
