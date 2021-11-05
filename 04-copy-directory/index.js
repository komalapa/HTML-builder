// Импорт всех требуемых модулей
const fs = require('fs').promises;
const path = require('path');


// Создание папки files-copy в случае если она ещё не существует
const sourceFolderName = 'files';
const sourceFolderPath =path.join(__dirname, sourceFolderName);

const copyFolderName = sourceFolderName + '-copy';
const copyFolderPath =path.join(__dirname, copyFolderName);

async function copyDir(src, dst){
  console.log(`COPY ${src} TO ${dst}`);

  await fs.rmdir(dst, {recursive: true});
  // Чтение содержимого папки files
  const folderItems = await fs.readdir(src,{withFileTypes: true});
  fs.mkdir(dst,{recursive:true});
  folderItems.forEach(item => {
  // Копирование файлов из папки files в папку files-copy  
    // if dir => copyDir, else => copy this file
    if (item.isDirectory()) {
    //   copyDir(path.join(src, item.name), path.join(dst, item.name));
      console.log('dirs will not copy');
    } else {
      fs.copyFile(path.join(src, item.name), path.join(dst, item.name));
    }
  });
}

copyDir(sourceFolderPath, copyFolderPath);