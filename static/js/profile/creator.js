$(async () => {
    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block', 'image', 'link'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
      
        ['clean']                                         // remove formatting button
      ];
    const quill = new Quill('#quill', {
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: 'Compose an epic...',
        theme: 'snow'  // or 'bubble'
      });

    $('#randomizepic').on('click', async e => {
        const newpic = await fetch('http://localhost:3000/profile/picture/random')
        $('#ppicpreview').attr('src', await newpic.json());
        resetImage();
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

    function resetImage(){
        const test = document.getElementById('ppicinpt');
        const temp = document.createElement('input');
        temp.type = "file";
        test.files = temp.files;
        temp.remove();
    }
    
    $("#ppicinpt").on("change", function(e){
        previewProfileImage( this );
        const test = $('form').serializeArray();
        console.log(test);
    });
    
    resetImage();

    $('#profileCreator').on('submit', e => {
        e.preventDefault();
        fDataJq = $('#profileCreator').serializeArray();
        console.log(fDataJq);
        fData = new FormData(e.target);
        console.log(fData);
        if(fData.get("profilePicture").size == 0){
            fData.set('profilePicture', $('#ppicpreview').attr('src'))
        }
        $.ajax({
            url: 'http://localhost:3000/profile/create',
            type: 'POST',
            data: fData,
            success: function (data) {
                alert(data)
            },
            cache: false,
            contentType: false,
            processData: false
        });
    })
})