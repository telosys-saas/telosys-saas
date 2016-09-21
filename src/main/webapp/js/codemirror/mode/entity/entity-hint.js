// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object")
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd)
    define(["../../../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {

  CodeMirror.registerHelper("hint", "entity", entityHint);

  function entityHint(editor, options) {
    var cur = editor.getCursor();
    var curLine = editor.getLine(cur.line);
    var token = editor.getTokenAt(cur);

    return {
      list: getCompletions(token.state),
      from: CodeMirror.Pos(cur.line, token.end),
      to: CodeMirror.Pos(cur.line, token.end)
    };
  }

  function getCompletions(state) {
    if(!state.isInEntityBlock) return [];
    if(state.isInCommentLine || state.isInCommentBlock) return [];
    if(state.isType) return ['string', 'integer'];
    if(state.isAnnotation) return ['@Id', '@NotNull'];
  }

});
