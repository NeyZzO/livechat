$(() => {
    const socket = io();
    scrollBtm()
    $('#sendMessages').on('submit', (e) => {
        e.preventDefault();
        console.log($('#msg-input').val())

        const message = $('#msg-input').val();

        if (message == "") return;
        socket.emit('message', message);
        $("input").val('');
        $('input').focusout();
        $('#messages').append(`
        <div class="message self">
            <div class="sender">John Doe</div>
            <div class="content">${message}</div>
            <div class="details">now</div>
        </div>
        `)
        scrollBtm();
    })

    function scrollBtm() {
        const msgs = document.getElementById('messages');
        msgs.scrollTo(0, msgs.scrollHeight)
    }
})

