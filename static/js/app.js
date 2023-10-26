$(() => {
    const socket = io();
    time = 30 * 100;
    running = false;
    const secs = $('#secs');
    const mins = $('#mins');
    function refresh(){
        let ss = Math.floor(time/100%60);
        let mn = Math.floor(time/6000);
        secs.text(ss);
        mins.text(mn);
    }
    function startTimer() {
        time += 100;
        setTimeout(updateTimer, 10)
    }
    function updateTimer(){
        if (running == false) return;
        time --;
        if(time == 0) return timerEnd();
        refresh();
        setTimeout(updateTimer, 10)
    }
    function timerEnd(){
        refresh()
        console.log("The time has run out, to restart please change `time` variable and run the `refresh` funcion");
    }
    refresh();
    if (running == true){
        startTimer();
    }

    $("#start").click(e => {
        if(running == true) return;
        running = true;
        startTimer();
    }) 
    $("#pause").click(() => {running = false})
})

