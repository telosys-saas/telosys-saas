var BundlesService = {

  getBundlesInPublicRepository: function (callback) {
    $.ajax({
      url: host + "api/v1/bundles",
      dataType: 'json'
    })
      .done(function (msg) {
        console.log(msg);
      })
      .success(function (msg) {
        console.log(msg);
        if (callback) {
          callback(msg);
        }
      })
      .fail(function (jqXHR, textStatus) {
        console.log(textStatus);
      });
  }

};