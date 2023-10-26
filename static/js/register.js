$(() => {
    $('#register').on("submit", e => {
        e.preventDefault();
        const data = $('#register').serializeArray();
        console.table(data);
        const username = data[0].value;
        const email = data[1].value;
        const password = data[2].value;
        const repassword = data[3].value;

        // Vérifications

        // Requête ajax
        $.ajax({
            url: '/auth/login',
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
                console.log("Successfully registered " + username);
            },
            error: (err) => {
                console.error(err);
            }
        })
    })
    $('#passwordretype').on("input", e => {
        // console.log($(e.target).val());
    })
})