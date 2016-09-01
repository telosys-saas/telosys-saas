# PREPARE

## Update
- ```apt-get update```

## git
- ```apt-get install git```

## jdk 1.8
- ```sudo add-apt-repository ppa:webupd8team/java```
- ```sudo apt-get update```
- ```sudo apt-get install oracle-java8-installer```
- ```sudo apt-get install oracle-java8-set-default```

## tomcat 8
- ```sudo apt-get install tomcat8```
- ```sudo apt-get install tomcat8-admin```
- ```sudo nano /etc/default/tomcat8```
  - replace ```-Xmx128m``` by ```-Xmx512m``` in ```JAVA_OPTS``` line
- ```sudo nano /etc/tomcat8/tomcat-users.xml```
  - add in ```<tomcat-users>```:
```
<tomcat-users>
    <user username="admin" password="password" roles="manager-gui,admin-gui"/>
</tomcat-users>
```
- ```sudo service tomcat8 restart```
- Test with URL : http://localhost:8080/manager/html

## Telosys data folder
- ```mkdir /opt/telosys-saas```
- ```nano /opt/telosys-saas/telosys-saas.properties```
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

# BUILD
- git clone https://github.com/telosys-saas/telosys-saas.git
- cd telosys-saas
