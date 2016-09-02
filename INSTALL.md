# PREPARE

## Update
- apt-get update

## git
- apt-get install git

## jdk 1.8
- sudo add-apt-repository ppa:webupd8team/java
- sudo apt-get update
- sudo apt-get install oracle-java8-installer
- sudo apt-get install oracle-java8-set-default

## tomcat 8
- sudo apt-get install tomcat8
- sudo apt-get install tomcat8-admin
- sudo nano /etc/default/tomcat8
  - replace ```-Xmx128m``` by ```-Xmx512m``` in ```JAVA_OPTS``` line
- sudo nano /etc/tomcat8/tomcat-users.xml
  - add in ```<tomcat-users>``` :
```
<tomcat-users>
    <user username="admin" password="password" roles="manager-gui,admin-gui"/>
</tomcat-users>
```
- sudo service tomcat8 restart
- Test with URL : http://localhost:8080/manager/html

## maven 3
- apt-get install maven

## Telosys data folder
- sudo mkdir /opt/telosys-saas
- sudo nano /opt/telosys-saas/telosys-saas.properties
  - define this content :
```
dataRootPath        = /opt/telosys-saas
httpPort            = 8080
authRedirectUrl     = http://localhost:8080/api/callback
githubOauthKey      = cbbe70a7fa16533ca892
githubOauthPassword = 2fcbd7d3f417582f042bb33baa1875b46454f70e
gmailUsername       = telosystoolsdemo@gmail.com
gmailPassword       = telosysteam1
```
- sudo chown -R tomcat8:tomcat8 /opt/telosys-saas

## TELOSYS_ROOT variable
- Edit ```context.xml```Tomcat file :
- nano /etc/tomcat8/conf/context.xml
- Add this line in ```<Context>``` :
```
<Environment name="TELOSYS_ROOT" type="java.lang.String" value="/opt/telosys-saas" override="false" />
```

# BUILD
- mkdir ~/work
- cd ~/work
- git clone https://github.com/telosys-saas/telosys-saas.git
- cd telosys-saas
- mvn clean package
- sudo cp target/telosys-saas.war /var/lib/tomcat8/webapps
- sudo chown tomcat8:tomcat8 /var/lib/tomcat8/webapps/telosys-saas.war
- sudo service tomcat8 restart

See logs :
- tail -n 500 /var/lib/tomcat8/logs/catalina.out

Go to the application:
- http://localhost:8080/talosys-saas
