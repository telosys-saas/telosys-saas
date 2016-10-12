# Directives : scope.data

Links between main data and the data in the directive scope

$scope => scope du controller principal "IDEController"

$scope.data => Les données de l'IDE stockés dans le controller principal

View : Models
treeview : data = $scope.data.models
editor : data = $scope.data.models
console : data = $scope.data
View : Bundles
treeview : data = $scope.data.bundles
editor : data = $scope.data.bundles
console : data = $scope.data
View : Generation
generation : data = $scope.data
View : Files
treeview : data = $scope.data.files
editor : data = $scope.data.files
console : data = $scope.data
Directives : $watch

editor :
data.selectedFile :
view : Models : data.selectedFile = $scope.data.models.selectedFile
view : Bundles : data.selectedFile = $scope.data.bundles.selectedFile
view : Console : data.selectedFile = $scope.data.console.selectedFile
data.workingFiles :
view : Models : data.workingFiles = $scope.data.models.workingFiles
view : Bundles : data.workingFiles = $scope.data.bundles.workingFiles
view : Console : data.workingFiles = $scope.data.console.workingFiles
console :
data.generation.generationResults
data.models.modelErrors

$scope.data => Les données de l'IDE stockés dans le controller principal
