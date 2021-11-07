//Импорт всех требуемых модулей
const fs = require('fs');
const fsPr = require('fs').promises;
const path = require('path');

//paths
const TEMPLATE_HTML = path.join(__dirname, 'template.html');
const PROJ_DIST_DIR = path.join(__dirname, 'project-dist');
// console.log(PROJ_DIST_DIR);
fs.mkdir(PROJ_DIST_DIR,(err)=>{
  if(err) return err;
});


//Сохранение нужных шаблонов
const componentsStrs = {};
async function getTemplates(components) {
  const promises = [];
  components.forEach(component => {
    const promise = new Promise((resolve, reject) => {
      if (typeof componentsStrs[component] === 'undefined') componentsStrs[component] = '';
      const componentStream = getInput(path.join(__dirname, 'components', `${component.slice(2, -2)}.html`));
      componentStream.on('data', function (data) {
        componentsStrs[component] += data.toString();
      });

      componentStream.on('end', function () {
        resolve(componentsStrs);
      });
      componentStream.on('error', function (err) {
        reject(err);
      });
    });
    promises.push(promise);
  });

  // console.log(promises);
  return Promise.all(promises);
}





//Прочтение и сохранение в переменной файла-шаблона
function getInput(inputFile) {
  if (!inputFile) {
    throw new Error('no file name specified');
  }
  fs.access(inputFile, fs.F_OK, (err) => {
    if (err) {
      throw new Error(`can't read file '${inputFile}'. ERROR: ${err} `);
    }
  });

  let stream = fs.createReadStream(inputFile);
  return stream;
}

let templateString = '';

const templateStream = getInput(TEMPLATE_HTML);
templateStream.on('data', function (data) {
  templateString += data.toString();
  // console.log('stream data ' + data.toString());
});

const reMustaches = new RegExp('{{([a-zA-Z]+)}}', 'g');
//Замена шаблонных тегов содержимым файлов-компонентов
function replacer(match) {
  // console.log('COMPONENTS STRS>>>', componentsStrs);
  // console.log('replacer', match.slice(2, -2),componentsStrs[match] );
  return componentsStrs[match];
}

templateStream.on('end', async function () {
  getTemplates(templateString.match(reMustaches)).then(
    () => {
      //Запись изменённого шаблона в файл **index.html** в папке **project-dist**
      fs.writeFile(path.join(PROJ_DIST_DIR, 'index.html'), templateString.replace(reMustaches, replacer), function (err) {
        if (err) {
          return console.log(err);
        }
        console.log('The file was saved!');
      });
    }
  ).catch(() => console.log('template error'));
});


//Нахождение всех имён тегов в файле шаблона




//Использовать скрипт написанный в задании **05-merge-styles** для создания файла **style.css**
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

folderCompiler(path.join(__dirname, 'styles'), path.join(PROJ_DIST_DIR, 'style.css'));


//Использовать скрипт из задания **04-copy-directory** для переноса папки **assets** в папку project-dist 

async function copyDir(src, dst){
  console.log(`COPY ${src} TO ${dst}`);
  try{
    await fsPr.rmdir(dst, {recursive: true});
  }
  catch{
    console.log('nothing to remove');
  }
  const folderItems = await fsPr.readdir(src,{withFileTypes: true}, (err) => {
    if (err) throw err;
  });
  fsPr.mkdir(dst,{recursive:true});
  folderItems.forEach(item => {
    if (item.isDirectory()) {
      copyDir(path.join(src, item.name), path.join(dst, item.name));
      console.log('dirs will not copy');
    } else {
      fsPr.copyFile(path.join(src, item.name), path.join(dst, item.name));
    }
  });
}

copyDir(path.join(__dirname, 'assets'), path.join(PROJ_DIST_DIR, 'assets'));