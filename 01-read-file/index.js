const fs = require('fs');
const path = require('path');


const testFileName = 'text.txt';
const testFilePath =path.join(__dirname, testFileName);

function getInput (inputFile){
  if (!inputFile) {
    throw new Error ('no file name specified');
  }
  fs.access(inputFile, fs.F_OK, (err) => {
    if (err) {
      throw new Error(`can't read file '${inputFile}'. ERROR: ${err} `);
    }
  });

  let stream = fs.createReadStream(inputFile);
  return stream;
}

const fileStream = getInput(testFilePath);

if (fileStream) fileStream.pipe(process.stdout);