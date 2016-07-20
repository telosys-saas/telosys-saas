'use strict';

angular.module('app')
    .factory('FilesService', ['$http', function ($http) {

        var allFiles = {};
        var userId = 'user';
        var host = '';

        return {

            getFilesForProject: function (userId, projectId, callback) {
                $http({
                    method: 'GET',
                    url: 'api/v1/users/'+userId+'/projects/' + projectId + '/workspace'
                })
                    .then(function (result) {
                        if (callback) callback(result.data);
                    })
            },

            getFileForProject: function(userId, projectId, fileId, callback) {
                return $http({
                    method: 'GET',
                    url: host + "api/v1/users/"+userId+"/projects/"+projectId+"/files?fileId="+encodeURIComponent(fileId)
                })
                .catch(function (e) {
                    console.log(e);
                });
            },

            convertFolderToJson: function (folder, parent, type) {
                //console.log('folder : ', folder);
                
                if (type == 'root') {
                    var currentNode = {
                        id: '@@_root_@@',
                        text: folder.name,
                        type: 'project',
                        children: []
                    };
                }
                else if (type == 'telosys') {
                    var currentNode = {
                        id: '@@_telosys_@@',
                        text: folder.name,
                        type: 'telosys',
                        children: []
                    };
                }
                else {
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
            
            getAllFiles : function () {return allFiles;}

            /* createFolderForProject: function(userId, projectId, folder, callback) {
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
             },*/
        };

    
    }]);
