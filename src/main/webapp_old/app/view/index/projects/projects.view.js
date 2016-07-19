
var Projects = {

  init: function() {
    this.display();
    ProjectsList.init();
  },

  display: function() {
    var html = 
      '<div class="row">' +
        '<div class="col s12">' +
          '<h2 style="display: inline-block">Projects</h2>' +
        '</div>' +
        '<div class="row" id="projects"></div>' +
      '</div>'
    $('#main').html(html);
  }

};
