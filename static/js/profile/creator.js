$(async () => {
    $('#randomizepic').on('click', async e => {
        const newpic = await fetch('http://localhost:3000/profile/picture/random')
        $('#ppicpreview').attr('src', await newpic.json());
    })
    $('#ppicpreview').on('click', async e => {
        $('#ppicinpt').click();
    })
    function previewProfileImage( uploader ) {   
        //ensure a file was selected 
        if (uploader.files && uploader.files[0]) {
            var imageFile = uploader.files[0];
            var reader = new FileReader();    
            reader.onload = function (e) {
                //set the image data as source
                $('#ppicpreview').attr('src', e.target.result);
            }    
            reader.readAsDataURL( imageFile );
        }
    }
    
    $("#ppicinpt").on("change", function(e){
        previewProfileImage( this );
        const test = $('form').serializeArray();
        console.log(test);
    });
    
})