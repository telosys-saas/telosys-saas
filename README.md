# Telosys Saas IDE

Telosys IDE

## Introduction

The Telosys IDE is a documentation and code generator.

Features available (for this version) :
 - Create project
 - Create/Delete folder
 - Create/Delete/Edit file
 - Download the project in a ZIP file

## Configuration

Define the application workspace in an environment variable  :
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
 * [http://localhost:8181](http://localhost:8181)

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
  - project : current project information
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

## Security

To configure Github OAuth For Telosys, go to the Github page "OAuth" of the organization "Telosys".

Java classes :
- Pac4jConfigFactory : define authentication modes (with login/password or with github)
- FormAuthenticator : Manage authentication with login/password form
- RedirectAfterGithubLogin : Redirect to the workspace page after a github authentication

### Pac4J : Form authentication

Steps :
- the user goes to the login page and defines his username and password
- it makes a POST on URL "/callback" to call the PAC4J callback filter : CallbackFilter
- This filter detects that the user wants to authenticate with his username and password and use the PAC4J client "FormClient" which is defined by the class "FormAuthenticator"
- The method "validate" of "FormAuthenticator" searches the login in the users file "users.txt"
- And it compares the password to validate the authentication
- "FormAuthenticator" defines the user profile which indicates that user is authenticated

### Pac4J : Github authentication

Steps:
- the user goes to the login page and click on the button "Login with Github"
- it makes a POST on the URL "/auth/github" to call the PAC4J "RequiresAuthenticationFilter"
- it uses the PAC4J Github client which has been initialized with the client id and secret token
- it calls Github URL for Oauth authentication : "https://github.com/login/oauth/authorize?client_id=AAA&redirect_uri=AAA&scope=AAA" with the client id and redirect URL
- the redirect URL must match with the redirect URL registered in Github for this OAuth application key
- Github displays an authorization confirmation page to the user
- If the user confirms, then Github redirect the user to the "redirect URL"
- It redirectes the user to the Telosys webapp on "/auth/github"
- It calls the servlet "RedirectAfterGithubLogin" which redirects the user to the workspace page "/workspace"

### Github OAuth : How create an OAuth key

- On Github, go to the organization "Telosys" settings page : https://github.com/settings/profile
- Click on "OAuth applications" in the left entries to display OAuth authorization page
- Click on the tab "Developer application"
- Click on "Register a new application" button
- Set an application Name
- Defines a callback URL which matches with the PAC4J callback filter URL defined in the web.xml. This callback URL must start by "http://" or "https://". It likes : "http://localhost:8080/callback"
- Click on "Register application"
- It creates an OAuth key with a "Client ID" and a "Client secret"
- These "Client ID", "Client secret" and "Callback URL" must be written in the file "telosys-saas.properties" located in the TELOSYS_ROOT directory as follow :
    - authRedirectUrl="CallbackURL"
    - githubOauthKey="ClientID"
    - githubOauthPassword"ClientSecret"

## Server mail configuration

The application use a gmail account to send automatic email to confirm the email address for a new account or to reset a password.
The username and the password of the gmail account are written in the file "telosys-saas.properties" located in the TELOSYS_ROOT directory.
The properties have to be set as follow :
- gmailUsername="username" (without "@gmail.com")
- gmailPassword="password" (not encrypted)

To allowed Telosys to use gmail, you have to change the security parameter of your account.
Go on this web page: https://www.google.com/settings/u/1/security/lesssecureapps and activate the access for the application less secure.

The properties configurations to send the emails are define in the java class "GMail".
##### Properties :
- host: smtp.gmail.com
- protocol: smtp
- port: 587
- authentication: enabled
- start tls : enabled