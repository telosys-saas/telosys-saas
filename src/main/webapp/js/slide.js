/*
$('#main').html("Hello !!");

var state = {
  main: {
      type: 'V',
      divs: {
          'header': {
              size: '15px'
          },
          'middle': {
              type: 'H',
              divs: {
                  left: {
                      size: '150px'
                  },
                  right: {
                      type: 'H',
                      divs: {
                          one: {},
                          two: {}
                      }
                  }
              }
          },
          'footer': {
              size: '23px'
          }
      }
  }
};
*/

function initSlide(mainDivId, mainDiv) {
    var divs = getDivs(mainDivId, mainDiv);
    var res = {
        orientation: mainDiv.type,
        divs: divs
    };
    console.log('divs',res);
    var html = getHtml('main', res);
    console.log('html',html);
    $('#'+mainDivId).html(html);
    defineDraggables('main', res);
}


function getDivs(divId, divInfo) {
    var divs = {};

    var slideWidth = 8;

    if(divInfo == null) {
        return '';
    }
    var divSubs = divInfo.divs;
    if(divSubs == null) {
        return '';
    }
    var nbDivSub = Object.keys(divSubs).length;
    if(nbDivSub == 0) {
        return '';
    }

    var num = 0;
    var totalFixedSize = 0;
    var nbAutoSize = 0;
    var nbPourcentSize = 0;
    var nbFixedSize = 0;
    var totalPourcentSize = 0;
    for(var divSubId in divSubs) {
        var divSub = divSubs[divSubId];
        if(divSub.size) {
            if(divSub.size.indexOf('px') != -1) {
                nbFixedSize ++;
                totalFixedSize += parseFloat(divSub.size.substring(0,divSub.size.indexOf('px')));
            } else {
                nbPourcentSize ++;
                totalPourcentSize += parseFloat(divSub.size);
            }
        } else {
            nbAutoSize++;
        }
    }

    var lastDiv = null;
    var lastDivId = null;
    var isFirst = true;
    for(var divSubId in divSubs) {
        var divSub = divSubs[divSubId];
        num++;

        var div = {};

        // CSS class
        if(divSub.class) {
            div.class = divSub.class;
        }

        if(lastDiv) {
            // Add slide
            var slideId = divId+'_slide_'+num;
            divs[slideId] = {
                type: 'slide',
                orientation: divInfo.type,
                id: slideId,
                divBefore: lastDiv,
                divBeforeId: lastDivId,
                divAfter: div,
                divAfterId: divSubId,
                size: slideWidth
            };
        }

        divs[divSubId] = div;

        div.orientation = divInfo.type;
        div.isFirst = isFirst;
        if(!divSub.size) {
            // Auto size
            div.type = 'auto';
            div.pourcentSize = '100';
            div.totalPourcentSize = totalPourcentSize;
            div.totalFixedSize = totalFixedSize;
            div.nbAutoSize = nbAutoSize;
            div.fixedSize = 0;
        } else if(divSub.size.indexOf('px') != -1) {
            // Fixed size
            div.type = 'fixed';
            div.fixedSize = parseFloat(divSub.size.substring(0,divSub.size.indexOf('px')));
        } else {
            // Pourcent size
            div.type = 'pourcent';
            div.pourcentSize = divSub.size;
            div.fixedSize = 0;
        }

        div.divs = getDivs(divSubId, divSub);

        if(isFirst) {
            isFirst = false;
        }
        lastDiv = div;
        lastDivId = divSubId;
    }
    return divs;
}

function getHtml(divId, divInfo) {
    var html = '';
    var isFirst = true;

    if(divInfo == null) {
        return '';
    }
    var divSubs = divInfo.divs;
    if(divSubs == null) {
        return '';
    }
    var nbDivSub = Object.keys(divSubs).length;
    if(nbDivSub == 0) {
        return '';
    }
    var orientation = divInfo.orientation;

    for(var divSubId in divSubs) {
        var divSub = divSubs[divSubId];
        var style = '';

        var panelSize = getPanelSize(divSub);

        if(divSub.type == 'slide') {
            if(divSub.orientation == 'H') {
                style = 'width:'+panelSize+';height:100%;z-index:200;display:inline-block;float:left;cursor:col-resize';
            } else {
                style = 'height:'+panelSize+';width:100%;z-index:200;display:block;cursor:row-resize';
            }
            html += '<div id="'+divSubId+'" style="'+style+'"';
            if(divSub.class) {
                html += ' class="' + divSub.class + '"';
            }
            html += '></div>';
        } else {
            if(divSub.orientation == 'H') {
                style = 'width:'+panelSize+';height:100%;display:inline-block;float:left;';
            } else {
                style = 'height:'+panelSize+';width:100%;display:block;';
            }
            if(divSub.divs) {
                html += '<fieldset';
            } else {
                html += '<div';
            }
            html += ' id="'+divSubId+'" style="'+style+'"';
            if(divSub.class) {
                html += ' class="' + divSub.class + '"';
            }
            html += '>';
            html += getHtml(divSubId, divSub);
            if(divSub.divs) {
                html += '</fieldset>';
            } else {
                html += '</div>';
            }
        }

        if(isFirst) {
            isFirst = false;
        }
    }
    return html;
}

