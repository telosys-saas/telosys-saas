var Toolbar = {
  init: function() {
    this.display();
    ToolbarProjects.init();
    ToolbarProjectnew.init();
    ToolbarSettings.init();
    ToolbarBundles.init();
    ToolbarGeneration.init();
    ToolbarUser.init();
  },

  display: function() {
    var state = Store.getState();

    var html = 
       '<!-- Dropdown Structure -->' +
       '<ul id="toolbarProjectsList" class="dropdown-content"></ul>' +
       '<ul id="toolbarUserMenu" class="dropdown-content"></ul>' +
       '<div class="light-blue darken-3 nav-wrapper">' +
         '<a href="#!" class="brand-logo left logo-telosys-min" style="position: relative; margin-left: 20px; margin-top: 5px;"></a>' +
         '<a href="#!" class="brand-logo left" style="position: relative; margin-right: 20px; ">Telosys</a>' +
         '<ul id="nav-mobile" class="hide-on-med-and-down left">';

    if(state.auth.userId != null) {
      html += 
        '<li id="toolbarProjects">' +
          '<a class="dropdown-button" href="#" data-activates="toolbarProjectsList">' +
            'Project <span id="toolbarProjectsName"></span><i class="mdi mdi-menu-down right"></i>' +
          '</a>' +
        '</li>';
    }

    if(state.projectId) {
      html +=
        '<li><a href="#" onclick="ToolbarSettings.openModal()">Settings</a></li>' +
        '<li><a href="#" onclick="ToolbarBundles.openModal()">Templates</a></li>' +
        '<li><a href="#" onclick="ToolbarGeneration.openModal()">Generation</a></li>' +
        '<li><a href="#" onclick="ToolbarDownload.download()">Download</a></li>';
    }

    html += 
        '</ul>' +
        '<div class="right" id="toolbarUser">' +
        '</div>' +
      '</div>';

    $('#appbar').html(html);
    $('#appbar .dropdown-button').dropdown();
  },

  welcome: function() {
    var state = Store.getState();
    state.page = 'welcome';
    Main.display();
  }

};
