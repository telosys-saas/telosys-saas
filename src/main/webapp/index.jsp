<!doctype html>
<html class="no-js" lang="en" ng-app="app">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Telosys Web</title>
    <meta name="description" content="Telosys Web">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="stylesheet" href="lib/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="lib/bootstrap/3.3.7/css/bootstrap.min.css">
    <link href="lib/materialdesignicons/css/materialdesignicons.css" media="all" rel="stylesheet" type="text/css">
</head>

<body>
<div>
    <h1>Telosys</h1>
    <a href="login">Login</a><br>
    <a href="createAccount">Create account</a>
    <br>
    <b><%
        if (request.getSession().getAttribute("error") != null) {
        out.println(request.getSession().getAttribute("error"));
        }
        %></b>
</div>
</body>

</html>
