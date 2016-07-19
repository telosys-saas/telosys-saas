
var ProjectsList = {

  init: function() {
    var state = Store.getState();
    ProjectsService.loadProjects(state.auth.userId, function(projects) {
      var html = '';
      for (var i = 0; i < projects.length; i++) {
        var project = projects[i];
        html += 
          '<div class="col s12 m3">' +
            '<div class="card" onclick="ToolbarProjects.changeProject(\''+project.id+'\')" style="cursor: pointer">' +
              '<div class="card-content">' +
                '<span class="card-title">' + project.name + '</span>' +
              '</div>' +
              '<div class="card-action" style="text-align: right">' +
                '<a href="#">OPEN THIS PROJECT</a>' +
              '</div>' +
            '</div>' +
          '</div>';
      }
      html +=
        '<div class="col s12 m3">' +
          '<a href="#" class="waves-effect waves-green btn" onclick="ToolbarProjectnew.openModal()">' +
            'ADD NEW PROJECT' +
          '</a>' +
        '</div>';
      $('#projects').html(html);
      $('#projects').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });

    });
  }

};
