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
    <link rel="stylesheet" type="text/css" href="css/index.css">
    <link href="lib/materialdesignicons/css/materialdesignicons.css" media="all" rel="stylesheet" type="text/css">
</head>

<body>

<header>
    <div class="container">
        <div class="row">
            <div class="col-sm-1">
                <div class="item logo">
                </div>
            </div>
            <div class="col-sm-4">
                <span class="item title">
                    <a href="<%=request.getContextPath()%>/">Telosys Saas</a>
                </span>
            </div>
            <div class="col-sm-7 right-align">
                <a href="createAccount" class="btn btn-success">Sign up</a>
            </div>
        </div>
    </div>
</header>

<div class="shade-gradient">
    <div class="login without-backdrop">
        <div class="login-heading">
            <h4>Log in to Your Account</h4>
        </div>
        <div class="login-body">
            <form name="loginform" action="" method="POST" accept-charset="UTF-8" role="form">
                <div class="form-group">
                    <a href="/" class="btn btn-default btn-lg btn-github btn-block" role="button"><i class="fa fa-github fa-2x"></i>Sign in with GitHub</a>
                </div>
                <hr/>
                <% if (request.getSession().getAttribute("error") != null) { %>
                <div class="form-group">
                    <div class="alert alert-danger">
                        <%=request.getSession().getAttribute("error")%>
                    </div>
                </div>
                <% request.getSession().removeAttribute("error"); %>
                <% } %>
                <div class="form-group">
                    <input name="username" id="username" type="text" class="form-control input-lg" placeholder="Username" />
                </div>
                <div class="form-group">
                    <input name="password" id="password" type="password" class="form-control input-lg" placeholder="Password" />
                </div>
                <p class="help-block">
                    If you don't have an account, <a href="/createAccount">sign up</a>.
                    Forgot your password? <a href="/forgetPassword">Reset it</a> with your email.
                </p>
                <button type="submit" class="btn btn-success btn-lg btn-block" role="button" data-reactid="86">Sign in</button>
            </form>
        </div>
    </div>
</div>

</body>

</html>
