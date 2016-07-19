var ToolbarDownload = {

  download: function() {
    var state = Store.getState();

    ProjectsService.downloadZip(state.auth.id, state.projectId);
  }

};