// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {

  CodeMirror.registerHelper("hint", "entity", hint);

  function hint(editor, options) {
    return entityHint(editor,
      ['string', 'integer'],
      function (e, cur) {return e.getTokenAt(cur);},
      options);
  };

  function entityHint(editor, keywords, getToken, options) {
    var cur = editor.getCursor();
    var curLine = editor.getLine(cur.line);
    var token = getToken(editor, cur);

    return {
      list: keywords,
      from: CodeMirror.Pos(cur.line, token.start),
      to: CodeMirror.Pos(cur.line, token.end)
    };
  }
});
