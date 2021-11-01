

// Импорт всех требуемых модулей
const fs = require('fs/promises');
const path = require('path');

// Чтение содержимого папки secret-folder
const testFolderName = 'secret-folder';
const testFolderPath =path.join(__dirname, testFolderName);

async function folderReader(folder){
  console.log(`Files in folder ${folder}\n`);
  
  const folderItems = await fs.readdir(folder,{withFileTypes: true});
  // Получение данных о каждом объекте который содержит папка secret-folder
  folderItems.forEach(item => {
    // Проверка объекта на то, что он является файлом
    if (!item.isDirectory()) {
      fs.stat(path.join(testFolderPath, item.name)).then(stats => {
        //b to kb (1024)
        const prettySize = (Math.floor(stats.size/1024)) +'.' + stats.size%1024+'kb' 
        // Вывод данных о файле в консоль
        console.log(item.name.split('.').join(' - ') + ' - ' + prettySize);
      });
    }
  });

}

folderReader(testFolderPath);



