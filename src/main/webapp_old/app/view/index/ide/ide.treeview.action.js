
var IDETreeviewAction = {

  onLoad: function(callback) {
    var state = Store.getState();
    FilesService
      .getFilesForProject(state.profile.userId, state.projectId)
      .then(function(rootFolder) {
        state.tree = {};
        var root = this.convertFolderToJson(rootTree, null);
        state.tree.root = root;

        callback();
      });
  }

};