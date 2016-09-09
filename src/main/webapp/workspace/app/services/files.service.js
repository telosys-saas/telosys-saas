'use strict';

angular.module('app')
  .factory('FilesService', ['$http', function ($http) {

    var getContextPath = function () {
      var context = window.location.pathname.split('/');
      var contextPath = "";
      for (var index = 0; index < context.length; index++) {
        if (context[index] == "workspace") {
          break;
        }
        if (context[index] != "") {
          contextPath += '/' + context[index];
        }
      }
      return contextPath;
    };

    var host = getContextPath();

    return {

      /**
       * Get all files from the server for the user and the selected project
       * @param userId User ID
       * @param projectId Project ID
       */
      getFilesForProject: function (userId, projectId) {
        return $http({
          method: 'GET',
          url: host + '/api/v1/users/' + userId + '/projects/' + projectId + '/workspace'
        })
          .catch(function (e) {
            console.log(e);
          });
      },

      /**
       * Convert the folder object to JSON for the tree
       * @param folder Folder to convert
       * @param parent Parent node
       * @param type Type of the folder
       * @returns JSON Folder
       */
      convertFolderToJson: function (folder, parent, type) {

        var currentNode;
        switch (type) {
          case 'folder' :
          {
            currentNode = {
              id: folder.id,
              text: folder.name,
              type: type,
              children: []
            };
          }
            break;

          case 'model' :
          {
            currentNode = {
              id: folder.id,
              text: folder.name,
              type: type,
              children: []
            };
          }
            break;

          case 'bundle' :
          {
            currentNode = {
              id: folder.id,
              text: folder.name,
              type: type,
              children: []
            };
          }
            break;

          default:
          {
            currentNode = {
              id: folder.id,
              text: folder.name,
              type: folder.type,
              children: []
            };
          }
            break;
        }

        if (!parent  && type != 'bundle') {
          currentNode.state = {
            'opened': true
          };
        }

        // Case : the current folder contains subFolder(s)
        if (folder.folders) {
          for (var i = 0; i < folder.folders.length; i++) {
            var folderSub = folder.folders[i];
            var folderSubNode = this.convertFolderToJson(folderSub, currentNode);
            if (folderSubNode) {
              currentNode.children.push(folderSubNode);
            }
          }
        }

        // Case : the current folder contains file(s)
        if (folder.files) {
          for (var i = 0; i < folder.files.length; i++) {
            var file = folder.files[i];
            var fileNode = this.convertFileToJson(file);
            if (fileNode) {
              currentNode.children.push(fileNode);
            }
          }
        }
        return currentNode;
      }
      ,

      /**
       * Convert the object file to JSON for the tree
       * @param file File to convert
       * @returns JSON File
       */
      convertFileToJson: function (file) {
        var currentNode = {
          id: file.id,
          text: file.name,
          type: file.type,
          isModified: false,
          hasContent: false
        };
        return currentNode;
      }
      ,

      /**
       * All project files as an array in only one level (no subFolder)
       * @param folder Folder
       * @returns map of files
       */
      getAllFiles: function (folder) {
        var allFiles = {};
        if (folder.folders) {
          for (var i = 0; i < folder.folders.length; i++) {
            var folderSub = folder.folders[i];
            var tempAllFiles = this.getAllFiles(folderSub);
            for (var fileId in tempAllFiles) {
              allFiles[fileId] = tempAllFiles[fileId];
            }
          }
        }
        if (folder.files) {
          for (var i = 0; i < folder.files.length; i++) {
            var file = folder.files[i];
            if(folder.type == 'model'){
              file.modelName = folder.name;
            }
            allFiles[file.id] = file;
          }
        }
        return allFiles;
      }
      ,

      /**
       * Get one file from the server for the user and the selected project
       * @param userId User ID
       * @param projectId Project ID
       * @param fileId File ID
       * @returns {*}
       */
      getFileForProject: function (userId, projectId, fileId) {
        return $http({
          method: 'GET',
          url: host + "/api/v1/users/" + userId + "/projects/" + projectId + "/files?fileId=" + encodeURIComponent(fileId)
        })
          .catch(function (e) {
            console.log(e);
          });
      }
      ,

      /**
       * @param userId User ID
       * @param projectId Project ID
       * @param folder Folder to send to the server
       * @returns {*}
       */
      createFolderForProject: function (userId, projectId, folder) {
        return $http({
          method: "PUT",
          url: host + "/api/v1/users/" + userId + "/projects/" + projectId + "/createFolder?folderId=" + encodeURIComponent(folder.id),
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(folder)
        })
          .catch(function (e) {
            console.log(e);
          });
      }
      ,

      /**
       * Create a new file in the current project
       * @param userId User ID
       * @param projectId Project ID
       * @param file File to send to the server
       * @returns {*}
       */
      createFileForProject: function (userId, projectId, file) {
        return $http({
          method: "PUT",
          url: host + "/api/v1/users/" + userId + "/projects/" + projectId + "/createFile?fileId=" + encodeURIComponent(file.id),
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(file)
        })
          .catch(function (e) {
            console.log(e);
          });
      }
      ,

      /**
       * Save the file for the current project
       * @param userId User ID
       * @param projectId Project ID
       * @param file File to save
       * @returns {*}
       */
      saveFileForProject: function (userId, projectId, file) {
        return $http({
          method: "PUT",
          url: host + "/api/v1/users/" + userId + "/projects/" + projectId + "/files?fileId=" + encodeURIComponent(file.id),
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(file)
        })
          .catch(function (e) {
            console.log(e);
          });
      }
      ,

      /**
       * Delete the file for the current project
       * @param userId User ID
       * @param projectId Project ID
       * @param fileId File ID to delete
       * @returns {*}
       */
      deleteFileForProject: function (userId, projectId, fileId) {
        return $http({
          method: "DELETE",
          url: host + "/api/v1/users/" + userId + "/projects/" + projectId + "/files?fileId=" + encodeURIComponent(fileId)
        })
          .catch(function (e) {
            console.log(e);
          });
      }
      ,

      /**
       * Delete the folder for the current project
       * @param userId User ID
       * @param projectId Project ID
       * @param folderId Folder ID to delete
       * @returns {*}
       */
      deleteFolderForProject: function (userId, projectId, folderId) {
        console.log("deleteFolderForProject", folderId);
        return $http({
          method: "DELETE",
          url: host + "/api/v1/users/" + userId + "/projects/" + projectId + "/folders?folderId=" + encodeURIComponent(folderId)
        })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  }
  ]);
