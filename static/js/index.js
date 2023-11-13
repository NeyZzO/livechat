$(() => {
    const socket = io();
    $('#sendMessages').on('submit', (e) => {
        e.preventDefault();
        console.log($('#msg-input').val())

        const message = $('#msg-input').val();

        if (message == "") return;
        socket.emit('message', message);
        $("input").val('');
        $('input').focusout();
    })
})

