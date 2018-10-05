var imageUrl;

var listOfImages = [];

function resizeCanvas(canvas, imageName, callback){
    listOfImages.push(imageName);
    var ctx = canvas.getContext("2d");
    var count = 0;
    for(var i=0, l= listOfImages.length; i < l; i++){
        var img = new Image();
        img.onload = function () {
            if(ctx.canvas.width < this.width){
                ctx.canvas.width = this.width;
            }            
            ctx.canvas.height += this.height;
            count++;
            if(count == l){
                callback(listOfImages);
            }
        }
        img.src = "images/" + listOfImages[i];
    }
}

function drawImage(canvas, imageName){
    
    resizeCanvas(canvas, imageName, function(listOfImages){
        var position = {x :0, y: 0};
        var ctx = canvas.getContext("2d");
        for(var i=0, l= listOfImages.length; i < l; i++){
            var img = new Image();
            img.onload = function () {
                ctx.drawImage(this, position.x, position.y, this.width, this.height);
                position.y += this.height;
            }
            img.src = "images/" + listOfImages[i];  
        }
    });
}

$(document).ready(() => {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = 'false';
    
    drawImage(c, "img.png");
    //creating form
    var button = $('<input>').attr({
        class: 'btn btn-primary mb-4',
        id: 'createPdf',
        type: 'submit'
    }).val('Convert To Pdf');

    var hidden_field = $('<input>').attr({
        id: 'imageUrl',
        type: 'hidden',
        name: 'imageUrl'
    });

    var form = $('<form>').attr({
        id: "form_ele",
        action: "/cpdf",
        method: "post"
    }).append(button).append(hidden_field);

    $("#form_cnter").append(form);

});


$("#canvasholder").on("dragover", function(event){
    console.log(event);
    event.preventDefault();
    event.stopPropagation();
    return false;
})


$("#canvasholder").on("drop", function(event){
   
    event.preventDefault();
    event.stopPropagation();

    var data = event.originalEvent.dataTransfer.files;

    console.log(event, data);

    if(data && data.length > 0){
        $.each(data, (i, image)=>{
            var formData = new FormData();
            // Attach file
            formData.append('image', image); 

            $.ajax({
                url: 'upload',
                data: formData,
                type: 'POST',
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS,
                success: function(data){
                    var c = document.getElementById("myCanvas");
                    drawImage(c, data.uploadedFile);
                }
            });
        })
    }

    return false;
})


$(document).on("submit", "#form_ele", (e) => {

    e.preventDefault();
    var can = document.getElementById('myCanvas');
    var ctx = can.getContext('2d');
    imageUrl = can.toDataURL();
    $('.processing_img').show();

    // console.log(imageUrl);
    console.log('=----------END-----------=');
    console.log(imageUrl);
    $("#imageUrl").val(imageUrl);

    var frm = $('#form_ele');

    $.ajax({
        type: frm.attr('method'),
        url: frm.attr('action'),
        data: frm.serialize(),
        success: function (data) {
            $('.processing_img').hide();
            console.log(data);
            var data_response = JSON.parse(data);
            $.AjaxDownloader({
                url  : "http://127.0.0.1:3000/pdf/"+data_response.filePath
            });

        },
        error: function (data) {
            console.log('An error occurred.');
            $('.processing_img').hide();

        },
    });

    // $.AjaxDownloader({
    //     url  : "http://127.0.0.1:3000/cpdf",
    //     data : {"imageUrl":imageUrl},
    // });


    // $.AjaxDownloader({
    //     url  : frm.attr('action'),
    //     data : frm.serialize(),
    //     success : function (response) {
    //         console.log('success');
    //     }
    // });


    // $.ajax({
    //     url: "http://127.0.0.1:3000/cpdf",
    //     type: 'POST',
    //     data: { "imageUrl": imageUrl },
    //     success: function (response) {
    //         $('.processing_img').hide();
    //         console.log('window file download');
    //     }
    // });
});