'use strict';

/**
 * IDE Controller
 */
angular.module('ide').controller('ideCtrl', ['AuthService', '$location', 'ProjectsService', 'FilesService', '$scope', '$routeParams', '$log', '$uibModal',
  function (AuthService, $location, ProjectsService, FilesService, $scope, $routeParams, $log, $uibModal) {

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

      /**
       * View to display
       */
      isDisplay: null,

      /**
       * Data for model created by the user
       */
      model: {
        name: 'model'
      },

      /**
       * All templates to generate files from the model
       */
      bundles:{
        name: 'bunbles'
      },

      /**
       * Data for generated files
       */
      files: {
        name: 'files',
        /** All files of the project as a tree*/
        tree: {},
        /** All files of the project in only one level */
        allFiles: {},
        /** Working files */
        workingFiles: {},
        /** Selected file */
        selectedFile: null,
        /** Open File */
        openFile: null,
        /** Select element in the treeview */
        selectedElement: null
      },
      /** IDE events redirected to controller functions */
      events: {}
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
        onDownload: $scope.onDownload,
        // change the view to display
        changeView: $scope.changeView
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
      // Check if one of the opened file is modified
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
      // Close the opened file
      for (var fileOpened in $scope.data.workingFiles) {
        // Save the modified file(s)
        if ($scope.data.workingFiles[fileOpened].isModified) {
          $scope.saveFile($scope.data.workingFiles[fileOpened]);
        }
        // and close all
        delete $scope.data.workingFiles[fileOpened];
        $scope.data.allFiles[fileOpened].hasContent = false;
      }
      if ($scope.data.selectedFile) {
        $scope.data.selectedFile.hasContent = true;
        $scope.data.selectedFile = null;
      }
      if ($scope.data.openFile) {
        $scope.data.openFile.hasContent = false;
        $scope.data.openFile = null;
      }
      console.log($scope.data.workingFiles);
    };

    /**
     * Close the fileId
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
        if (fileKey == fileId) {
          indexFile = workingFilesArray.length - 1;
        }
        workingFilesArray.push(tempFile);
      }
      console.log('workingFilesArray', workingFilesArray[indexFile]);
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
        FilesService.saveFileForProject($scope.auth.userId, $scope.data.project.id, $scope.data.workingFiles[file]);
        $scope.data.workingFiles[file].isModified = false;
      }
      if ($scope.data.selectedFile) {
        if (!$scope.data.workingFiles[$scope.data.selectedFile.id]) {
          $scope.data.selectedFile.isModified = false;
          FilesService.saveFileForProject($scope.auth.userId, $scope.data.project.id, $scope.data.selectedFile);
        }
      }
    };

    /**
     * Save the selected file or the file if defined
     * @param file File to save
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
     * After file creation
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
     * After folder creation
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
      }
      if ($scope.data.openFile.id == fileId) {
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

      if (!file.hasContent) {
        FilesService.getFileForProject($scope.auth.userId, $scope.data.project.id, fileId)
          .then(function (result) {
            var file = result.data;
            $log.info('getFileForProject', file);
            $scope.data.allFiles[file.id].hasContent = true;
            $scope.data.allFiles[file.id].content = file.content;
            $scope.data.allFiles[file.id].isModified = false;
            $scope.data.selectedFile = $scope.data.allFiles[file.id];
          });
      } else {
        $scope.data.selectedFile = file;
      }
      $scope.safeApply();
    };

    /**
     * Open a file and pinned it
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

    /**
     * Download the project in a ZIP file
     */
    $scope.onDownload = function () {
      ProjectsService.downloadZip($scope.auth.userId, $scope.data.project.id)
    };

    /**
     * Create a new project
     */
    $scope.addProject = function () {
      console.log('addProject');
      // Modal window to create a new file
      var modalInstance = $uibModal.open({
        templateUrl: 'app/dashboard/modal/modal.createproject.html',
        controller: 'ideModalCtrl'
      });

      // When the creation is a success
      modalInstance.result.then(function (project) {
        console.log('modalInstance.result.then', project);
        ProjectsService.getProjects(function (result) {
          $scope.projects.push(project);
        })
      })
    };

    $scope.changeView = function (view) {
      $scope.data.isDisplay = view;
    };

    /**
     * Initialize the IDE
     */
    function init() {
      AuthService.status().then(function (result) {
        $scope.profile = result.data;
        console.log($scope.profile);
        $scope.data.isDisplay = 'model';
        if ($scope.profile.authenticated == true) {
          defineEvents();
          // Get the current project
          ProjectsService.getProjectById($scope.auth.userId, $routeParams.projectId, function (result) {
            $scope.data.project = result;
            // Get all files of the current project
            FilesService.getFilesForProject($scope.auth.user, $scope.data.project.id, function (result) {
              $scope.data.files.tree = FilesService.convertFolderToJson(result, null, 'root');
              $scope.data.files.allFiles = FilesService.getAllFilesFromTree(result);
              // Indicates that the IDE is initialized and can be displayed
              $scope.initialized = true;
            })
          });
          ProjectsService.getProjects($scope.auth.userId, function (result) {
            $scope.data.projects = result;
          });
        }else {
          console.log('authenticated false')
        }
      })
    }
    init();
  }]);
