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

  /*var error = {
   from: {
   ch : 1,
   line: 2
   },
   message: "",
   severity: "error", // warning
   to: {
   ch : 2,
   line: 2
   }
   };*/

  /** List of errors */
  var errors = [];

  function validator(text, options) {
    var state = {
      isInEntityBlock: false,
      isInCommentLine: false,
      isInVariableName: false,
      isType: false,
      isAnnotation: false
    };

    var beginEntityBlock = text.indexOf("{");
    var endEntityBlock = text.lastIndexOf("}");
    if (text && text != "") {
      var lines = text.split("\n");
      var lineNumber = 0;
      while (lineNumber < lines.length) {
        var line = lines[lineNumber];
        state.isInCommentLine = false;
        checkLine(line.trim(), lineNumber, state);
        lineNumber++;
      }
    }
    return errors;
  }

  function checkLine(line, lineNumber, state) {
    var pos = 0;
    while (pos < line.length) {
      var char = line[pos];
      // detect comment line start
      if (char == '/' && line[pos + 1] == '/') {
        return;
      }
      if (!state.isInEntityBlock) {
        if (char == '{') {
          state.isInEntityBlock = true;
        }
      } else {
        // detect variable name
        // if true change the syntax color
        if (char.match(/\w/)) {
          var posEnd = line.indexOf(' ', pos);
          var error = {
            from: {
              ch: pos,
              line: lineNumber
            },
            message: "variable name",
            severity: "error", // warning
            to: {
              ch: posEnd,
              line: lineNumber
            }
          };
          errors.push(error);
          pos = posEnd;
        }
        // detect if we are after ':'
        if (char == ':') {
          // Get the type name
          // Get the end of the string
          var posEnd = line.indexOf(' ',pos);
          var error = {
            from: {
              ch: pos,
              line: lineNumber
            },
            message: "type name",
            severity: "error", // warning
            to: {
              ch: posEnd,
              line: lineNumber
            }
          };
          errors.push(error);
          pos = posEnd;
        }
        // detect if we are in annotation block
        if (char == '{') {
          state.isAnnotation = true;
          state.isType = false;
        }
        // detect if we are after annotation
        if (char == '}') {
          state.isAnnotation = false;
        }
      }
      pos++;
    }
  }
});
