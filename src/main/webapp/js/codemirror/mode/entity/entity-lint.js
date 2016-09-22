(function (mod) {
  if (typeof exports == "object" && typeof module == "object")
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd)
    define(["../../../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  CodeMirror.registerHelper("lint", "entity", validator);

  function validator(text, options) {
    var result = [];
    var pos = 0;
    var isInComment = false;
    if (text && text != "") {
      /*while(pos < text.length) {
        if(text[pos] == '/' && text[pos+1] == '/'){
          isInComment = true;
        }
      }*/ 
    }
    return result;
  }

});
