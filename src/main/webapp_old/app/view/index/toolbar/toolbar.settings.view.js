var ToolbarSettings = {

  init: function() {
  },

  loadData: function(callback) {
    var state = Store.getState();
    ProjectsService.getProjectConfiguration(state.auth.userId, state.projectId, function(projectConfiguration) {
      state.projectConfiguration = projectConfiguration;
      if(callback) {
        callback();
      }
    });
  },

  display: function() {
    var state = Store.getState();
    $('#settingsDiv').html(
      '<div id="settingsModal" class="modal modal-fixed-footer">' +
        '<div class="modal-content">' +
          '<h4>Project Settings</h4>' +
          '<ul class="collapsible" data-collapsible="accordion">' +
        /*
        <!--
            '<li>' +
              '<div class="collapsible-header">' +
                '<i class="mdi"></i>' +
                'Configuration' +
              '</div>' +
              '<div class="collapsible-body">' +
                + this.displayConfiguration() +
             '</div>' +
            '</li>' +
        -->
        */
           '<li>' +
              '<div class="collapsible-header">' +
                '<i class="mdi mdi-border-all"></i>' +
                'Packages' +
              '</div>' +
              '<div class="collapsible-body">' +
                this.displayPackages(state.projectConfiguration.variables) + 
              '</div>' +
            '</li>' +
            '<li>' +
              '<div class="collapsible-header">' +
                '<i class="mdi mdi-folder-multiple"></i>' +
                'Folders' +
              '</div>' +
              '<div class="collapsible-body">' +
                this.displayDirectories(state.projectConfiguration.variables) + 
              '</div>' +
            '</li>' +
          '</ul>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat" onclick="ToolbarSettings.save()">Save</a>' +
          '<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat" onclick="ToolbarSettings.closeModal()">Cancel</a>' +
        '</div>' +
      '</div>'
    );
  },

  displayConfiguration: function() {
    var state = Store.getState();
    var html = 
      '<div class="row">' +
        '<div class="input-field col s12">' +
          '<h6>Configuration</h6>' +
        '</div>' +
        '<div class="input-field col s6">' +
          '<input type="text" id="configProject_projectName" value="'+state.projectId+'" />' +
          '<label for="configProject_projectName"'+((state.projectId)?' class="active"':'')+'>Project name</label>' +
        '</div>' +
      '</div>';
    
    return html;
  },

  displayPackages: function(variables) {
    var html = 
      '<div class="row">' +
        '<div class="input-field col s12">' +
          '<h6>Packages</h6>' +
        '</div>' +
        '<div class="input-field col s6">' +
          '<input type="text" id="configTelosysCfg_ROOT_PKG" value="'+variables.ROOT_PKG+'" />' +
          '<label for="configTelosysCfg_ROOT_PKG"'+((variables.ROOT_PKG)?' class="active"':'')+'>Root package : $ROOT_PKG</label>' +
        '</div>' +
        '<div class="input-field col s6">' +
          '<input type="text" id="configTelosysCfg_ENTITY_PKG" value="'+variables.ENTITY_PKG+'" />' +
          '<label for="configTelosysCfg_ENTITY_PKG"'+((variables.ENTITY_PKG)?' class="active"':'')+'>Entities package : $ENTITY_PKG</label>' +
        '</div>' +
      '</div>'
    
    return html;
  },

  displayDirectories: function(variables) {
    var html = 
      '<div class="row">' +
        '<div class="input-field col s12">' +
          '<h6>Folders</h6>' +
        '</div>' +
        '<div class="input-field col s6">' +
          '<input type="text" id="configTelosysCfg_SRC" value="'+variables.SRC+'" />' +
          '<label for="configTelosysCfg_SRC"'+((variables.SRC)?' class="active"':'')+'>Sources folder : $SRC</label>' +
        '</div>' +
        '<div class="input-field col s6">' +
          '<input type="text" id="configTelosysCfg_RES" value="'+variables.RES+'" />' +
          '<label for="configTelosysCfg_RES"'+((variables.RES)?' class="active"':'')+'>Resources folder : $RES</label>' +
        '</div>' +
        '<div class="input-field col s6">' +
          '<input type="text" id="configTelosysCfg_TEST_SRC" value="'+variables.TEST_SRC+'" />' +
          '<label for="configTelosysCfg_TEST_SRC"'+((variables.TEST_SRC)?' class="active"':'')+'>Test sources folder : $TEST_SRC</label>' +
        '</div>' +
        '<div class="input-field col s6">' +
          '<input type="text" id="configTelosysCfg_TEST_RES" value="'+variables.TEST_RES+'" />' +
          '<label for="configTelosysCfg_TEST_RES"'+((variables.TEST_RES)?' class="active"':'')+'>Test resources folder : $TEST_RES</label>' +
        '</div>' +
        '<div class="input-field col s6">' +
          '<input type="text" id="configTelosysCfg_WEB" value="'+variables.WEB+'" />' +
          '<label for="configTelosysCfg_WEB"'+((variables.WEB)?' class="active"':'')+'>Web folder : $WEB</label>' +
        '</div>' +
        '<div class="input-field col s6">' +
          '<input type="text" id="configTelosysCfg_DOC" value="'+variables.DOC+'" />' +
          '<label for="configTelosysCfg_DOC"'+((variables.DOC)?' class="active"':'')+'>Documentation folder : $DOC</label>' +
        '</div>' +
        '<div class="input-field col s6">' +
          '<input type="text" id="configTelosysCfg_TMP" value="'+variables.TMP+'" />' +
          '<label for="configTelosysCfg_TMP"'+((variables.TMP)?' class="active"':'')+'>Temporary folder : $TMP</label>' +
        '</div>' +
      '</div>'
    
    return html;
  },

  openModal: function() {
    this.loadData(function() {
      this.display();
      $('#settingsModal .collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });
      $('#settingsModal').openModal();
    }.bind(this));
  },

  closeModal: function() {
    $('#settingsModal').closeModal();
  },

  save: function() {
    var state = Store.getState();

    var variables = state.projectConfiguration.variables;
    variables.ROOT_PKG = document.getElementById('configTelosysCfg_ROOT_PKG').value;
    variables.ENTITY_PKG = document.getElementById('configTelosysCfg_ENTITY_PKG').value;
    variables.SRC = document.getElementById('configTelosysCfg_SRC').value;
    variables.TEST_SRC = document.getElementById('configTelosysCfg_TEST_SRC').value;
    variables.RES = document.getElementById('configTelosysCfg_RES').value;
    variables.TEST_RES = document.getElementById('configTelosysCfg_TEST_RES').value;
    variables.WEB = document.getElementById('configTelosysCfg_WEB').value;
    variables.DOC = document.getElementById('configTelosysCfg_DOC').value;
    variables.TMP = document.getElementById('configTelosysCfg_TMP').value;

    ProjectsService.saveProjectConfiguration(state.auth.userId, state.projectId, state.projectConfiguration, function(isOk) {

    });
  }

};
