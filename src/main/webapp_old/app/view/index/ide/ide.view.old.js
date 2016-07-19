
var IDE = {
  init: function() {
    this.display();
    IDEWorkingFiles.init();
    IDETreeview.init();
    IDEEditor.init();
    IDEGenerate.init();
    IDEConsole.init();
  },

  display: function() {
    var state = Store.getState();
    $('#main').html(
      '<div id="left" class="split split-horizontal content">' +
        '<ul class="collapsible" data-collapsible="expandable" style="margin: 0; box-shadow: none; border: none;">' +
          '<li>' +
            '<div class="collapsible-header active">' +
              '<i class="mdi mdi-camera-timer"></i>' +
              'Working files' +
              '<a href="#" style="float:right" onclick="IDEWorkingFiles.closeAll(event)"><i class="fa fa-times"></i></a>' +
              '<a href="#" style="float:right" onclick="IDEWorkingFiles.saveAll(event)"><i class="fa fa-floppy-o"></i></a>' +
            '</div>' +
            '<div class="collapsible-body" id="workingfiles" style="border: none;">' +
            '</div>' +
          '</li>' +
          '<li>' +
            '<div class="collapsible-header active">' +
              '<i class="mdi mdi-library-books"></i>' +
              'Project' +
              '<a href="#" style="float:right" onclick="IDETreeview.collapseAll(event)"><i class="fa fa-minus"></i></a>' +
              '<a href="#" style="float:right" onclick="event.stopPropagation();IDETreeview.refreshAll()"><i class="fa fa-refresh"></i></a>' +
            '</div>' +
            '<div class="collapsible-body" id="jstree" style="border: none;">' +
            '</div>' +
          '</li>' +
        '</ul>' +
      '</div>' +
      '<div id="b" class="split split-horizontal">' +
        '<div id="ide" class="split content">' +
          '<div id="editor" style="display:none; width: 100%; height: 100%">' +
          //'<div id="editorTabs" class="editorTabs"></div>' +
          //'<div id="editor1" class="editorTabContent">' +
            '<div id="editorToolbar" class="editorToolbar"></div>' +
            '<div id="editorCodemirror" class="editorCodemirror"></div>' +
          //'</div>' +
          '</div>' +
          '<div id="settings" style="display:none; width: 100%; height: 100%"></div>' +
          '<div id="bundles" style="display:none; width: 100%; height: 100%"></div>' +
          '<div id="generation" style="display:none; width: 100%; height: 100%"></div>' +
        '</div>' +
        '<div id="console" class="split content">' +
          '<div class="row">' +
            '<div class="col s12">' +
              '<ul class="tabs blue-text">' +
                '<li class="tab col s6"><a href="#consoleModel">Models<span id="consoleModelTitleStatus"></span></a></li>' +
                '<li class="tab col s6"><a href="#consoleGeneration">Generations<span id="consoleGenerationTitleStatus"></span></a></li>' +
              '</ul>' +
            '</div>' +
            '<div id="consoleModel" class="col s12"></div>' +
            '<div id="consoleGeneration" class="col s12"></div>' +
          '</div>' +
        '</div>' +
      '</div>');

    $('#left .collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

    /*
    Split(['#left', '#b'], {
      gutterSize: 8,
      sizes: [30, 70],
      cursor: 'col-resize'
    });

    Split(['#ide', '#console'], {
      direction: 'vertical',
      gutterSize: 8,
      sizes: [75, 25],
      cursor: 'row-resize'
    });
    */

    $('#console ul.tabs').tabs();
    $('#console ul.tabs').tabs('select_tab', 'consoleModel');

  }

};
