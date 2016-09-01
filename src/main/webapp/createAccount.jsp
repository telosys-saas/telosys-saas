<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>

<form name="createAccountForm" action="/createAccount" method="POST">
    <div class="row">
        <div class="input-field col s12">
            <span class="card-title">Create an account</span>
        </div>
        <div class="input-field col s12">
            <i class="mdi mdi-account-circle prefix"></i>
            <label for="createaccountform_login" id="createaccountform_login_label">Username</label>
            <input type="text" name="login" id="createaccountform_login"/>
        </div>
        <div class="input-field col s12">
            <i class="mdi mdi-email prefix"></i>
            <label for="createaccountform_mail" id="createaccountform_mail_label">E-mail address</label>
            <input type="email" name="mail" id="createaccountform_mail"/>
        </div>
        <div class="input-field col s12">
            <i class="mdi mdi-key prefix"></i>
            <label for="createaccountform_password1" id="createaccountform_password1_label">Password</label>
            <input type="password" name="password1" id="createaccountform_password1"/>
        </div>
        <div class="input-field col s12">
            <i class="mdi prefix"></i>
            <label for="createaccountform_password2" id="createaccountform_password2_label">Password confirmation</label>
            <input type="password" name="password2" id="createaccountform_password2"/>
        </div>
    </div>
    <div class="card-action">
        <div class="buttons col s12">
            <button type="submit" id="createaccountform_button_create">Create account</button>
        </div>
    </div>
</form>

</body>
</html>