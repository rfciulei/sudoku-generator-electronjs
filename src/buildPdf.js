let fs = require("fs");
let PDFDocument = require("pdfkit");
let SVGtoPDF = require("svg-to-pdfkit");
const { scale } = require("scale-that-svg");
const path = require("path");

//takes all svgs from puzzles directory and merges into sudoku.pdf
const buildPdf = (perPage) => {
  console.log(perPage);
  let puzzlesDir = path.join(__dirname, "cpp", "puzzles");
  let pdfsDir = path.join(__dirname, "pdfs");

  if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir);
  }

  const files = fs.readdirSync(puzzlesDir);
  let doc = new PDFDocument();
  let stream = fs.createWriteStream(path.join(__dirname, "pdfs/sudoku.pdf"));

  files.forEach((file) => {
    filename = path.join(puzzlesDir, file);
    const svg = fs.readFileSync(filename, "utf8");

    if (perPage == 1) {
      if ((`puzzle(\d+).svg`, file)) {
        SVGtoPDF(doc, svg, 57.5, 146.6);

        if (files.indexOf(file) != files.length - 1) doc.addPage();
      }
    } else if (perPage == 4) {
      if ((`puzzle(\d+).svg`, file)) {
        if ((files.indexOf(file) + 1) % 4 == 0) {
          SVGtoPDF(doc, svg, 325, 121);
          // console.log("up-left");
        }
        if ((files.indexOf(file) + 1) % 4 == 1) {
          SVGtoPDF(doc, svg, 25, 121);
          // console.log("up-right");
        }
        if ((files.indexOf(file) + 1) % 4 == 2) {
          SVGtoPDF(doc, svg, 25, 121 + 300);
          // console.log("down-left");
        }
        if ((files.indexOf(file) + 1) % 4 == 3) {
          SVGtoPDF(doc, svg, 325, 121 + 300);
          // console.log("down-right");
        }

        if (
          files.indexOf(file) != files.length - 1 &&
          (files.indexOf(file) + 1) % 4 == 0
        )
          doc.addPage();
      }
    }
  });

  doc.pipe(stream);
  doc.end();
  return doc.path;
};

module.exports = buildPdf;
