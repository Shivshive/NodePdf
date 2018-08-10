const HummusRecipe = require('hummus-recipe');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.json({ limit: '150mb', extended: true }));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true,
    limit: '150mb'
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/cpdf', (req, res) => {
    const imagePath = req.body.imageUrl;
    console.log(imagePath);

    if (fs.existsSync(path.join(__dirname, 'output.pdf'))) {
        fs.unlinkSync(path.join(__dirname, 'output.pdf'));
    }

    var b64string = imagePath.replace("data:image/png;base64,", "");
    var buf = Buffer.from(b64string, 'base64');

    fs.writeFileSync(path.join(__dirname, 'public', 'message.jpg'), buf);

    const pdfDoc = new HummusRecipe('new', 'output.pdf');

    pdfDoc
        .createPage('letter-size')
        .image(path.join(__dirname, 'public', 'message.jpg'), 300, 300, { width: 300, keepAspectRatio: true, align: 'center' })
        .endPage()
        .endPDF(()=>{
            res.sendFile(path.join(__dirname,'output.pdf'));
        });
});

app.listen(3000, () => {
    console.log('application server started....');
});

