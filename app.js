const HummusRecipe = require('hummus-recipe');
const path = require('path');

const pdfDoc = new HummusRecipe('new', 'output.pdf');

pdfDoc
    .createPage('letter-size')
    .text('Add some texts to an existing pdf file', 150, 300)
    // .comment('Add 1st comment annotaion', 200, 300)
    .image(path.join(__dirname,'public','message.jpg'), 300,300, {width: 300, keepAspectRatio: true, align:'center'})
    .endPage()
    // end and save
    .endPDF();