var imageUrl;
$(document).ready(() => {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = 'false';
    var img = new Image();

    img.onload = function () {
        var width_img = this.width;
        var height_img = this.height;
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;
        ctx.drawImage(img, 0, 0, width_img, height_img);
        c.style.overflow = "scroll";
    }
    img.src = "images/test.jpg";

});

$('#createPdf').on('click', (eve) => {

    var can = document.getElementById('myCanvas');
    var ctx = can.getContext('2d');
    imageUrl = can.toDataURL();

    console.log(imageUrl);
    console.log('=----------END-----------=');

    
    $.AjaxDownloader({
        url  : "http://127.0.0.1:3000/cpdf",
        data : {"imageUrl":imageUrl}
    });
});