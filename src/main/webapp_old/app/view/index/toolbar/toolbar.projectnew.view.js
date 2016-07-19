var ToolbarProjectnew = {

  init: function() {
    this.display();
  },

  display: function() {
    $('#projectnew').html(
      '<div id="projectnewModal" class="modal">' +
        '<div class="modal-content">' +
          '<h4>Create a new project</h4>' +
          '<div class="row">' +
            '<div class="input-field col s12">' +
              '<input type="text" id="projectnewname" />' +
              '<label for="projectnewname">Project name</label>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat" onclick="ToolbarProjectnew.createProject()">Create</a>' +
          '<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat" onclick="ToolbarProjectnew.cancel()">Cancel</a>' +
        '</div>' +
      '</div>'
    );
  },

  openModal: function() {
    $('#projectnewModal').openModal();
  },

  cancel: function() {
    $('#projectnewModal').closeModal();
  },

  createProject: function() {
    var projectName = document.getElementById('projectnewname').value;
    var state = Store.getState();
    ProjectsService.createProject(state.auth.userId, projectName, function(isOk) {
      if(isOk) {
        Store.init()
          .then(function(state) {
	        state.projectId = projectName;
	        state.page = 'ide';
	        Main.display();
          });
      }
    });
  }

};
