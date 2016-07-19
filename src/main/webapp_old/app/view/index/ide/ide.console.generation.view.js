var IDEConsoleGeneration = {

  init: function() {
    this.display();
  },

  display: function() {
    var state = Store.getState();

    var nbErrors = 0;

    var html = 
      '<div class="row">' +
        '<div class="col s12">' +
          '<div style="width: 100%">' +
            '<button class="left btn waves-effect waves-green" onclick="IDEGeneration.launchGeneration()">' +
              '<span class="fa fa-play-circle fa-lg"></span>' +
              'Generate again' +
            '</button>' +
          '</div>' +
          '<br/>' +
          '<table>' +
            '<tr>' +
              '<th></th>' +
              '<th>Template</th>' +
              '<th>Line</th>' +
              '<th>Entity</th>' +
              '<th>Error</th>' +
            '</tr>'

    var hasError = false;
    if(state.generationResults) {
      for (var i=0; i<state.generationResults.length; i++) {
        var generationResult = state.generationResults[i];
        if(generationResult.result && generationResult.result.errors && generationResult.result.errors.length > 0) {
          for (var j=0; j<generationResult.result.errors.length; j++) {
            var errorAsStr = generationResult.result.errors[j];
            var error = this.getErrorAsObject(generationResult.generation, errorAsStr);
            hasError = true;
            nbErrors++;
            html += 
              '<tr>' +
                '<td class="center-align" style="padding:0; font-size: 22px; line-height: 22px"><span class="mdi mdi-alert-circle fa-2x"></span></td>' +
                '<td onclick="IDEAction.openFile(\''+error.templateFileId+'\')"><a href="#">' + error.templateName + '</a></td>' +
                '<td onclick="IDEAction.openFile(\''+error.templateFileId+'\')"><a href="#">Line ' + error.numLine + '</a></td>' +
                '<td onclick="IDEAction.openFile(\''+error.entityFileId+'\')"><a href="#">' + error.entityName + '</a></td>' +
                '<td>' + error.message + '</td>' +
              '</tr>'
          }
        }
      }
    }

    html += 
          '</table>' +
        '</div>' +
      '</div>'

    if(!hasError) {
      if(state.generationResults) {
        html = 
          '<div class="row">' +
            '<div class="col s12">' +
              '<div style="width: 100%">' +
                '<h5 class="inline-block">Generation : <span class="green-text">OK</span></h5>' +
                '<button class="right btn waves-effect waves-green" onclick="IDEGeneration.launchGeneration()">' +
                  '<span class="fa fa-play-circle fa-lg"></span>' +
                   'Generate again' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>'
      } else {
        html = 
          '<div class="row">' +
            '<div class="col s12">' +
              '<div style="width: 100%">' +
                '<h5 class="inline-block">No generation</h5>' +
              '</div>' +
            '</div>' +
          '</div>'
      }
    }

    $('#consoleGeneration').html(html);

    if(hasError || state.generationResults) {
      $('#console ul.tabs').tabs('select_tab', 'consoleGeneration');
    }

    //if(!state.generationResults) {
    //  $('#consoleGenerationTitleStatus').html('');
    //  } else
    if(nbErrors == 0) {
      $('#consoleGenerationTitleStatus').html(
        ': <span class="green-text">OK</span>'
      )
    } else if(nbErrors == 1) {
      $('#consoleGenerationTitleStatus').html(
        ': <span class="red-text">1 Error</span>'
      )
    } else {
      $('#consoleGenerationTitleStatus').html(
        ': <span class="red-text">'+nbErrors+' Errors</span>'
      )
    }
  },

  // error.message : "Template "doc_entity_html.vm" ( line 5 ) - Entity : "Book" GeneratorContextException : Invalid reference (doc_entity_html.vm line 5) $entity.nam : get 'nam' "
  getErrorAsObject: function(generation, error) {
    var state = Store.getState();

    try {
      var posBegin = error.message.indexOf('Template "') + 10;
      var posEnd = error.message.indexOf('"', posBegin);
      var templateName = error.message.substring(posBegin, posEnd);
      var templateFileId = 'TelosysTools/templates/' + generation.bundle + '/' + templateName;

      var posBegin = error.message.indexOf(' ( line ') + 8;
      var posEnd = error.message.indexOf(' )', posBegin);
      var numLine = error.message.substring(posBegin, posEnd);

      var posBegin = error.message.indexOf('Entity : "') + 10;
      var posEnd = error.message.indexOf('"', posBegin);
      var entityName = error.message.substring(posBegin, posEnd);
      var entityFileId = 'TelosysTools/' + generation.model + '_model/' + entityName + '.entity';

      var posBegin = posEnd + 2;
      if(error.message.indexOf('Exception :', posBegin) != -1) {
        posBegin = error.message.indexOf('Exception :', posBegin) + 11;
      }
      var message = error.message.substring(posBegin);

      return {
        entityName: entityName,
        entityFileId: entityFileId,
        templateName: templateName,
        templateFileId: templateFileId,
        numLine: numLine,
        message: message
      };

    } catch(e) {
      return {
        message: message
      }
    }
  }

};
