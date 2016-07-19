var Main = {
  init: function() {
    Store.init()
      .then(function() {
        this.display();
      }.bind(this))
      .catch(function(e) {
        console.log('Error: ',e);
      });
  },

  display: function() {
    var state = Store.getState();

    Toolbar.init();

    var page = null;
    if(state.page == 'welcome') {
      page = 'welcome';
    }
    if (!state.auth.authenticated) { // not authenticated
      if (state.page != 'ide' && state.page != 'projects') {
        page = state.page;
      }
    } else { // authenticated
      if (state.page != 'login' && state.page != 'createAccount') {
        page = state.page;
      }
    }
    if(!page) {
      if (!state.auth.authenticated) { // not authenticated
        page = 'welcome';
      }
      else { // authenticated
        page = 'projects';
      }
    }

    state.page = page;
    if(state.page == 'welcome') {
      Welcome.init();
    }
    if(state.page == 'login') {
      Login.init();
    }
    if(state.page == 'createAccount') {
      AccountCreate.init();
    }
    if(state.page == 'projects') {
      Projects.init();
    }
    if(state.page == 'ide') {
      IDE.init();
    }

    // Websocket.init();
  }
};
