var ToolbarGeneration = {

  init: function() {
  },

  openModal: function() {
    var html = 
      '<div id="generationModal" class="modal modal-footer"></div>'
    $('#generationModalDiv').html(html);
    $('#generationModal').openModal();

    this.loadData(function() {
      this.displayModal();
    }.bind(this));
  },

  loadData: function(callback) {
    var state = Store.getState();

    ProjectsService.getBundlesOfProject(state.auth.userId, state.projectId, function(bundlesOfProject) {
      state.bundlesOfProject = bundlesOfProject;

      ProjectsService.getModels(state.auth.userId, state.projectId, function (models) {
        state.models = models;
        console.log(models);
        if (callback) {
          callback();
        }
      });
    });
  },

  displayModal: function() {
    var state = Store.getState();

    var html = 
      '<div class="modal-content">' +
        '<h5>Generation</h5>' +
        '<div class="row">' +
          '<div class="input-field col s12">' +
            '<h6>Select the model :</h6>' +
            '<ul class="collection">'

    if(state.models) {
      for (var i = 0; i < state.models.length; i++) {
        var model = state.models[i];
        html += 
          '<li class="collection-item" onclick="ToolbarGeneration.openGeneration(\'' + model.name + '\')" style="cursor: pointer;">' +
            '<a href="#"><span class="fa fa-cubes"></span> &nbsp; ' + model.name + '</a>' +
          '</li>'
      }
    }

    html += 
            '</ul>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat" onclick="ToolbarGeneration.closeModal()">Cancel</a>' +
      '</div>'

    $('#generationModal').html(html);
  },

  closeModal: function() {
    $('#generationModal').closeModal();
  },

  openGeneration: function(modelName) {
    var state = Store.getState();
    state.modelName = modelName;
    IDEGeneration.open();
    var fileId = 'TelosysTools/'+modelName+'_model';
    IDETreeview.focusAndOpenNode(fileId);
    this.closeModal();
  }

};
