
var ProjectsService = {
  loadProjects: function (userId, callback) {
    $.ajax({
      url: host + "api/v1/users/"+userId+"/projects",
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

  getProjectConfiguration: function (userId, projectName, callback) {
    $.ajax({
      url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/configuration",
      dataType: 'json'
    })
      .done(function (msg) {
        console.log(msg);
      })
      .success(function (projectConfiguration) {
        console.log(projectConfiguration);
        if(projectConfiguration && projectConfiguration.variables && projectConfiguration.variables.specificVariables) {
          projectConfiguration.variables.specificVariables = JSON.parse(projectConfiguration.variables.specificVariables);
        }
        if (callback) {
          callback(projectConfiguration);
        }
      })
      .fail(function (jqXHR, textStatus) {
        console.log(textStatus);
      });
  },

  saveProjectConfiguration: function (userId, projectName, projectConfiguration, callback) {
    if(projectConfiguration && projectConfiguration.variables && projectConfiguration.variables.specificVariables) {
      projectConfiguration.variables.specificVariables = JSON.stringify(projectConfiguration.variables.specificVariables);
    }

    $.ajax({
      method: "PUT",
      url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/configuration",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(projectConfiguration)
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

    if(projectConfiguration && projectConfiguration.variables && projectConfiguration.variables.specificVariables) {
      projectConfiguration.variables.specificVariables = JSON.parse(projectConfiguration.variables.specificVariables);
    }
  },

  createProject: function (userId, projectName, callback) {
    $.ajax({
      method: "PUT",
      url: host + "api/v1/users/"+userId+"/projects/"+projectName,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        id: projectName,
        name: projectName
      })
    })
      .success(function (msg) {
        console.log(msg);
        if (callback) {
          callback(msg);
        }
      })
      .fail(function (jqXHR, textStatus) {
        console.log(textStatus);
      })
      .done(function (msg) {
        console.log(msg);
      });
  },

  getBundlesOfProject: function (userId, projectName, callback) {
    $.ajax({
      method: "GET",
      url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/bundles",
      dataType: 'json'
    })
      .success(function (msg) {
        console.log(msg);
        if (callback) {
          callback(msg);
        }
      })
      .fail(function (jqXHR, textStatus) {
        console.log(textStatus);
      })
      .done(function (msg) {
        console.log(msg);
      });
  },

  addBundle: function (userId, projectName, bundleName, callback) {
    $.ajax({
      method: "PUT",
      url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/bundles/"+bundleName,
      dataType: 'json'
    })
      .done(function (msg) {
        console.log(msg);
      })
      .success(function (msg) {
        console.log(msg);
        //this.deleteDownloadBundleDirectory(userId, projectName, function() {
          if (callback) {
            callback(msg);
          }
        //});
      }.bind(this))
      .fail(function (jqXHR, textStatus) {
        console.log(textStatus);
      });
  },

  deleteDownloadBundleDirectory: function (userId, projectName, callback) {
    var folderDownloadBundle = "TelosysTools%2Fdownloads";
    $.ajax({
      method: "DELETE",
      url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/folders/"+folderDownloadBundle,
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

  removeBundle: function (userId, projectName, bundleName, callback) {
    $.ajax({
      method: "DELETE",
      url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/bundles/"+bundleName,
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

  /*
  getModelNames: function(userId, projectName, callback) {
    $.ajax({
      method: "GET",
      url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/models",
      dataType: 'json'
    })
      .success(function (modelNames) {
        console.log(modelNames);
        if (callback) {
          callback(modelNames.names);
        }
      })
      .fail(function (jqXHR, textStatus) {
        console.log(textStatus);
      })
      .done(function (msg) {
        console.log(msg);
      });
  },
  */

  getModels: function(userId, projectName, callback) {
    $.ajax({
      method: "GET",
      url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/models",
      dataType: 'json'
    })
      .success(function (msg) {
        console.log(msg);
        if (callback) {
          callback(msg);
        }
      })
      .fail(function (jqXHR, textStatus) {
        console.log(textStatus);
      })
      .done(function (msg) {
        console.log(msg);
      });
  },

  getModel: function(userId, projectName, modelName, callback) {
    $.ajax({
      method: "GET",
      url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/models/"+modelName,
      dataType: 'json'
    })
      .success(function (model) {
        console.log(model);
        if (callback) {
          callback(model);
        }
      })
      .fail(function (jqXHR, textStatus) {
        console.log(textStatus);
      })
      .done(function (msg) {
        console.log(msg);
      });
  },

  createModel: function(userId, projectName, modelName, callback) {
    $.ajax({
      method: "PUT",
      url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/models/"+modelName,
      dataType: 'json'
    })
      .success(function (model) {
        console.log(model);
        if (callback) {
          callback(model);
        }
      })
      .fail(function (jqXHR, textStatus) {
        console.log(textStatus);
      })
      .done(function (msg) {
        console.log(msg);
      });
  },

  deleteModel: function(userId, projectName, modelName, callback) {
    $.ajax({
      method: "DELETE",
      url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/models/"+modelName,
      dataType: 'json'
    })
      .success(function (model) {
        console.log(model);
        if (callback) {
          callback(model);
        }
      })
      .fail(function (jqXHR, textStatus) {
        console.log(textStatus);
      })
      .done(function (msg) {
        console.log(msg);
      });
  },

  launchGeneration: function (userId, projectName, generation, callback) {
    var deferred = Q.defer();
    $.ajax({
      method: "PUT",
      url: host + "api/v1/users/"+userId+"/projects/"+projectName+"/action/generate",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(generation)
    })
      .success(function (msg) {
        console.log(msg);
        if (callback) {
          callback(generation, msg);
        }
        deferred.resolve(msg);
      })
      .fail(function (jqXHR, textStatus) {
        console.log(textStatus);
        deferred.reject(textStatus);
      })
      .done(function (msg) {
        console.log(msg);
      });
    return deferred.promise;
  },

  downloadZip: function(userId, projectName) {
    document.location = host + "api/v1/users/"+userId+"/projects/"+projectName+"/zip";
  }

};
