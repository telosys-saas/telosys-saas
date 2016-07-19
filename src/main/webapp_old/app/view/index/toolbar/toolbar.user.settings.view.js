var ToolbarUserSettings = {

  init: function() {
    this.display();
  },

  loadData: function(callback) {
    var state = Store.getState();
    AuthService.getAccount(state.auth.userId, function(account) {
      state.account = account;
      if(callback) {
        callback();
      }
    });
  },

  display: function() {
    var state = Store.getState();
    $('#usersettings').html(
      '<div id="usersettingsModal" class="modal modal-fixed-footer">' +
        '<div class="modal-content">' +
          '<h4>Account Settings</h4>' +
          '<ul class="collapsible" data-collapsible="accordion">' +
            '<li>' +
              '<div class="collapsible-header active">' +
                '<i class="mdi mdi-action-perm-contact-cal"></i>' +
                'Settings' +
              '</div>' +
              '<div class="collapsible-body">' +
                + this.displaySettings() +
             '</div>' +
            '</li>' +
          '</ul>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat" onclick="ToolbarUserSettings.closeModal()">Close</a>' +
        '</div>' +
      '</div>'
    );
  },

  displaySettings: function() {
    var state = Store.getState();
    var account = state.account;
    console.log(account);
    var html =
      '<div class="row">' +
        'TODO' +
      '</div>';
    return html;
  },

  openModal: function() {
    this.loadData(function() {
      this.display();
      $('#usersettingsModal .collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });
      $('#usersettingsModal').openModal();
    }.bind(this));
  },

  closeModal: function() {
    $('#usersettingsModal').closeModal();
  },

  save: function() {
    var state = Store.getState();

    if(this.validateForm()) {
      AuthService.saveAccount(state.account, function () {
        console.log('save account ok');
      }.bind(this));
    }
  }


};
