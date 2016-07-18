// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../../../lib/codemirror/lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../../../lib/codemirror/lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineMode("entity", function() {

    return {
      startState: function() {
        return {
          isInEntityBlock: false,
          countOpened: {
            '{': 0,
            '[': 0
          },
          isInCommentLine: false,
          isInCommentBlock: false
        };
      },

      token: function(stream, state) {
        // comment line

        if(stream.sol()) {
          state.isInCommentLine = false;
        }

        // next character
        var char = stream.next();

        if(state.isInCommentLine) {
          return 'comment';
        }

        /*
        // comment block
        if(state.isInCommentBlock) {
          if(char == '/' && stream.peek() == '/') {
            state.isInCommentBlock = false;
            stream.next();
          }
          return 'comment';
        }
        */

        // detect comment line start
        if(char == '/' && stream.peek() == '/') {
          state.isInCommentLine = true;
        }

        if(!state.isInEntityBlock) {
          if(char.match(/\w/)) {
            stream.eatWhile(/\w/);
            return "variable";
          }
          if(char == '{') {
            state.countOpened['{']++;
            state.isInEntityBlock = true;
          }
          return null;
        } else {
          if(char.match(/ \t/)) {
            return null;
          }
          if(char.match(/\w/)) {
            return "variable-2";
          }
          if(char == '@') {
            stream.eatWhile(/\w/);
            return "variable-3";
          }
          if(char == '{') {
            state.countOpened['{']++;
            return null;
          }
          if(char == '}') {
            state.countOpened['{']--;
            if(state.countOpened['{'] > 0) {
              return null;
            } else {
              state.isInEntityBlock = false;
              return null;
            }
          }
        }
      }
    }

  });

  CodeMirror.defineMIME("entity", "entity");
});
