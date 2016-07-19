var AccountCreate = {

  init: function() {
    this.display();
  },

  // exemple : http://jsfiddle.net/user/signup/
  display: function() {
    $('#main').html(
      '<div style="margin: 0 auto; width: 500px; padding-top: 30px">' +
        '<div class="card" style="padding: 0 10px">' +
          '<div class="card-content">' +
            '<form name="createAccountForm">' +
              '<div class="row">' +
                '<div class="input-field col s12">' +
                  '<span class="card-title">Create an account</span>' +
                '</div>' +
                '<div class="input-field col s12">' +
                  '<i class="mdi mdi-account-circle prefix"></i>' +
                  '<input type="text" name="login" id="createaccountform_login" onchange="AccountCreate.onchangeLogin()" />' +
                  '<label for="createaccountform_login" id="createaccountform_login_label">Username</label>' +
                '</div>' +
                '<div class="input-field col s12">' +
                  '<i class="mdi mdi-email prefix"></i>' +
                  '<input type="text" name="mail" id="createaccountform_mail" onchange="AccountCreate.onchangeMail()" />' +
                  '<label for="createaccountform_mail" id="createaccountform_mail_label">E-mail address</label>' +
                '</div>' +
                '<div class="input-field col s12">' +
                  '<i class="mdi mdi-key prefix"></i>' +
                  '<input type="password" name="password1" id="createaccountform_password1" onchange="AccountCreate.onchangePassword1()" />' +
                  '<label for="createaccountform_password1" id="createaccountform_password1_label">Password<label>' +
                '</div>' +
                '<div class="input-field col s12">' +
                  '<i class="mdi prefix"></i>' +
                  '<input type="password" name="password2" id="createaccountform_password2" onchange="AccountCreate.onchangePassword2()" />' +
                  '<label for="createaccountform_password2" id="createaccountform_password2_label">Password confirmation</label>' +
                '</div>' +
              '</div>' +
              '<div class="card-action">' +
                '<div class="buttons col s12">' +
                  '<a href="#" onclick="AccountCreate.cancelCreateAccount()">Cancel</a>' +
                   '&nbsp; &nbsp;' +
                  '<button type="button" class="btn disabled" onclick="AccountCreate.createAccount()" id="createaccountform_button_create">Create account</button>' +
                '</div>' +
              '</div>' +
            '</form>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  },

  onchangeLogin: function() {
    $('#createaccountform_login').removeClass('valid');
    $('#createaccountform_login').removeClass('invalid');

    var login = document.forms['createAccountForm'].elements['login'].value;
    var result = this.validateLogin(login);
    if(!result.ok) {
      $('#createaccountform_login').addClass('invalid');
      $('#createaccountform_login_label').attr('data-error', result.message);
    } else {
      $('#createaccountform_login').addClass('valid');
    }
    this.activateButton();
  },

  onchangeMail: function() {
    $('#createaccountform_mail').removeClass('valid');
    $('#createaccountform_mail').removeClass('invalid');

    var mail = document.forms['createAccountForm'].elements['mail'].value;
    var result = this.validateMail(mail);
    if(!result.ok) {
      $('#createaccountform_mail').addClass('invalid');
      $('#createaccountform_mail_label').attr('data-error', result.message);
    } else {
      $('#createaccountform_mail').addClass('valid');
    }
    this.activateButton();
  },

  onchangePassword1: function() {
    $('#createaccountform_password1').removeClass('valid');
    $('#createaccountform_password1').removeClass('invalid');

    var password1 = document.forms['createAccountForm'].elements['password1'].value;
    var password2 = document.forms['createAccountForm'].elements['password2'].value;
    var result = this.validatePassword1(password1);
    if(!result.ok) {
      $('#createaccountform_password1').addClass('invalid');
      $('#createaccountform_password1_label').attr('data-error', result.message);
    } else {
      $('#createaccountform_password1').addClass('valid');
    }
    if(password2 != null && password2 != '') {
      this.onchangePassword2();
    }
    this.activateButton();
  },

  onchangePassword2: function() {
    $('#createaccountform_password2').removeClass('valid');
    $('#createaccountform_password2').removeClass('invalid');

    var password1 = document.forms['createAccountForm'].elements['password1'].value;
    var password2 = document.forms['createAccountForm'].elements['password2'].value;
    var result = this.validatePassword2(password1, password2);
    if(!result.ok) {
      $('#createaccountform_password2').addClass('invalid');
      $('#createaccountform_password2_label').attr('data-error', result.message);
    } else {
      $('#createaccountform_password2').addClass('valid');
    }
    this.activateButton();
  },

  validateLogin: function(login) {
    if(!login.match(/^[a-zA-Z]+.*$/g)) {
      return {
        ok: false,
        message: 'Must start by a letter'
      };
    } else if(!login.match(/^[a-zA-Z0-9]*$/g)) {
      return {
        ok: false,
        message: 'Must contains only letters and numbers'
      };
    } else if(login.length < 3) {
      return {
        ok: false,
        message: 'Too short (3 characters min)'
      };
    } else {
      return {
        ok: true
      };
    }
  },

  validateMail: function(mail) {
    if(!mail.match(/^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/g)) {
      return {
        ok: false,
        message: 'Not a valid e-mail address'
      };
    } else {
      return {
        ok: true
      }
    }
  },

  validatePassword1: function(password1) {
    var ok, message;
    if (password1.length < 4) {
      return {
        ok: false,
        message: 'Too short (4 characters min)'
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
    return {
      ok: ok,
      message: message
    };
  },

  validateForm: function() {
    var login = document.forms['createAccountForm'].elements['login'].value;
    var mail = document.forms['createAccountForm'].elements['mail'].value;
    var password1 = document.forms['createAccountForm'].elements['password1'].value;
    var password2 = document.forms['createAccountForm'].elements['password2'].value;
    var resultLogin = this.validateLogin(login);
    var resultMail = this.validateMail(mail);
    var resultPassword1 = this.validatePassword1(password1);
    var resultPassword2 = this.validatePassword2(password1, password2);
    var ok =
      resultLogin != null && resultLogin.ok
      && resultMail != null && resultMail.ok
      && resultPassword1 != null && resultPassword1.ok
      && resultPassword2 != null && resultPassword2.ok;
    return ok;
  },

  activateButton: function() {
    if(this.validateForm()) {
      $('#createaccountform_button_create').removeClass('disabled');
    } else {
      $('#createaccountform_button_create').addClass('disabled');
    }
  },

  createAccount: function() {
    if(this.validateForm()) {
      var login = document.forms['createAccountForm'].elements['login'].value;
      var mail = document.forms['createAccountForm'].elements['mail'].value;
      var password1 = document.forms['createAccountForm'].elements['password1'].value;
      var password2 = document.forms['createAccountForm'].elements['password2'].value;
      var user = {
        login: login,
        mail: mail,
        password: password1
      };
      AuthService.createAccount(user, function () {
        AuthService.login(user.login, user.password, function() {
          Main.init();
        })
      }.bind(this));
    }
  },

  cancelCreateAccount: function() {
    var state = Store.getState();
    state.createAccount = false;
    delete state.page;
    Main.display();
  }

};
