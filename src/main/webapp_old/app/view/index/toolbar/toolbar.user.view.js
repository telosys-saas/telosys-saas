
var ToolbarUser = {
  init: function() {
    var state = Store.getState();

    var html = 
      '<ul id="nav-mobile" class="hide-on-med-and-down left">' +
        '<li><a class="dropdown-button" href="#" data-activates="toolbarUserMenu" style="font-size: 20px">'
        
    if(state.auth.authenticated) {
      if(state.auth.avatar && state.auth.avatar != 'null') {
        html += 
          '<img src="'+state.auth.avatar+'" style="float: left; margin: 11px; height: 36px; border-radius: 50%; box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)" /> &nbsp;'
      } else {
        html += 
          '<span class="fa fa-user"></span> &nbsp;'
      }
      if(state.auth.login) {
        html +=
          state.auth.login;
      } else {
        html +=
          state.auth.userId;
      }
    } else {
      html += 
        '<span class="fa fa-user"></span> &nbsp;Not authenticated'
    }
    html += 
        '<i class="mdi mdi-menu-down right"></i></a></li>'
      '</ul>';
    
    $('#toolbarUser').html(html);

    var html = '';
    if(!state.auth.authenticated) {
      html += 
        '<li><a href="#!" onclick="ToolbarUser.login()">Log in</a></li>' +
        '<li><a href="#!" onclick="Login.createAccount()">Create an account</a></li>'
    } else {
//      html += '<li><a href="#!" onclick="ToolbarUser.settings()">Settings</a></li>';
      html += 
        '<li><a href="#!" onclick="ToolbarUser.changePassword()">Change password</a></li>' +
        '<li><a href="#!" onclick="ToolbarUser.logout()">Log out</a></li>'
    }
    $('#toolbarUserMenu').html(html);
    $('#toolbarUser .dropdown-button').dropdown();
  },

  logout: function() {
	console.log(document.location)
    document.location = 'auth/logout?url='+document.location.href;
  },

  login: function() {
    // document.location = '/login.html';
    var state = Store.getState();
    state.page = 'login';
    Main.display();
  },

  settings: function() {
    ToolbarUserSettings.openModal();
  },

  changePassword: function() {
    ToolbarUserChangePassword.openModal();
  }

};
