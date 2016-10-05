// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../../../lib/codemirror/lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../../../lib/codemirror/lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  CodeMirror.defineMode("entity", function () {

    return {
      startState: function () {
        return {
          isInEntityBlock: false,
          isInCommentLine: false,
          isType: false,
          isAnnotation: false
        };
      },

      token: function (stream, state) {
        // comment line
        if (stream.sol()) {
          state.isInCommentLine = false;
        }

        // next character
        var char = stream.next();

        if (state.isInCommentLine) {
          return "comment-line";
        }

        // detect comment line start
        if (char == '/' && stream.peek() == '/') {
          state.isInCommentLine = true;
          return "comment-line";
        }

        if (!state.isInEntityBlock) {
          if (char.match(/\w/)) {
            stream.eatWhile(/\w/);
            return "entity";
          }
          if (char == '{') {
            state.isInEntityBlock = true;
          }
          return null;
        } else {
          // detect tabulation
          if (char.match(/\t/)) {
            return null;
          }
          // detect variable name
          // if true change the syntax color
          if (char.match(/\w/)) {
            return "variable";
          }
          // detect if we are after ':'
          // if true, enabled autocomplete for type
          if (char == ':') {
            state.isType = true;
            return null;
          }
          // detect if we are in annotation block
          // if true disabled autocomplete for type
          // and enabled autocomplete for annotation
          if (char == '{') {
            state.isAnnotation = true;
            state.isType = false;
            return null;
          }

          // detect if we are after annotation
          // if true disabled autocomplete for annotation
          if (char == '}') {
            if(!state.isAnnotation){
              state.isInEntityBlock = false;
              return null;
            }else {
              state.isAnnotation = false;
              return null;
            }
          }
          // detect if we are in annotation
          // if true change the annotation color
          if (char == '@') {
            stream.eatWhile(/\w/);
            return "annotation";
          }
          // detect the end of one attribute (after ';')
          // if true disabled autocomplete for type
          if (char == ';') {
            state.isType = false;
            state.isAnnotation = false;
            return null;
          }
          if (state.isType) {
            stream.eatWhile(/\w/);
            return "type";
          }
        }
      },
      lineComment: "//"
    }

  });

  CodeMirror.defineMIME("entity", "entity");
});
