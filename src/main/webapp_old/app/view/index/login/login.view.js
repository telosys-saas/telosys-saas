var Login = {

  init: function() {
    this.display();
  },

  display: function() {
    $.get('app/view/index/login/login.html', function(html) {
      $('#main').html(html);
      $('#main').click();
    });
  },

  createAccount: function() {
    var state = Store.getState();
    state.createAccount = true;
    state.page = 'createAccount';
    Main.display();
  }

};