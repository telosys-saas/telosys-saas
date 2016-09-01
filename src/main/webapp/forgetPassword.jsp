<!DOCTYPE html>
<html lang="en">
<head>

</head>
<body>
<form name="createAccountForm" action="/forgetPassword" method="POST">
    <div class="row">
        <div class="input-field col s12">
            <span class="card-title">Forget password</span>
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
    </div>
    <div class="card-action">
        <div class="buttons col s12">
            <button type="submit" id="forgetpasswordform_button_create">Send email</button>
        </div>
    </div>
</form>
</body>
</html>