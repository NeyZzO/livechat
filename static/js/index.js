// import { Socket } from "socket.io";

$(async () => {

    

    const socket = await io();
    socket.on('connect', () => {
        console.log('Connected to socket');
        
    });
    let a = 0;
    scrollBtm();
    loadMessages();
    const submitmsg = (e) => {
        e.preventDefault();
        console.log($("#msg-input").val());

        const message = $("#msg-input").val();

        if (message == "") return;
        socket.emit("message", message);
        $("input").val("");
        $("input").focusout();
        scrollBtm();
    };
    $("#sendMessages").on("submit", submitmsg);
    $("#sendMsgBtn").on("click", submitmsg);

    socket.on("message", (message) => {
        appendMessage(message);
    });

    function appendMessage(msg) {
        const testA = (msg.self == true);
        const testB = (socket.id == msg.sid) && socket.connected;
        $("#messages").append(`
        <div class="message ${(testA || testB)?"self":""}">
            <div class="sender">${msg.user.username} ${
            msg.user.crt
                ? '<i class="bi bi-patch-check-fill" style="color: #009579; font-size: .8rem" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="Certified"></i>'
                : ""
        } ${
            msg.user.rk == 2
                ? '<i class="bi bi-shield-fill-check" style="color: #950000" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="Administrator"></i>'
                : msg.user.rk == 1
                ? '<i class="bi bi-shield-fill-check" style="color: #004a95" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="Moderator"></i>'
                : ""
        }</div>
            <div class="content">${msg.content}</div>
            <div class="details">${formatDate(msg.date)}</div>
        </div>
        `);
        scrollBtm();
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    }

    function scrollBtm() {
        const msgs = document.getElementById("messages");
        msgs.scrollTo(0, msgs.scrollHeight);
    }

    function loadMessages() {
        $.ajax({
            url: "/messages/conv/1",
            method: "POST",
            dataType: "json",
            success: (res) => {
                res.forEach(msg => appendMessage(msg))
            },
        });
    }

    function formatDate(date) {
        // console.log(new Date(date))
        date = new Date(date);
        const now = new Date();
        const diff = now - date;

        // Fonction pour ajouter un zéro devant un chiffre si < 10
        const addZero = (num) => (num < 10 ? `0${num}` : num);

        // Différence en minutes
        const minutes = Math.floor(diff / (60 * 1000));

        // Différence en heures
        const hours = Math.floor(diff / (60 * 60 * 1000));

        // Différence en jours
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));

        // Différence en semaines
        const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));

        // Différence en années
        const years = now.getFullYear() - date.getFullYear();

        if (minutes < 1) {
            return "now";
        } else if (hours < 1) {
            return `${minutes} min`;
        } else if (days < 1 && now.getDate() === date.getDate()) {
            return `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
        } else if (days === 1) {
            return "yesterday";
        } else if (weeks === 0 && now.getDay() !== date.getDay()) {
            const daysOfWeek = [
                "Dimanche",
                "Lunid",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi",
            ];
            return daysOfWeek[date.getDay()];
        } else if (years === 0) {
            return `${addZero(date.getDate())}/${addZero(
                date.getMonth() + 1
            )} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
        } else {
            return `${addZero(date.getDate())}/${addZero(
                date.getMonth() + 1
            )}/${date.getFullYear().toString().slice(2, 4)}`;
        }
    }

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
});
