const fs = require('fs');
const fsPr = require('fs/promises');
const path = require('path');



const styleDirName = 'styles';
const distFolder = 'project-dist';
const distName = 'bundle.css';

const stylePath = path.join(__dirname, styleDirName);
const distPath = path.join(__dirname, distFolder, distName);

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

function writeOutput (outputFile){
  if (!outputFile) {
    throw new Error ('no file name specified');
  } 
  let stream = fs.createWriteStream(outputFile,  {flags: 'a'}); //append mode
  return stream;
}

async function copyFileText(src, dst){
  await getInput(src).pipe(writeOutput(dst));
  return true;
}

async function folderCompiler(folder, file){
  console.log(`Files in folder ${folder}\n`);

  await fs.writeFile(file, '', function(){console.log('done');});
  const folderItems = await fsPr.readdir(folder,{withFileTypes: true});
  // Получение данных о каждом объекте который содержит папка secret-folder
  folderItems.forEach(item => {
    // Проверка объекта на то, что он является файлом
    if (!item.isDirectory() && item.name.split('.')[item.name.split('.').length-1].toLowerCase() === 'css') {
      copyFileText(path.join(folder, item.name), file);
      console.log(path.join(folder, item.name));
    }
  });
  
}

folderCompiler(stylePath, distPath);