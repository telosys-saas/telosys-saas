var Store = {
  init: function() {
    var deferred = Q.defer();

    this.state = {
      openFiles: {}
    };

    AuthService.status()
      .then(function(auth) {
        this.state.profile = profile;
        deferred.resolve(this.state);

      }.bind(this))
      .catch(function(e) {
        deferred.reject(e);

      });

    return deferred.promise;
  },

  getState: function() {
    return this.state;
  }

};
