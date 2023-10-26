// import $ from "jquery";

$(() => {
    // Partie login
    $("#loginbtn").on('click', (e) => {
        e.preventDefault();
        resetValidity();
        const serializedForm = $("#login").serializeArray();
        const username = serializedForm[0].value;
        const password = serializedForm[1].value;
        const rememberMe = serializedForm[2]?true:false;
        error = false;

        if (username == ""){
            $("#username_login").parent().addClass('invalid');
            $('#username_login').next().find('.error-msg .msg-text').text('You must specify a username');
            error = true;
            return false;
        } else if (username.includes(" ")) {
            $("#username_login").parent().addClass('invalid');
            $('#username_login').next().find('.error-msg .msg-text').text('Username can\'t contain spaces.');
            return false;
        } else if (password == ""){
            $('#password_login').parent().addClass("invalid");
            $('#password_login').next().find('.error-msg .msg-text').text('You must specify a password');
            $("#username_login").parent().addClass("valid");
            return false;
        } else if (password.includes(" ")) {
            $('#password_login').parent().addClass("invalid");
            $('#password_login').next().find('.error-msg .msg-text').text('Password can\'t contain spaces.');
            $("#username_login").parent().addClass("valid");
            return false;
        }

        // Requête ajax
        $.ajax({
            url: '/auth/login',
            method: "POST",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({username, password, rememberMe}),
            success: function(data){
                console.log("succes", data);
                if(data.loggedin){
                    window.location.href = "/profile/"
                }
            },
            error: function(data){
                if (data.status == 404) {
                    $("#username_login").parent().addClass('invalid');
                    $('#username_login').next().find('.error-msg .msg-text').text('This user doesn\'t exist');
                }
                else if (data.status == 403){
                    $('#password_login').parent().addClass("invalid");
                    $('#password_login').next().find('.error-msg .msg-text').text('Invalid password');
                    $("#username_login").parent().addClass("valid");
                }
                console.log("erreur", data.status);
            }
        });
    });

    function resetValidity(){
        $('.invalid').removeClass("invalid");
        $('.valid').removeClass("valid");
    }
});