var Welcome = {

  init: function() {
    this.display();
  },

  display: function() {
    $.get('app/view/index/welcome/index.html', function(html) {
      $('#main').html(html);
      $('#main .parallax').parallax();
      $('footer').hide();

      $.get('app/view/index/login/login.jsp', function (html) {
        $('#login').html(html);
        $('#main').click();
      });

    });
  }

};