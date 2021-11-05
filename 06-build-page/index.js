//Импорт всех требуемых модулей
const fs = require('fs');
// const fsPr = require('fs').promises;
const path = require('path');

//paths
const TEMPLATE_HTML = path.join(__dirname, 'template.html');
const PROJ_DIST_DIR = path.join(__dirname, 'project-dist');
console.log(PROJ_DIST_DIR);
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

  console.log(promises);
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
  console.log('stream data ' + data.toString());
});

const reMustaches = new RegExp('{{([a-zA-Z]+)}}', 'g');

function replacer(match) {
  // console.log('COMPONENTS STRS>>>', componentsStrs);
  // console.log('replacer', match.slice(2, -2),componentsStrs[match] );
  return componentsStrs[match];
}

templateStream.on('end', async function () {
  getTemplates(templateString.match(reMustaches)).then(
    () => {
      
      fs.writeFile(path.join(PROJ_DIST_DIR, 'index-html'), templateString.replace(reMustaches, replacer), function (err) {
        if (err) {
          return console.log(err);
        }
        console.log('The file was saved!');
      });
    }
  ).catch(() => console.log('template error'));
});


//Нахождение всех имён тегов в файле шаблона


//Замена шаблонных тегов содержимым файлов-компонентов
//Запись изменённого шаблона в файл **index.html** в папке **project-dist**
//Использовать скрипт написанный в задании **05-merge-styles** для создания файла **style.css**
//Использовать скрипт из задания **04-copy-directory** для переноса папки **assets** в папку project-dist 