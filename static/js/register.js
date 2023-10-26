// import $ from "jquery";
$(() => {

    function isEmailValid(email) {
        // Utilisez une expression régulière pour valider l'email
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return emailRegex.test(email);
    }

    
    $('#register').on("submit", e => {
        e.preventDefault();
        resetValidity();
        const data = $('#register').serializeArray();
        console.table(data);
        const username = data[0].value;
        const email = data[1].value;
        const password = data[2].value;
        const repassword = data[3].value;

        // Vérifications

        if (username == ""){
            $("#username").parent().addClass('invalid');
            $('#username').next().find('.error-msg .msg-text').text('You must specify a username.');
            return false;
        } else if (username.includes(" ")) {
            $("#username").parent().addClass('invalid');
            $('#username').next().find('.error-msg .msg-text').text('Username can\'t contain spaces.');
            return false;
        } else if (!(/^[A-Za-z0-9._]+$/.test(username))) {
            $("#username").parent().addClass('invalid');
            $('#username').next().find('.error-msg .msg-text').text('Username can\'t contain special characters.');
            return false;
        } else if (username.length > 16) {
            $("#username").parent().addClass('invalid');
            $('#username').next().find('.error-msg .msg-text').text('Username length should be less than 16.');
            return false;
        } else if (email == "") {
            $("#email").parent().addClass('invalid');
            $('#email').next().find('.error-msg .msg-text').text('You must specify a valid email.');
            $("#username").parent().addClass("valid");
        } else if (!isEmailValid(email)) {
            $("#email").parent().addClass('invalid');
            $('#email').next().find('.error-msg .msg-text').text('Invalid email format.');
            $("#username").parent().addClass("valid");
            return false;
        } else if (password == ""){
            $('#password').parent().addClass("invalid");
            $('#password').next().find('.error-msg .msg-text').text('You must specify a password.');
            $("#username").parent().addClass("valid");
            $("#email").parent().addClass("valid");
            return false;
        } else if (password.includes(" ")) {
            $('#password').parent().addClass("invalid");
            $('#password').next().find('.error-msg .msg-text').text('Password can\'t contain spaces.');
            $("#username").parent().addClass("valid");
            $("#email").parent().addClass("valid");
            return false;
        } else if (password.length <= 8) {
            $('#password').parent().addClass("invalid");
            $('#password').next().find('.error-msg .msg-text').text('Password must be at least 8 chars.');
            $("#username").parent().addClass("valid");
            $("#email").parent().addClass("valid");
            return false;
        } else if (!/[A-Z]/.test(password)) {
            $('#password').parent().addClass("invalid");
            $('#password').next().find('.error-msg .msg-text').text('Password must contain a uppercase character.');
            $("#username").parent().addClass("valid");
            $("#email").parent().addClass("valid");
            return false;
        } else if (!/[!@#$%^&*(),~.?":{}|<>]/.test(password)) {
            $('#password').parent().addClass("invalid");
            $('#password').next().find('.error-msg .msg-text').text('Password must contain at least 1 special character.');
            $("#username").parent().addClass("valid");
            $("#email").parent().addClass("valid");
            return false;
        } else if (!/\d/.test(password)) {
            $('#password').parent().addClass("invalid");
            $('#password').next().find('.error-msg .msg-text').text('Password must contain at least 1 number.');
            $("#username").parent().addClass("valid");
            $("#email").parent().addClass("valid");
            return false;
        } else if (repassword == "") {
            $('#passwordretype').parent().addClass("invalid");
            $('#passwordretype').next().find('.error-msg .msg-text').text('You must retype your password.');
            $("#username").parent().addClass("valid");
            $("#email").parent().addClass("valid");
            $("#password").parent().addClass("valid");
            return false;
        } else if (repassword != password) {
            $('#passwordretype').parent().addClass("invalid");
            $('#passwordretype').next().find('.error-msg .msg-text').text('Passwords doesn\'t match.');
            $("#username").parent().addClass("valid");
            $("#email").parent().addClass("valid");
            $("#password").parent().addClass("valid");
            return false;
        }
        resetValidity();

        // Requête ajax
        $.ajax({
            url: '/auth/register',
            method: "POST",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                username,
                email,
                password,
                repassword
            }),
            success: (resp) => {
                window.location.href = '/auth/login'
            },
            error: (err) => {
                if (err.status == 422){
                    const {error, message} = err.responseJSON;
                    $('#' + error).parent().addClass("invalid");
                    $('#' + error).next().find('.error-msg .msg-text').text(message);
                }
            }
        })
    })
    $('#passwordretype').on("input", e => {
        // console.log($(e.target).val());
    })
    function resetValidity(){
        $('.invalid').removeClass("invalid");
        $('.valid').removeClass("valid");
    }
})