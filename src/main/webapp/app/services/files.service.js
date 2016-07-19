'use strict';

angular.module('app')
    .factory('FilesService', ['$http', function ($http) {
        return {
            getFilesForProject: function (userId, projectId, callback) {
                $http({
                    method: 'GET',
                    url: 'api/v1/users/user/projects/' + projectId + '/workspace'
                })
                    .then(function (result) {
                        if (callback) callback(result.data);
                    })
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
                return currentNode;
            }
        }
    }]);
