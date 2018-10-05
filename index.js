const HummusRecipe = require('hummus-recipe');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
var randomstring = require("randomstring");

app.use(bodyParser.json({ limit: '150mb', extended: true }));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true,
    limit: '150mb'
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(fileUpload());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/pdf/:tagId', (req, res) => {
    res.set('Content-Type', 'application/force-download');
    res.download(path.join(__dirname, "public", "PDF", req.params.tagId + ".pdf"));
});
app.post('/cpdf', (req, res) => {
    const imagePath = req.body.imageUrl;
    // console.log(imagePath);

    var pdfFileName = randomstring.generate(7);

    var pdfPath = path.join(__dirname, "public", "PDF", pdfFileName + ".pdf");

    if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
    }

    // console.log(req.body.imageUrl);

    var b64string = imagePath.replace("data:image/png;base64,", "");
    var buf = Buffer.from(b64string, 'base64');

    fs.writeFileSync(path.join(__dirname, 'public', 'message.jpg'), buf);

    const pdfDoc = new HummusRecipe('new', pdfPath);

    pdfDoc
        .createPage('letter-size')
        .text('Converted Image from Canvas', 'center', 100, {
            color: '066099',
            font: "Helvetica",
            align: "center center",
            bold: true
        })
        .image(path.join(__dirname, 'public', 'message.jpg'), 'center', 200, { width: 600, keepAspectRatio: true, align: 'center' })
        .endPage()
        .endPDF(() => {

            var response_obj = { "filePath": pdfFileName }
            res.send(JSON.stringify(response_obj));
            console.log('END OF SERVER')
        });
});


app.post('/upload', function(req, res) {
    if (!req.files)
      return res.status(400).send('No files were uploaded.');
   
    let image = req.files.image;
    console.log(image); 
    
    image.mv(path.join(__dirname, 'public', 'images', image.name), function(err) {
      if (err)
        return res.status(500).send(err);
   
      res.send({
          uploadedFile: image.name
      });
    });
  });


app.listen(3000, () => {
    console.log('application server started....');
});