function getPanelSize(div) {
    var slideWidth = 8;

    var size = null;
    if(div.type == 'slide') {
        // Slide
        size = slideWidth + 'px';
    }
    if(div.type == 'auto') {
        // Auto size
        if(div.pourcentSize && div.pourcentSize != 0) {
            var size = div.pourcentSize+'%';
        } else {
            var size = '100%';
        }
        if(div.totalPourcentSize != 0) {
            size += ' - '+div.totalPourcentSize+'%';
        }
        if(div.totalFixedSize != 0) {
            size += ' - '+div.totalFixedSize+'px';
        }
        if(div.nbAutoSize > 1) {
            size = '(('+size+')/'+div.nbAutoSize + ')';
        }
        if(!div.isFirst) {
            size += ' - ' + slideWidth + 'px';
        }
        if(div.fixedSize && div.fixedSize != 0) {
            size += ' + '+div.fixedSize+'px';
        }
        size = 'calc('+size+')';
    }
    if(div.type == 'fixed') {
        // Fixed size
        if(div.isFirst) {
            size = div.fixedSize + 'px';
        } else {
            size = (div.fixedSize - slideWidth) + 'px';
        }
    }
    if(div.type == 'pourcent') {
        // Pourcent size
        if(div.isFirst) {
            size = div.pourcentSize + '%';
            if(div.fixedSize && div.fixedSize != 0) {
                size = 'calc(' + size + ' + ' + div.fixedSize + 'px)';
            }
        } else {
            size = 'calc('+div.pourcentSize+'% - ' + slideWidth + 'px';
            if(div.fixedSize && div.fixedSize != 0) {
                size += ' + ' + div.fixedSize + 'px';
            }
            size += ')';
        }
    }
    return size;
}

function defineDraggables(divId, div) {
    if(div == null || div == '') {
        return;
    }
    if(div.type == 'slide') {
        defineDraggable(divId, div);
    }

    if(div.divs == null || div.divs == '') {
        return;
    }
    for(var divSubId in div.divs) {
        var divSub = div.divs[divSubId];
        defineDraggables(divSubId, divSub);
    }
}

function defineDraggable(divId, div) {
    console.log('defineDraggable: divId',divId,' div',div);
    var element = document.getElementById(divId);
    console.log('element',element);
    interact(element)
        .draggable({
            axis: (div.orientation == 'H') ? 'x' : 'y',

            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            restrict: {
                restriction: "parent",
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            // enable autoScroll
            autoScroll: true,

            // call this function on every dragmove event
            onmove: function(event) {
                console.log('onmove: event',event);
                if(div.divBefore && div.divBeforeId) {
                    if(div.divBefore.orientation == 'H') {
                        var delta = event.dx;
                    } else {
                        var delta = event.dy;
                    }
                    resizePanel(div.divBeforeId, div.divBefore, delta, div.divBefore, div.divAfter, false);
                }
                if(div.divAfter && div.divAfterId) {
                    if(div.divAfter.orientation == 'H') {
                        var delta = event.dx;
                    } else {
                        var delta = event.dy;
                    }
                    resizePanel(div.divAfterId, div.divAfter, -delta, div.divBefore, div.divAfter, true);
                }

                if (window.getSelection) {
                    if (window.getSelection().empty) {  // Chrome
                        window.getSelection().empty();
                    } else if (window.getSelection().removeAllRanges) {  // Firefox
                        window.getSelection().removeAllRanges();
                    }
                } else if (document.selection) {  // IE?
                    document.selection.empty();
                }
            }
        });

}

function resizePanel(divId, div, delta, divBefore, divAfter, isDivAfter) {
    if (!div || !divId || !delta) {
        return;
    }

    console.log('divBefore.type : ', divBefore.type);
    console.log('divAfter.type : ', divAfter.type);
    if (divBefore.type == 'fixed' || divAfter.type == 'fixed') {
        if (div.type == 'fixed') {
            div.fixedSize += delta;
        }
        if (div.type == 'pourcent') {
            div.fixedSize += delta;
        }
        if (div.type == 'auto') {
            div.fixedSize += delta;
        }
    } else {
        if (div.type == 'pourcent' || div.type == 'auto') {
            if(!isDivAfter) {
                if (div.orientation == 'H') {
                    var currentSizePx = $('#' + divId).outerWidth();
                } else {
                    var currentSizePx = $('#' + divId).outerHeight();
                }
                console.log('currentSizePx : ', currentSizePx);
                var pourcentSize =
                    (currentSizePx + delta) / currentSizePx * div.pourcentSize;
            } else {
                var pourcentSize = 200 - divBefore.pourcentSize;
            }
            console.log('pourcentSize : ',pourcentSize);
            div.pourcentSize = pourcentSize;
        }
    }

    var size = getPanelSize(div);

    if(div.orientation == 'H') {
        $('#'+divId).css('width', size);
    } else {
        $('#'+divId).css('height', size);
    }
}
