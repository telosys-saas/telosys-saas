'use strict';

angular.module('app')
  .factory('FilesService', ['$http', function ($http) {

    var allFiles = {};
    var host = '';

    return {

      getFilesForProject: function (userId, projectId, callback) {
        $http({
          method: 'GET',
          url: 'api/v1/users/' + userId + '/projects/' + projectId + '/workspace'
        })
          .then(function (result) {
            if (callback) callback(result.data);
          })
      },

      convertFolderToJson: function (folder, parent, type) {

        //console.log('folder :', folder);
        if (type == 'root') {
          var currentNode = {
            id: '@@_root_@@',
            text: folder.name,
            type: 'project',
            children: []
          };
        } else {
          var currentNode = {
            id: folder.id,
            text: folder.name,
            type: folder.type,
            children: []
          };
        }

        if (!parent) {
          currentNode.state = {
            'opened': true
          };
        }

        if (folder.folders) {
          for (var i = 0; i < folder.folders.length; i++) {
            var folderSub = folder.folders[i];
            var folderSubNode = this.convertFolderToJson(folderSub, currentNode);
            if (folderSubNode) {
              currentNode.children.push(folderSubNode);
            }
          }
        }

        if (folder.files) {
          for (var i = 0; i < folder.files.length; i++) {
            var file = folder.files[i];
            var fileNode = this.convertFileToJson(file, currentNode);
            if (fileNode) {
              currentNode.children.push(fileNode);
            }
          }
        }
        return currentNode;
      },

      convertFileToJson: function (file, parent) {
        var currentNode = {
          id: file.id,
          text: file.name,
          type: file.type
        };
        allFiles[file.id] = file;
        return currentNode;
      },

      getAllFiles: function () {
        return allFiles;
      },

      getFileForProject: function (userId, projectId, fileId) {
        return $http({
          method: 'GET',
          url: host + "api/v1/users/" + userId + "/projects/" + projectId + "/files?fileId=" + encodeURIComponent(fileId)
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      createFolderForProject: function (userId, projectId, folder) {
        return $http({
          method: "PUT",
          url: host + "api/v1/users/" + userId + "/projects/" + projectId + "/folders?folderId=" + encodeURIComponent(folder.id),
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(folder)
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      createFileForProject: function (userId, projectId, file) {
        return $http({
          method: "PUT",
          url: host + "api/v1/users/" + userId + "/projects/" + projectId + "/files?fileId=" + encodeURIComponent(file.id),
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(file)
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      saveFileForProject: function (userId, projectId, file) {
        return $http({
          method: "PUT",
          url: host + "api/v1/users/" + userId + "/projects/" + projectId + "/files?fileId=" + encodeURIComponent(file.id),
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(file)
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      deleteFileForProject: function (userId, projectId, fileId) {
        return $http({
          method: "DELETE",
          url: host + "api/v1/users/" + userId + "/projects/" + projectId + "/files?fileId=" + encodeURIComponent(fileId)
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      deleteFolderForProject: function (userId, projectId, folderId) {
        console.log("deleteFolderForProject",folderId);
        return $http({
          method: "DELETE",
          url: host + "api/v1/users/" + userId + "/projects/" + projectId + "/folders?folderId=" + encodeURIComponent(folderId)
        })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  }]);
