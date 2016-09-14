# IDE

The IDE page permits to the user to edit projects files.

## Page

The IDE page is composed of 6 tabs :

- Models, Templates bundle and Generated files, each of this tab are base on the same form
    - at left
        - a Treeview with a list of files
    - at right :
        - Files editors
        - and a console (Models and generations results)
        
- The generation view is used to associate a model and its entities to a bundle and some template(s)

- Configuration and Download Project are 2 modals window :
    - Configuration : Edit the settings of the project
    - Download : Get the project from the server
    
## Source code organization

- ide.controller.js : IDE AngularJS controller
- ide.html : Main view
- directive/ :
    - ide.configuration.directive : Manage the configuration modal window
    - ide.console.directive : Result for the models and the generation
    - ide.editor.directive : File editor
    - ide.generation.directive : Generation view
    - ide.toolbar.directive : Main top toolbar
    - ide.treeview.directive : Treeview for the project files

## Data model

Data shared by the controller and used by the directives of the IDE page.

- $scope.data :
    - project: Current project information
    - projects: All projects of the user
    - isDisplay: View to display (ex : models or configuration)
    - events: IDE events managed by the controller
    - telosysFolder: The Telosys Tools Folder (models and bundles)
    - host: The host url of the application
      
- Data for model created by the user $scope.data.models : 
    - project: Current project information
    - tree: All files of models as a tree
    - allFiles: All files of the models in only one level
    - workingFiles : List of opened files
    - selectedFile : The selected file,
    - selectedModel : The name of the selected model in the treeview
    - countModifiedFile : Counter of modified file
    - selectedElement : Selected element in the treeview
    - modelErrors : List of model/entity error(s)
    - errorTransformeds : Formatted error(s) for the console
    - events : IDE events redirected to controller functions

- Data for templates to generate files from the model $scope.data.bundles : 
    - project : Current project information
    - tree : All files of the bundles as a tree
    - allFiles : All files of the bundles in only one level
    - workingFiles : List of opened files
    - selectedFile : The selected file
    - countModifiedFile : Counter of modified file
    - selectedElement : Select element in the treeview
    - bundlesOfProject : List of available bundles of the project
    - allBundles : All bundles in github public repository
    - events : IDE events redirected to controller functions

- Data for generated files $scope.data.files : 
    - project : Current project information
    - tree : All generated files as a tree
    - allFiles : All generated files in only one level
    - workingFiles : List of opened files
    - selectedFile : The selected file
    - countModifiedFile : Counter of modified file
    - selectedElement : Select element in the treeview
    - events : IDE events redirected to controller functions

- Data to configure the project $scope.data.configuration :
    - variables : The environment variables of the current project
    - events : IDE events redirected to controller functions
    
- Data to generate the code and display the result (success or errors) $scope.data.generation :
    - model : The name of the selected model for the server
    - entities : The list of name of the selected entities for the server
    - bundle : The name of the selected bundle for the server
    - templates : The list of name of the selected templates for the server
    - selectedModelEntitys : Map of the selected entities
    - selectedBundleTemplates : Map of the selected templates
    - selectedModel : The selected model
    - selectedBundle : The selected bundle
    - generationResults : The result of the generation from the server
    - errorTransformeds : The formatted errors to display in the console
    - events : IDE events redirected to controller functions

## IDE events

Events function of the controller used by the directives of the IDE page in response of the user actions.

- Common events :
    - onCreateFile: $scope.onCreateFile,
    - onCreateFolder: Folder creation
    - onClickFile: Select a file
    - onDoubleClickFile:  Open a file                   
    - onDeleteFolder: Delete the folder
    - onDeleteFile: Delete the file         
    - onCloseFile: Close the file
    - closeAll: Close all files         
    - onContentChange: File content changes 
    - saveFile: Save the file           
    - saveAll: Save all files           
    - onRefreshFile: Refresh the file
    - onDownload: Download the project in zip file 
    - changeView: Change the view to display                       
    - generate: Launch the generation

- Specific events for models :
    - refreshAllModels : Refresh the tree for the model view
 
- Specific events for bundles :
    - removeBundle : Remove a bundle
    - refreshAllBundles : Refresh the tree for the bundle view
    - getTemplateForGeneration : Get the template to display in the generation view
  
- Specific events for files :
    - refreshAllFiles : Refresh the tree for the model view

## Services

- **AuthService** : Authentication management
  - **status** : Get the status of the user, if connected or false otherwise 
    - GET : /api/v1/profile/user
  - **changePassword** : change password for the authenticated user
    - PUT : /api/v1/users/[login]/action/changePassword
    - DATA : [changePassword] as a string

- **BundleService** : Bundle management
  - **getBundlesOfProject** : Get bundle for a project
    - GET : /api/v1/users/[userId]/projects/[projectName]/bundles
  - **getBundlesInPublicRepository** : Get bundles from a github repository
    - GET : /api/v1/bundles/[githubRepository]
  - **addBundle** : add a bundle to the current project
    - PUT : /api/v1/users/[userId]/projects/[projectName]/bundles/[githubUserName]/[bundleName]
  - **removeBundle** : Remove a bundle to the current project
    - DELETE : /api/v1/users/[userId]/projects/[projectName]/bundles/[bundleName]

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

- **ModelService** : Model management
    - **getModels** : Get models for a project
        - GET : /api/v1/users/[userId]/projects/[projectName]/models
    - **getModel** : Get a model for a project
        - GET : /api/v1/users/[userId]/projects/[projectName]/models/[modelName]
    - **createModel** : create a new model
        - PUT : /api/v1/users/[userId]/projects/[projectName]/models/[modelName]
    - **createEntityForModel** : Remove a bundle to the current project
        - PUT : /api/v1/users/[userId]/projects/[projectId]/models/[modelName]/entities/[entityName]

- **ProjectsService** : Projects management
    - **getProjects** : Get all projects
        - GET : api/v1/users/user/project
    - **getProjectById** : Get one project by project id
        - GET : api/v1/users/user/projects/[projectId]
    - **createProject** : Create new project
        - PUT : api/v1/users/[userId]/projects/[projectName]
    - **launchGeneration** : launch the generation 
        - PUT : /api/v1/users/[userId]/projects/[projectName]/action/generate
    - **downloadZip** : Download the project as a zip
        - GET : api/v1/users/[userId]/projects/[projectName]/zip
    - **getProjectConfiguration** : Get the configuration for the project
        - GET : /api/v1/users/[userId]/projects/[projectName]/configuration
    - **saveProjectConfiguration** : Save the configuration
        - PUT : /api/v1/users/[userId]/projects/[projectName]/configuration
    - **getTemplateForGeneration** : Get the list template given a bundle name
        - GET :/api/v1/users/[userId]/projects/[projectName]/templates/[bundleName]
    
- **TelosysService** : Telosys management
    - **getTelosysFolderForProject** : Get the Telosys folder
        - GET : /api/v1/users/[userId]/projects/[projectId]/telosys