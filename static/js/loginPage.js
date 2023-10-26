$(() => {
    // Partie login
    $("#loginbtn").on('click', (e) => {
        e.preventDefault();
        const serializedForm = $("#login").serializeArray();
        const username = serializedForm[0].value;
        const password = serializedForm[1].value;
        console.log(`Trying to login for user: ${username} with password: ${password}`);
        // Faire les vérifications

        // Suite du code
        // Requête ajax
        $.ajax({
            url: '/auth/login',
            method: "POST",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({username, password}),
            success: function(data){
                console.log("succes", data);
                if(data.loggedin){
                    window.location.href = "/profile/"
                }
            },
            error: function(data){
                console.log("erreur", data.responseJSON.message);
            }
        });
    });
});