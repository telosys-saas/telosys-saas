var ToolbarProjects = {
  init: function() {
    var state = Store.getState();
    if(state.auth.authenticated) {
      ProjectsService.loadProjects(state.auth.userId, function(projects) {
        var html = '';

        html += 
          '<li><a href="#!" onclick="ToolbarProjects.changeProject()">All projects</a></li>';

        var isFirst = true;
        for (var i = 0; i < projects.length; i++) {
          var project = projects[i];

          if(isFirst) {
            isFirst = false;
            html += 
              '<li class="divider"></li>';
          }

          var selected = '';
          if(state.projectId === project.id) {
            selected = ' selected';
          }
          html += 
            '<li><a href="#!" onclick="ToolbarProjects.changeProject(\''+project.id+'\')">'+project.name+'</a></li>';
        }
        html += 
          '<li class="divider"></li>' +
          '<li><a href="#!" onclick="ToolbarProjectnew.openModal()">New project</a></li>'

        $('#toolbarProjectsList').html(html);
      });
    }
  },

  changeProject: function(projectId) {
    ToolbarProjectsAction.onChangeProject(projectId,
      function(hasChangedProject, newProjectId) {
        if(newProjectId != null) {
          $('#toolbarProjectsName').html(' : '+newProjectId);
        } else {
          $('#toolbarProjectsName').html('');
        }
        Main.display();
      });
  }

};
