var IDEConsoleModel = {

  init: function() {
    this.refresh();
  },

  display: function() {
    var state = Store.getState();

    var hasError = false;
    var nbErrors = 0;

    var html = 
      '<table>' +
        '<tr>' +
          '<th></th>' +
          '<th>Entity</th>' +
          '<th>Model</th>' +
          '<th>Error</th>' +
        '</tr>'

    var hasError = false;
    if(state.models) {
      for (var i=0; i<state.models.length; i++) {
        var model = state.models[i];
        for (var j=0; j<model.parsingErrors.length; j++) {
          var parsingError = model.parsingErrors[j];
          hasError = true;
          nbErrors++;
          var fileId = this.getFileId(model, parsingError.entityName);
          html += 
            '<tr onclick="IDEAction.openFile(\''+fileId+'\')">' +
              '<td class="center-align" style="padding:0; font-size: 22px; line-height: 22px"><span class="mdi mdi-alert-circle fa-2x"></span></td>' +
              '<td><a href="#">' + parsingError.entityName + '</a></td>' +
              '<td>' + model.name + '</a></td>' +
              '<td>' + parsingError.message + '</td>' +
            '</tr>'
        }
      }
    }

    html += 
      '</table>'

    if(!hasError) {
      html = 
        '<div class="row">' +
          '<div class="col s12">' +
            '<h5>Models : <span class="green-text">OK</span></h5>' +
          '</div>' +
        '</div>'
    }

    if(hasError) {
      $('#console ul.tabs').tabs('select_tab', 'consoleModel');
    }

    if(nbErrors == 0) {
      var titleStatus = 
        ': <span class="green-text">OK</span>'
    } else if(nbErrors == 1) {
      var titleStatus = 
        ': <span class="red-text">1 Error</span>'
    } else {
      var titleStatus = 
        ': <span class="red-text">'+nbErrors+' Errors</span>'
    }

    $('#consoleModelTitleStatus').html(titleStatus);

    $('#consoleModel').html(html);
  },

  getFileId: function(model, entityName) {
    return 'TelosysTools/' + model.name + '_model/' + entityName + '.entity';
  },

  openEntity: function(fileId) {
    var state = Store.getState();
    var openFile = state.openFiles[fileId];
    if(openFile) {
      IDEEditorCodemirror.setFileIsWorkingFile(fileId, true);
    }
  },

  refresh: function() {
    var state = Store.getState();
    ProjectsService.getModels(state.auth.userId, state.projectId, function (models) {
      state.models = models;
      console.log(models);

      this.display();
    }.bind(this));
  }

};
