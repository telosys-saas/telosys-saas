var ToolbarBundles = {

  init: function() {
  },

  openModal: function() {
    var html = 
      '<div id="bundlesModal" class="modal modal-fixed-footer"></div>'
    $('#bundlesDiv').html(html);
    $('#bundlesModal').openModal();
   
    this.loadData(function() {
      this.displayModal();
    }.bind(this));
  },

  loadData: function(callback) {
    var state = Store.getState();

    // Bundles in public repository
    BundlesService.getBundlesInPublicRepository(function(bundlesInPublicRepository) {
      state.bundlesInPublicRepository = bundlesInPublicRepository;

      // Bundles in the project
      ProjectsService.getBundlesOfProject(state.auth.userId, state.projectId, function(bundlesOfProject) {
        state.bundlesOfProject = bundlesOfProject;
        console.log('bundles : ',bundlesOfProject);
        if(callback) {
          callback();
        }

      }.bind(this));
    }.bind(this));
  },

  displayModal: function() {
    var state = Store.getState();

    var html = 
      '<div class="modal-content">' +
        '<div class="row">' +
          '<div class="col s12">' +
            '<h4>Bundles</h4>' +
            '<h5>Current bundles of the project</h5>' +
            '<ul class="collapsible" data-collapsible="accordion">'

    for (var i=0; i<state.bundlesOfProject.length; i++) {
      var bundle = state.bundlesOfProject[i];
      html += 
              '<li>' +
                '<div class="collapsible-header">' +
                  '<i class="mdi mdi-package"></i>' +
                    bundle.name + 
                  '<button class="btn red right" onclick="event.stopPropagation();ToolbarBundles.removeBundle(\''+bundle.name+'\')" style="margin-top:2px">Remove</button>' +
                '</div>' +
                '<div class="collapsible-body"><p>' +
                  bundle.name + 
                '</p></div>' +
              '</li>'
    }

    html += 
            '</ul>' +
            '<h5>Bundles in the public repository</h5>' +
            '<ul class="collapsible" data-collapsible="accordion">'

    for (var i=0; i<state.bundlesInPublicRepository.length; i++) {
      var bundle = state.bundlesInPublicRepository[i];
      var isBundleDownloaded = false;
      for (var j=0; j<state.bundlesOfProject.length; j++) {
        if(state.bundlesOfProject[j].name == bundle.name) {
          isBundleDownloaded = true;
        }
      }
      if(isBundleDownloaded) {
        continue;
      }
      html += 
              '<li>' +
                '<div class="collapsible-header">' +
                  '<i class="mdi mdi-package"></i>' +
                    bundle.name + 
                  '<button class="btn green right" onclick="event.stopPropagation();ToolbarBundles.addBundle(\''+bundle.name+'\')" style="margin-top:2px">Add</button>' +
                  '</div>' +
                '<div class="collapsible-body"><p>' +
                  bundle.description + 
                '</p>' +
                '</div>' +
              '</li>'
    }

    html += 
            '</ul>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat "onclick="ToolbarBundles.closeModal()">Close</a>' +
      '</div>'

    $('#bundlesModal').html(html);
    $('#bundlesModal .collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  },

  closeModal: function() {
    $('#bundlesModal').closeModal();

  },

  addBundle: function(bundleName) {
    var state = Store.getState();
    ProjectsService.addBundle(state.auth.userId, state.projectId, bundleName, function() {
      console.log('Bundle added : ',bundleName);
      this.loadData(function() {
        this.displayModal();
        IDETreeview.refreshAll();
      }.bind(this));
    }.bind(this));
  },

  removeBundle: function(bundleName) {
    var state = Store.getState();
    ProjectsService.removeBundle(state.auth.userId, state.projectId, bundleName, function() {
      console.log('Bundle removed : ',bundleName);
      this.loadData(function() {
        this.displayModal();
        IDETreeview.refreshAll();
      }.bind(this));
    }.bind(this));
  }

};
