
function encodeFileId(fileId) {
  //return fileId.replace(/\//g,'%2F').replace(/\\/g,'%5C');
  return encodeURIComponent(fileId);
}

function encodeFolderId(fileId) {
  //return fileId.replace(/\//g,'%2F').replace(/\\/g,'%5C');
  return encodeURIComponent(fileId);
}

var FilesService = {

  getFilesForProject: function(userId, projectId, callback) {
    var deferred = Q.defer();

    $.ajax({
      url: host + "api/v1/users/"+userId+"/projects/"+projectId+"/workspace",
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

  getFileForProject: function(userId, projectId, fileId, callback) {
    $.ajax({
      url: host + "api/v1/users/"+userId+"/projects/"+projectId+"/files?fileId="+encodeFileId(fileId),
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

  createFolderForProject: function(userId, projectId, folder, callback) {
    $.ajax({
      method: "PUT",
      url: host + "api/v1/users/"+userId+"/projects/"+projectId+"/folders?folderId="+encodeFolderId(folder.id),
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(folder)
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

  createFileForProject: function(userId, projectId, file, callback) {
	var url = host + "api/v1/users/"+userId+"/projects/"+projectId+"/files?fileId="+encodeFolderId(file.id);
    $.ajax({
      method: "PUT",
      url: url,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(file)
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

  saveFileForProject: function(userId, projectId, file, callback) {
    $.ajax({
      method: "PUT",
      url: host + "api/v1/users/"+userId+"/projects/"+projectId+"/files?fileId="+encodeFileId(file.id),
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(file)
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

  deleteFileForProject: function(userId, projectId, fileId, callback) {
    $.ajax({
      method: "DELETE",
      url: host + "api/v1/users/"+userId+"/projects/"+projectId+"/files?fileId="+encodeFileId(fileId),
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

  deleteFolderForProject: function(userId, projectId, folderId, callback) {
  $.ajax({
    method: "DELETE",
    url: host + "api/v1/users/"+userId+"/projects/"+projectId+"/folders?folderId="+encodeFolderId(folderId),
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