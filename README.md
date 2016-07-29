# Telosys Saas IDE

Telosys IDE

## Configuration

Define a new environment variable  :
 -
 TELOSYS_ROOT="pathToLocalDirectory"

## Install & Run

* Download:
 * ```git clone https://github.com/telosys-saas/telosys-saas.git```
* Go to the project folder:
 * ```cd telosys-saas```
* Build:
 * ```cd telosys-saas```
 * ```mvn clean package```
* Run:
 * ```java -jar target/telosys-saas.jar```
=> Console output : ```[main] INFO org.eclipse.jetty.server.Server - Started```
* Go to the URL :
 * [http://localhost:8080](http://localhost:8080)

## Development configuration

### Java Back-end

* In Eclipse / Netbeans / IntellijIdea :
 * Import the project as a Maven Project
 * Run the main class : ```org.telosys.saas.TelosysSaasServer```

### Front-end

* Develop front-end in the ```web```folder with Visual Studio Code / Webstorm / Netbeans

# Technical documentation : IDE

The IDE page permits to the user to edit projects files.

## Page

The IDE page is composed of :
- at left :
  - Opened files : list of opened files
  - Project files : Treeview of the project files
- at right :
  - Files editors
  - Consoles

## Source code organization

- ide.controller.js : IDE AngularJS controller
- ide.html : Main view
- directive/ :
  - ide.toolbar.directive : Main top toolbar
  - ide.left.directive : Left view
  - ide.workgingfiles.directive : Opened files
  - ide.treeview.directive : Treeview of project files
  - ide.editor.directive : File editor
  - ide.console.directive : Logs console

## Data model

Data shared by the controller and used by the directives of the IDE page.

- $scope.data:
  - project : current project infos
  - projects : all projects
  - tree : All project files as a tree
  - allFiles : All project files as an array in only one level
  - events : IDE events managed by the controller
  - workingFiles : Pinned opened files
  - openFile : Temporary opened file
  - selectedFile : Selected file
  - selectedElement : Selected element in the treeview (folder or file)

## IDE events

Events function of the controller used by the directives of the IDE page in response of the user actions.

- $scope.data.events :
  - onCreateFile : After file creation
  - onCreateFolder : After folder creation
  - onClickFile : File selection
  - onDoubleClickFile : Double click on a file to pin it
  - onDeleteFolder : During folder deletion
  - onDeleteFile : During file deletion
  - onCloseFile : During file closing
  - closeAll : User action to close all opened files
  - refreshAll : User action to force refresh of the project
  - onContentChange : After file content change
  - saveFile : During file saving
  - saveAll : During all opened files saving
  - onRefreshFile : File refresh
  - onDownload : User action to download project files in ZIP

## Services REST

- **ProjectsService** : Projects management
  - **getProjects** : Get all projects
    - GET : api/v1/users/user/project
  - **getProject** : Get one project by project id
    - GET : api/v1/users/user/projects/[projectId]
  - **createProject** : Create new project
    - PUT : api/v1/users/[userId]/projects/[projectName]
  - **downloadZip** : Download the project as a zip
    - GET : api/v1/users/[userId]/projects/[projectName]/zip
- **FilesService** : Files management
  - **getFilesForProject** : Get all projects files
    - GET : api/v1/users/[userId]/projects/[projectId]/workspace
  - **convertFolderToJson** : Convert all project files as a JSON tree data for the treeview display
  - **convertFileToJson** : Convert one project file to JSON for the treeview display
  - **getAllFiles** : Convert all project files as a JSON list on oonly one level
  - **getFileForProject** : Get the file of one project
    - GET : api/v1/users/[userId]/projects/[projectId]/files?fileId=[fileId]
  - **createFolderForProject** : Create a new folder in the project
    - PUT : api/v1/users/[userId]/projects/[projectId]/createFolder?folderId=[folder.id]
  - **createFileForProject** : Create a file in the project
    - PUT : api/v1/users/[userId]/projects/[projectId]/createFile?fileId=[fileId]
  - **saveFileForProject** : Save a file
    - PUT : api/v1/users/[userId]/projects/[projectId]/files?fileId=[fileId]
  - **deleteFileForProject** : Delete a file
    - DELETE : api/v1/users/[userId]/projects/[projectId]/files?fileId=[fileId]
  - **deleteFolderForProject** : Delete a folder
    - DELETE : api/v1/users/[userId]/projects/[projectId]/folders?folderId=[folderId]
