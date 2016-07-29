'use strict';

/**
 * IDE Controller
 */
angular.module('ide').controller('ideCtrl', ['ProjectsService', 'FilesService', '$scope', '$routeParams', '$log',
  function (ProjectsService, FilesService, $scope, $routeParams, $log) {

    /** authentication */
    $scope.auth = {
      userId: 'user'
    };

    /** Indicates if the IDE is initialized and could be displayed */
    $scope.initialized = false;

    /** IDE data */
    $scope.data = {
      /** Current project */
      project: {},
      /**
       * List of projects
       */
      projects: [],
      /** All files of the project as a tree */
      tree: {},
      /** All files of the project in only one level */
      allFiles: {},
      /** IDE events redirected to controller functions */
      events: {},
      /** Working files */
      workingFiles: {},
      /** Selected file */
      selectedFile: null,
      /** Open File */
      openFile: null,
      /** Select element in the treeview */
      selectedElement: null
    };

    /**
     * Events functions of this controller which will be called by sub components to manage user actions
     */
    function defineEvents() {
      $scope.data.events = {
        // File creation
        onCreateFile: $scope.onCreateFile,
        // Folder creation
        onCreateFolder: $scope.onCreateFolder,
        // Select a file
        onClickFile: $scope.onClickFile,
        // Open a file
        onDoubleClickFile: $scope.onDoubleClickFile,
        // Delete the folder
        onDeleteFolder: $scope.onDeleteFolder,
        // Delete the file
        onDeleteFile: $scope.onDeleteFile,
        // Close the file
        onCloseFile: $scope.onCloseFile,
        // Close all files
        closeAll: $scope.closeAll,
        // Refresh all files
        refreshAll: $scope.refreshAll,
        // File content changes
        onContentChange: $scope.onContentChange,
        // Save the file
        saveFile: $scope.saveFile,
        // Save all files
        saveAll: $scope.saveAll,
        // Refresh the file
        onRefreshFile: $scope.onRefreshFile,
        // Donwload the project in zip file
        onDownload: $scope.onDownload
      }
    }

    /**
     * Call $apply if there is no $digest currently
     */
    $scope.safeApply = function () {
      var phase = $scope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        $log.info("apply or digest already in progress")
      } else {
        $scope.$apply();
      }
    };

    /**
     * Close all editors
     */
    $scope.closeAll = function () {
      $log.info("close all");
      var hasModifiedFile = false;
      for (var fileOpened in $scope.data.workingFiles) {
        if ($scope.data.workingFiles[fileOpened].isModified) {
          hasModifiedFile = true;
        }
      }
      if (hasModifiedFile) {
        if (!confirm("Les modifications seront perdues. Souhaitez-vous continuer ?")) {
          return;
        }
      }
      for (var fileOpened in $scope.data.workingFiles) {
        if ($scope.data.workingFiles[fileOpened].isModified) {
          $scope.saveFile($scope.data.workingFiles[fileOpened]);
        }
        delete $scope.data.workingFiles[fileOpened];
        $scope.data.allFiles[fileOpened].hasContent = false;
      }
      if ($scope.data.selectedFile != null) {
        $scope.data.selectedFile.hasContent = false;
        $scope.data.selectedFile = null;
      }
      if ($scope.data.openFile != null) {
        $scope.data.openFile.hasContent = false;
        $scope.data.openFile = null;
      }
      console.log($scope.data.workingFiles);
    };

    /**
     * Close current File
     * @param fileId File id
     */
    $scope.onCloseFile = function (fileId) {
      if ($scope.data.selectedFile.isModified &&
        confirm("Voulez-vous enregistrez les modifications apportées à " + $scope.data.selectedFile.name + "?")) {
        $scope.saveFile();
      }
      $log.info("close file", fileId);
      var workingFilesArray = [];
      var indexFile;
      for (var fileKey in $scope.data.workingFiles) {
        var tempFile = {};
        tempFile = $scope.data.workingFiles[fileKey];
        if(fileKey == fileId){
          indexFile = workingFilesArray.length-1;
        }
        workingFilesArray.push(tempFile);
      }
      
      console.log('workingFilesArray',workingFilesArray[indexFile]);
      $scope.data.allFiles[fileId].hasContent = false;
      delete $scope.data.workingFiles[fileId];

      if ($scope.data.selectedFile) {
        if ($scope.data.selectedFile.id == fileId) {
          $scope.data.selectedFile.hasContent = true;
          $scope.data.selectedFile = workingFilesArray[indexFile];
        }
      }
      if ($scope.data.openFile) {
        if ($scope.data.openFile.id == fileId) {
          $scope.data.openFile.hasContent = false;
          $scope.data.openFile = null;
        }
      }
      $scope.onClickFile(workingFilesArray[indexFile].id);
    };

    /**
     * Save all modified files
     */
    $scope.saveAll = function () {
      $log.info("save all");
      for (var file in $scope.data.workingFiles) {
        $log.info("save all for loop", $scope.data.workingFiles[file]);
        FilesService.saveFileForProject($scope.auth.userId, $scope.data.project.id, $scope.data.workingFiles[file]);
        $scope.data.workingFiles[file].isModified = false;
      }
      if ($scope.data.selectedFile) {
        if (!$scope.data.workingFiles[$scope.data.selectedFile.id]) {
          $log.info("save all selectedFile");
          $scope.data.selectedFile.isModified = false;
          FilesService.saveFileForProject($scope.auth.userId, $scope.data.project.id, $scope.data.selectedFile);
        }
      }
    };

    /**
     * Save the opened selected file
     */
    $scope.saveFile = function (file) {
      if (file) {
        $log.info('save file', file);
        FilesService.saveFileForProject($scope.auth.userId, $scope.data.project.id, file);
      } else {
        $log.info('save selectedFile');
        $scope.data.selectedFile.isModified = false;
        FilesService.saveFileForProject($scope.auth.userId, $scope.data.project.id, $scope.data.selectedFile);
      }
    };

    /**
     * File creation
     * @param file File to create
     */
    $scope.onCreateFile = function (file) {
      $log.info('onCreateFile', file);
      $scope.data.workingFiles[file.id] = file;
      $scope.data.allFiles[file.id] = file;
      $scope.data.selectedFile = file;
      file.isModified = false;
      $scope.safeApply();
    };

    /**
     * Folder creation
     * @param folder Folder to create
     */
    $scope.onCreateFolder = function (folder) {
      $log.info('onCreateFolder', folder);
      $scope.safeApply();
    };

    /**
     * Delete the folder
     * @param folderId Folder id to delete
     */
    $scope.onDeleteFolder = function (folderId) {
      $log.info('onDeleteFolder', folderId);
      FilesService.deleteFolderForProject($scope.auth.userId, $scope.data.project.id, folderId);
    };

    /**
     * Delete the file
     * @param fileId File id to delete
     */
    $scope.onDeleteFile = function (fileId) {
      FilesService.deleteFileForProject($scope.auth.userId, $scope.data.project.id, fileId);
      delete $scope.data.workingFiles[fileId];
      if ($scope.data.selectedFile.id == fileId) {
        $scope.data.selectedFile = null;
      }if ($scope.data.openFile.id == fileId) {
        $scope.data.openFile = null;
      }

    };

    /**
     * Select a file
     * @param fileId File id to select
     */
    $scope.onClickFile = function (fileId) {
      var file = $scope.data.allFiles[fileId];

      if (!$scope.data.workingFiles[fileId]) {
        $scope.data.openFile = file;
      }
      $scope.data.selectedFile = file;
      if (!file.hasContent) {
        FilesService.getFileForProject($scope.auth.userId, $scope.data.project.id, fileId)
          .then(function (result) {
            var file = result.data;
            $log.info('getFileForProject', file);
            $scope.data.allFiles[file.id].hasContent = true;
            $scope.data.allFiles[file.id].content = file.content;
            $scope.data.allFiles[file.id].isModified = false;
          });
      }
      $scope.safeApply();
    };

    /**
     * Open a file
     * @param fileId File id to open
     */
    $scope.onDoubleClickFile = function (fileId) {
      $log.info('onDoubleClickFile', fileId);
      var file = $scope.data.allFiles[fileId];
      if ($scope.data.selectedFile.id != fileId) {
        $scope.data.selectedFile = file;
      }
      $scope.data.workingFiles[file.id] = file;
      $scope.safeApply();
    };

    /**
     * The user changes the file content
     * @param fileId File id modified by user
     */
    $scope.onContentChange = function (fileId) {
      $log.info('onContentChange', fileId);
      $scope.data.allFiles[fileId].isModified = true;
      $scope.data.workingFiles[fileId] = $scope.data.allFiles[fileId];
      $scope.safeApply();
    };

    /**
     * Refresh all opened files
     */
    $scope.refreshAll = function () {
      ProjectsService.getProjectById($routeParams.projectId, function (result) {
        $scope.data.project = result;
        FilesService.getFilesForProject($scope.auth.user, $scope.data.project.id, function (result) {
          $scope.data.tree = FilesService.convertFolderToJson(result, null, 'root');
          $scope.data.allFiles = FilesService.getAllFiles();
        })
      });
    };

    /**
     * Refresh the selected file
     * @param callback Callback to update the file content in the editor
     */
    $scope.onRefreshFile = function (callback) {
      FilesService.getFileForProject($scope.auth.userId, $scope.data.project.id, $scope.data.selectedFile.id)
        .then(function (result) {
          var file = result.data;
          $log.info('refresh file', file);
          $scope.data.allFiles[file.id].hasContent = true;
          $scope.data.allFiles[file.id].content = file.content;
          $scope.data.allFiles[file.id].isModified = false;
          $scope.data.selectedFile = $scope.data.allFiles[file.id];
          if (callback) {
            callback();
          }
        })
    };

    $scope.onDownload = function () {
      ProjectsService.downloadZip($scope.auth.userId, $scope.data.project.id)
    };

    $scope.addProject = function () {
      console.log('addProject');
      var modalInstance = $uibModal.open({
        templateUrl: 'app/dashboard/modal/modal.createproject.html',
        controller: 'ideModalCtrl'
      });

      modalInstance.result.then(function (project) {
        console.log('modalInstance.result.then', project);
        ProjectsService.getProjects(function (result) {
          $scope.projects = result;
        })
      })
    };

    /**
     * Initialize the IDE
     */
    function init() {
      defineEvents();
      // Get the current project
      ProjectsService.getProjectById($routeParams.projectId, function (result) {
        $scope.data.project = result;
        // Get all files of the current project
        FilesService.getFilesForProject($scope.auth.user, $scope.data.project.id, function (result) {
          $scope.data.tree = FilesService.convertFolderToJson(result, null, 'root');
          $scope.data.allFiles = FilesService.getAllFiles();
          // Indicates that the IDE is initialized and can be displayed
          $scope.initialized = true;
        })
      });
      ProjectsService.getProjects(function (result) {
        $scope.data.projects = result;
      });
    }

    init();
  }]);
