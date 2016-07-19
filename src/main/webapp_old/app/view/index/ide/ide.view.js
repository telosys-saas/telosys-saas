
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
/*
    var mainDiv = {
      type: 'H',
      divs: {
        left: {
          size: '300px',
          class: 'content'
        },
        right: {
          type: 'V',
          divs: {
            idemain: {
              type: 'H',
              divs: {
                ide: {
                  class: 'content'
                }
              }
            },
            console: {
              size: '100px',
              class: 'content'
            }
          }
        }
      }
    };
    state.mainDiv = mainDiv;
*/
    
    var html = 
      '<div style="width: 100%; height: 100%; position: relative">' +
        '<div id="left" class="content" style="position: absolute; left: 0; width: calc(25% - 10px); top: 0; bottom: 0"></div>' + 
        '<div id="ide" class="content" style="position: absolute; right: 0; width: 75%; height: 75%"; top: 0; right: 0></div>' +
        '<div id="console" class="content" style="position: absolute; right: 0; width: 75%; height: calc(25% - 10px); bottom: 0; right: 0"></div>' +
      '</div>';
    
    $('#main').html(html);
/*    
    $(function () {    
        var pstyle = 'border: 1px solid #e0e0e0; box-shadow: 0 1px 3px #d4d4d4; background-color: #fff;';
        $('#main').w2layout({
            name: 'main',
            padding: 10,
            panels: [
                { type: 'left', size: '25%', resizable: true, style: pstyle, content: '<div id="left" style="height: 100%; width: 100%"></div>' },
                { type: 'main', style: pstyle + 'border-top: 0px;', content: '<div id="ide" style="height: 100%; width: 100%"></div>'},
                { type: 'preview', size: '25%', style: pstyle + 'border-top: 0px;', resizable: true, content: '<div id="console" style="height: 100%; width: 100%"></div>'}
            ]
        });
    });
*/
    var leftHtml =
      '<ul id="main-left" class="collapsible" data-collapsible="expandable" style="margin: 0; box-shadow: none; border: none;">' +
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
      '</ul>';

    $('#left').html(leftHtml);

    $('#left .collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

    var ideHtml =
      '<div id="editor" style="display:none; width: 100%; height: 100%">' +
        //'<div id="editorTabs" class="editorTabs"></div>' +
        //'<div id="editor1" class="editorTabContent">' +
        '<div id="editorToolbar" class="editorToolbar"></div>' +
        '<div id="editorCodemirror" class="editorCodemirror"></div>' +
        //'</div>' +
      '</div>' +
      '<div id="settings" style="display:none; width: 100%; height: 100%"></div>' +
      '<div id="bundles" style="display:none; width: 100%; height: 100%"></div>' +
      '<div id="generation" style="display:none; width: 100%; height: 100%"></div>';

    $('#ide').html(ideHtml);

    var consoleHtml =
      '<div class="row">' +
        '<div class="col s12">' +
          '<ul class="tabs blue-text">' +
            '<li class="tab col s6"><a href="#consoleModel">Models<span id="consoleModelTitleStatus"></span></a></li>' +
            '<li class="tab col s6"><a href="#consoleGeneration">Generations<span id="consoleGenerationTitleStatus"></span></a></li>' +
          '</ul>' +
        '</div>' +
        '<div id="consoleModel" class="col s12"></div>' +
        '<div id="consoleGeneration" class="col s12"></div>' +
      '</div>';

    $('#console').html(consoleHtml);

    $('#console ul.tabs').tabs();
    $('#console ul.tabs').tabs('select_tab', 'consoleModel');


  },

  addEditor: function() {
    var state = Store.getState();
    
    /*
    addDiv(
      'idemain',
      state.mainDiv.divs.right.divs.idemain,
      'ide2',
      {class: 'content'}
    );
    initSlide('idemain', state.mainDiv.divs.right.divs.idemain);
    */
  }

};
