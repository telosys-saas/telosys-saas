var ToolbarUserChangePassword = {

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
    $('#changepassword').html(
      '<div id="changepasswordModal" class="modal">' +
        '<div class="modal-content">' +
          '<h4>Change password</h4>' +
          '<div class="row">' +
            '<div class="input-field col s12">' +
              '<i class="mdi mdi-key prefix"></i>' +
              '<input type="password" id="changepasswordform_oldpassword" onchange="ToolbarUserChangePassword.onchangeOldPassword()" />' +
              '<label for="changepasswordform_oldpassword" id="changepasswordform_password1_label">Old password<label>' +
            '</div>' +
          '<div class="row">' +
            '<div class="input-field col s12">' +
              '<i class="mdi mdi-key prefix"></i>' +
              '<input type="password" id="changepasswordform_password1" onchange="ToolbarUserChangePassword.onchangePassword1()" />' +
              '<label for="changepasswordform_password1" id="changepasswordform_password1_label">Password<label>' +
            '</div>' +
            '<div class="input-field col s12">' +
              '<i class="mdi prefix"></i>' +
              '<input type="password" id="changepasswordform_password2" onchange="ToolbarUserChangePassword.onchangePassword2()" />' +
              '<label for="changepasswordform_password2" id="changepasswordform_password2_label">Password confirmation</label>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<a href="#!" id="changepasswordform_button_save" class="disabled modal-action modal-close waves-effect waves-green btn-flat" onclick="ToolbarUserChangePassword.save()">Save</a>' +
          '<a href="#!" id="changepasswordform_button_close" class="modal-action modal-close waves-effect waves-green btn-flat" onclick="ToolbarUserChangePassword.closeModal()">Close</a>' +
        '</div>' +
      '</div>'
    );
  },

  openModal: function() {
    this.loadData(function() {
      this.display();
      $('#changepasswordModal').openModal();
    }.bind(this));
  },

  closeModal: function() {
    $('#changepasswordModal').closeModal();
  },

  onchangeOldPassword: function() {
    $('#changepasswordform_oldpassword').removeClass('valid');
    $('#changepasswordform_oldpassword').removeClass('invalid');

    var oldpassword = $('#changepasswordform_oldpassword').val();
    var result = this.validateOldPassword(oldpassword);
    if(!result.ok) {
      $('#changepasswordform_oldpassword').addClass('invalid');
      $('#changepasswordform_oldpassword_label').attr('data-error', result.message);
    } else {
      $('#changepasswordform_oldpassword').addClass('valid');
    }
  },

  onchangePassword1: function() {
    $('#changepasswordform_password1').removeClass('valid');
    $('#changepasswordform_password1').removeClass('invalid');

    var password1 = $('#changepasswordform_password1').val();
    var password2 = $('#changepasswordform_password2').val();
    var result = this.validatePassword1(password1);
    if(!result.ok) {
      $('#changepasswordform_password1').addClass('invalid');
      $('#changepasswordform_password1_label').attr('data-error', result.message);
    } else {
      $('#changepasswordform_password1').addClass('valid');
    }
    if(password2 != null && password2 != '') {
      this.onchangePassword2();
    }
    this.activateButton();
  },

  onchangePassword2: function() {
    $('#changepasswordform_password2').removeClass('valid');
    $('#changepasswordform_password2').removeClass('invalid');

    var password1 = $('#changepasswordform_password1').val();
    var password2 = $('#changepasswordform_password2').val();
    var result = this.validatePassword2(password1, password2);
    if(!result.ok) {
      $('#changepasswordform_password2').addClass('invalid');
      $('#changepasswordform_password2_label').attr('data-error', result.message);
    } else {
      $('#changepasswordform_password2').addClass('valid');
    }
    this.activateButton();
  },

  validateOldPassword: function(oldpassword) {
    var ok, message;

    if (oldpassword.length < 5) {
      return {
        ok: false,
        message: 'Too short (5 characters min)'
      };
    }
    else {
      return {
        ok: true
      }
    }
  },

  validatePassword1: function(password1) {
    var ok, message;

    if (password1.length < 5) {
      return {
        ok: false,
        message: 'Too short (5 characters min)'
      };
    }
    else {
      return {
        ok: true
      }
    }
  },

  validatePassword2: function(password1, password2) {
    if(password1 !== password2) {
      return {
        ok: false,
        message: 'Passwords are not identicals'
      };
    } else {
      return {
        ok: true
      };
    }
  },

  validateForm: function() {
    var oldPassword = $('#changepasswordform_oldpassword').val();
    var password1 = $('#changepasswordform_password1').val();
    var password2 = $('#changepasswordform_password2').val();
    var resultOldPassword = this.validateOldPassword(oldPassword);
    var resultPassword1 = this.validatePassword1(password1);
    var resultPassword2 = this.validatePassword2(password1, password2);
    var ok =
      resultOldPassword != null && resultOldPassword.ok
      && resultPassword1 != null && resultPassword1.ok
      && resultPassword2 != null && resultPassword2.ok;
    return ok;
  },

  activateButton: function() {
    if(this.validateForm()) {
      $('#changepasswordform_button_save').removeClass('disabled');
    } else {
      $('#changepasswordform_button_save').addClass('disabled');
    }
  },

  save: function() {
    var state = Store.getState();

    if(this.validateForm()) {
      var oldPassword = $('#changepasswordform_oldpassword').val();
      var password = $('#changepasswordform_password1').val();
      AuthService.changePassword(state.account.login, oldPassword, password, function () {
        console.log('save account ok');
      }.bind(this));
    }
  }

};
