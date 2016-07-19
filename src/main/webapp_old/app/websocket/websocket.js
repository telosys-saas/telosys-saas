var Websocket = {

  init: function() {
    var state = Store.getState();
    if(state.auth.userId && state.projectId) {
      this.create();
    }
  },

  create: function() {
    var state = Store.getState();
    var ws = new WebSocket("ws://127.0.0.1:8080/ws/users/"+state.auth.userId+"/projects/"+state.projectId);

    ws.onopen = function () {
      console.log("Opened! ");
      var state = Store.getState();
      ws.send(state.userId + "/" + state.projectId);
    };

    ws.onmessage = function (evt) {
      console.log("Message: " + evt.data);
      var fileId = evt.data;
      var state = Store.getState();
      IDEEditorCodemirror.refreshFile(fileId);
    };

    ws.onclose = function () {
      console.log("Closed!");
    };

    ws.onerror = function (err) {
      console.log("Error: " + err);
    };
  }

}