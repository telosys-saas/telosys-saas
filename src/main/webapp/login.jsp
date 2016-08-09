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
<h2>Sign in to Telosys SaaS</h2>
<div class="col-sm-2">
    <b><%
        if (request.getSession().getAttribute("error") != null) {
            out.println(request.getSession().getAttribute("error"));
        }
    %></b>
    <form action="/callback" method="POST">
        <input type="hidden" name="client_name" value="FormClient"/>
        <div class="row">
            <label class="label-control">
                Login:
            </label>
            <div>
                <input type="text" name="username" value="Fabien" class="form-control"/>
            </div>
        </div>
        <div class="row" style="margin-top: 10px">
            <label class="label-control">
                Password:
            </label>
            <div>
                <input type="password" name="password" value="fabien" class="form-control"/>
            </div>
        </div>
        <div class="row text-right" style="margin-top: 20px">
            <button class="btn btn-primary">Sign in</button>
        </div>
        <button class="btn btn-large black light" type="button" onclick="document.location = '/profile/github'">
            <span class="fa fa-github fa-2x"></span>
            &nbsp; &nbsp; &nbsp; Sign in with GitHub
        </button>
    </form>
    <a href="/forgetPassword"> Forget password</a>
</div>
</body>

</html>
