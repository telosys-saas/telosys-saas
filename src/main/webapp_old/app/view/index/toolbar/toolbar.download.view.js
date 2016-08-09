var ToolbarDownload = {

  download: function() {
    var state = Store.getState();

    ProjectsService.downloadZip(state.profile.id, state.projectId);
  }

};