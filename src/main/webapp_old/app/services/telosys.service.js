
function encodeFileId(fileId) {
  return fileId.replace(/\//g,'%2F').replace(/\\/g,'%5C');
}

function encodeFolderId(fileId) {
  return fileId.replace(/\//g,'%2F').replace(/\\/g,'%5C');
}

var TelosysService = {

  getTelosysFolderForProject: function(userId, projectId, callback) {
    var deferred = Q.defer();

    $.ajax({
      url: host + "api/v1/users/"+userId+"/projects/"+projectId+"/telosys",
      dataType: 'json'
    })
      .success(function (msg) {
        deferred.resolve(msg);
      })
      .fail(function (jqXHR, textStatus) {
        deferred.fail(textStatus);
      });

    return deferred.promise;
  },

  createEntityForModel: function(userId, projectId, modelName, entityName, callback) {
    $.ajax({
      method: "PUT",
      url: host + "api/v1/users/"+userId+"/projects/"+projectId+"/models/"+modelName+"/entities/"+entityName,
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
  },


};