var ToolbarProjectsAction = {

  onChangeProject: function(projectId, callback) {
    var state = Store.getState();

    var hasChangedProject = false;
    console.log('projectId : ',projectId);
    console.log('state.projectId : ',state.projectId);
    if(projectId != state.projectId) {
      Store.init()
        .then(function(state) {
	      //if (state.projectId == null || confirm("Close the project " + state.projectId)) {
	        state.projectId = projectId;
	      //}
	      hasChangedProject = true;
	
	      IDEWorkingFiles.closeAll();
	
	      if(state.projectId) {
	        state.page = 'ide';
	      } else {
	        state.page = 'projects';
	      }
	      
	      callback(hasChangedProject, state.projectId);
        });

    } else {

      if(state.projectId) {
        state.page = 'ide';
      } else {
        state.page = 'projects';
      }

      callback(false, state.projectId);
    }

  }

};