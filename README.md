# Telosys Saas

## TODO List

* Define root directory as command line argument

## Configuration

Définir le répertoire qui va contenir la liste des utilisateurs et les fichiers des workspaces :
 * 


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
