var IDEBundles = {

  init: function() {
  },

  loadData: function(callback) {
    var state = Store.getState();

    // Bundles in public repository
    BundlesService.getBundlesInPublicRepository(function(bundlesInPublicRepository) {
      state.bundlesInPublicRepository = bundlesInPublicRepository;

      // Bundles in the project
      ProjectsService.getBundlesOfProject(state.auth.userId, state.projectId, function(bundlesOfProject) {
        state.bundlesOfProject = bundlesOfProject;
        if(callback) {
          callback();
        }

      }.bind(this));
    }.bind(this));
  },

  open: function() {
    var html =
      '<div id="bundlesContent"></div>'
    
    $('#bundles').html(html);

    $('#editor').css( "display", "none");
    $('#settings').css( "display", "none");
    $('#generation').css('display', 'none');
    $('#bundles').css( "display", "block");

    this.loadData(function() {
      this.display();
    }.bind(this));
  },

  display: function() {
    var state = Store.getState();

    var html =
      '<div id="bundlesWait"></div>' +
      '<div>' +
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
            '<i class="fa fa-archive"></i>' +
            bundle.name + 
            '<button class="btn waves-effect waves-light red right"' +
                   ' onclick="event.stopPropagation();IDEBundles.removeBundle(\''+bundle.name+'\')"' +
                   ' style="margin-top:2px">Remove</button>' +
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
            '<i class="fa fa-archive"></i>' +
            bundle.name +
            '<button class="waves-effect waves-green btn right"' +
                   ' onclick="event.stopPropagation();IDEBundles.addBundle(\''+bundle.name+'\')"' +
                   ' style="margin-top:2px">Add</button>' +
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
      '</div>'

    $('#bundlesContent').html(html);
    $('#bundlesContent .collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  },

  closeModal: function() {
    $('#bundles').closeModal();

  },

  addBundle: function(bundleName) {
    this.displayWait(bundleName);
    var state = Store.getState();
    ProjectsService.addBundle(state.auth.userId, state.projectId, bundleName, function() {
      console.log('Bundle added : ',bundleName);
      this.loadData(function() {
        IDETreeview.refreshAll();
        IDEBundles.open();
      }.bind(this));
    }.bind(this));
  },

  removeBundle: function(bundleName) {
    var state = Store.getState();
    ProjectsService.removeBundle(state.auth.userId, state.projectId, bundleName, function() {
      console.log('Bundle removed : ',bundleName);
      this.loadData(function() {
        IDETreeview.refreshAll();
        IDEBundles.open();
      }.bind(this));
    }.bind(this));
  },

  displayWait: function(bundleName) {
    var html = 
      '<div>' +
        '<h5>Download of ' + bundleName + ' in progress ...</h5>' +
        '<div class="progress">' +
          '<div class="indeterminate"></div>' +
        '</div>' +
      '</div>'

    $('#bundlesContent').html(html);
  }

};
