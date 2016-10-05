# PREPARE

## Update
- sudo apt-get update

## Jdk 1.8
- sudo add-apt-repository ppa:webupd8team/java
- sudo apt-get update
- sudo apt-get install oracle-java8-installer
- sudo apt-get install oracle-java8-set-default

## Telosys application folder
- mkdir ~/work

## Tomcat 7
- cd ~/work
- wget http://apache.mirrors.ovh.net/ftp.apache.org/dist/tomcat/tomcat-7/v7.0.70/bin/apache-tomcat-7.0.70.tar.gz
- tar -xzvf apache-tomcat-7.0.70.tar.gz
- nano ~/work/apache-tomcat-7.0.70/conf/tomcat-users.xml 
  - add in ```<tomcat-users>``` :
```
<tomcat-users>
    <user username="admin" password="password" roles="manager-gui,admin-gui"/>
</tomcat-users>
```

## Telosys data folder
- sudo mkdir /opt/telosys-saas
- sudo chown $USER:$USER telosys-saas
- nano /opt/telosys-saas/telosys-saas.properties
  - define this content :
```
githubOauthKey=
githubOauthPassword=
gmailUsername=
gmailPassword=
mailRedirect=http://localhost:8080/telosys-saas
loginAttemptsMax=3
numberOfProjectMax=3
```

## TELOSYS_ROOT variable
- Edit ```context.xml``` tomcat file :
- nano ~/work/apache-tomcat-7.0.70/conf/context.xml
- Add this line in ```<Context>``` :
```
<Environment name="TELOSYS_ROOT" type="java.lang.String" value="/opt/telosys-saas" override="false" />
```

## Maven 3 and Git
- sudo apt-get install maven git

## BUILD and DEPLOY the application 
- cd ~/work
- git clone https://github.com/telosys-saas/telosys-saas.git
- cd telosys-saas
- mvn clean package
- sudo cp target/telosys-saas.war  ~/work/apache-tomcat-7.0.70/webapps

## START the application
- cd ~/work/apache-tomcat-7.0.70/bin
- ./startup.sh

- Test with URL : http://localhost:8080/manager/html

See logs :
- tail -n 500  ~/work/apache-tomcat-7.0.70/logs/catalina.out 

Go to the application :
- http://localhost:8080/telosys-saas