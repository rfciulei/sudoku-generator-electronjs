let fs = require("fs");
let PDFDocument = require("pdfkit");
let SVGtoPDF = require("svg-to-pdfkit");
const path = require("path");

let perPage = 2; //or 4

//takes all svgs from puzzles directory and merges into sudoku.pdf
const buildPdf = () => {
  let puzzlesDir = path.join(__dirname, "cpp", "puzzles");
  let doc = new PDFDocument();
  let stream = fs.createWriteStream(path.join(__dirname, "pdfs/sudoku.pdf"));
  const files = fs.readdirSync(puzzlesDir);

  files.forEach((file) => {
    if ((`puzzle(\d+).svg`, file)) {
      filename = path.join(puzzlesDir, file);
      const svg = fs.readFileSync(filename, "utf8");

      //TO-DO 2 or 4 per page functionality
      //write to pdf
      SVGtoPDF(doc, svg, 20, 0);

      if (files.indexOf(file) != files.length - 1) doc.addPage();
    }
  });

  doc.pipe(stream);
  doc.end();
  return doc.path;
};

module.exports = buildPdf;
