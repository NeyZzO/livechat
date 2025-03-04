$(() => {
    $("button").on("click", e => {
        const target = $(e.target).data("target");
        const action = $(e.target).data('action');
        if (action == "POST"){
            $.ajax({
                method: "POST",
                url: target,
                success: (data) => {
                    let timer1, timer2
                    $('.toast').addClass('active');
                    timer1 = setTimeout(() => {
                        $('.toast').removeClass("active");
                    }, 5000); //1s = 1000 milliseconds
                
                    timer2 = setTimeout(() => {
                        $('.progress').removeClass("active");
                    }, 5300);
                }
            })
        } else {
            window.location.href = target;
        }
    })
    const toast = document.querySelector(".toast");
    (closeIcon = document.querySelector(".close")),
      (progress = document.querySelector(".progress"));
    
    let timer1, timer2;
    
    // button.addEventListener("click", () => {
    //   toast.classList.add("active");
    //   progress.classList.add("active");
    
    //   timer1 = setTimeout(() => {
    //     toast.classList.remove("active");
    //   }, 5000); //1s = 1000 milliseconds
    
    //   timer2 = setTimeout(() => {
    //     progress.classList.remove("active");
    //   }, 5300);
    // });
    
    closeIcon.addEventListener("click", () => {
      toast.classList.remove("active");
    
      setTimeout(() => {
        progress.classList.remove("active");
      }, 300);
    
      clearTimeout(timer1);
      clearTimeout(timer2);
    });
    
})