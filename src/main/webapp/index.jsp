<!DOCTYPE html>
<html lang="en">
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
                <form class="form-inline" name="loginform" action="login.jsp" method="POST" accept-charset="UTF-8" role="form">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="form-group">
                                <input name="username" id="username" type="text" class="form-control" placeholder="Username" />
                            </div>
                            <div class="form-group">
                                <input name="password" id="password" type="password" class="form-control" placeholder="Password" />
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-default item">Sign in</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</header>

<div class="shade-gradient">
    <div class="container">
        <% if (request.getSession().getAttribute("success") != null) { %>
        <div class="col-sm-12">
            <div class="alert alert-success">
                <%=request.getSession().getAttribute("success")%>
            </div>
        </div>
        <% request.getSession().removeAttribute("success"); %>
        <% } %>
        <div class="col-sm-6">
            <div class="home-presentation">
                <h1>The lightest and easiest code generator</h1>
                <div class="container-fluid" style="margin-top: 43px;">
                    <div class="row">
                        <div class="col-sm-2 center-align" style="padding-right: 20px">
                            <span class="fa-stack fa-2x" style="color: #888888">
                                <i class="fa fa-circle fa-stack-2x"></i>
                                <i class="fa fa-sitemap fa-stack-1x fa-inverse"></i>
                            </span>
                        </div>
                        <div class="col-sm-3 center-align" style="padding: 5px 0">
                            <h4>1 : Design</h4>
                        </div>
                        <div class="col-sm-7 center-align" style="padding: 5px 20px; font-size: 110%;">
                            <p class="text-muted black-text">Use the Telosys DSL (Domain Specification Language) to design your model</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-2 center-align" style="padding-right: 20px">
                            <span class="fa-stack fa-2x" style="color: #888888">
                                <i class="fa fa-circle fa-stack-2x"></i>
                                <i class="fa fa-bolt fa-stack-1x fa-inverse"></i>
                            </span>
                        </div>
                        <div class="col-sm-3 center-align" style="padding: 5px 0">
                            <h4>2 : Generate</h4>
                        </div>
                        <div class="col-sm-7 center-align" style="padding: 5px 20px; font-size: 110%;">
                            <p class="text-muted black-text">Use existing templates or create new templates to generate your application<br/><br/></p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-2 center-align" style="padding-right: 20px">
                            <span class="fa-stack fa-2x" style="color: #888888">
                                <i class="fa fa-circle fa-stack-2x"></i>
                                <i class="fa fa-download fa-stack-1x fa-inverse"></i>
                            </span>
                        </div>
                        <div class="col-sm-3 center-align" style="padding: 5px 0">
                            <h4>3 : Download</h4>
                        </div>
                        <div class="col-sm-7 center-align" style="padding: 5px 20px; font-size: 110%;">
                            <p class="text-muted black-text">Download the generated application as a ZIP file and let's develop on it</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="login without-backdrop" style="width: auto">
                <div class="login-body">
                    <form name="createAccountForm" action="createAccount" method="POST">
                        <div class="form-group">
                            <a href="<%=request.getContextPath()%>/accessToGithub" class="btn btn-default btn-lg btn-github btn-block" role="button"><i class="fa fa-github fa-2x"></i>Sign in with GitHub</a>
                        </div>
                        <hr/>
                        <% if (request.getSession().getAttribute("error") != null) { %>
                        <div class="form-group">
                            <div class="alert alert-danger">
                                <% out.println(request.getSession().getAttribute("error")); %>
                            </div>
                        </div>
                        <% } %>
                        <div class="form-group">
                            <input name="login" id="login" type="text" class="form-control input-lg" placeholder="Username" />
                        </div>
                        <div class="form-group">
                            <input name="mail" id="mail" type="text" class="form-control input-lg" placeholder="Email Address" />
                        </div>
                        <div class="form-group">
                            <input name="password1" id="password1" type="password" class="form-control input-lg" placeholder="Password" />
                        </div>
                        <div class="form-group">
                            <input name="password2" id="password2" type="password" class="form-control input-lg" placeholder="Confirm Password" />
                        </div>
                        <button type="submit" class="btn btn-success btn-lg btn-block" role="button" data-reactid="86">Create an account</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<!--
<footer class="footer">
    <div class="container">
        <p class="text-muted">Place sticky footer content here.</p>
    </div>
</footer>
<!--
<div class="welcome-section-footer" style="position: fixed; bottom: 0; width: 100%;">
    <div class="container">
        <div class="row">
            <div class="col-sm-6 center-align" style="padding: 20px">
                <p><a href="http://www.telosys.org" target="_blank">Telosys</a></p>
                <p><a href="https://sites.google.com/site/telosystools/" target="_blank">Telosys Source code generator</a></p>
                <p><a href="http://marketplace.eclipse.org/content/telosys-tools" target="_blank">Plugin Telosys Tools For Eclipse</a></p>
                <p><a href="https://github.com/telosys-tools" target="_blank">Templates for code generation</a></p>
            </div>
            <div class="col-sm-6 center-align" style="padding: 20px">
                <p><a mailto="telosysteam@gmail.com" target="_blank">Contact us by mail : telosysteam@gmail.com</a></p>
                <p><a href="https://moot.it/telosystools" target="_blank">Forum : https://moot.it/telosystools</a></p>
                <p><a href="http://telosys-tools.blogspot.com/" target="_blank">Blog : http://telosys-tools.blogspot.com/</a></p>
            </div>
        </div>
    </div>
</div>
-->

</body>
</html>
