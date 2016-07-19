var Welcome = {

  init: function() {
    this.display();
  },

  display: function() {
    $.get('app/view/index/welcome/welcome.html', function(html) {
      $('#main').html(html);
      $('#main .parallax').parallax();
      $('footer').hide();

      $.get('app/view/index/login/login.html', function (html) {
        $('#login').html(html);
        $('#main').click();
      });

    });
  }

};