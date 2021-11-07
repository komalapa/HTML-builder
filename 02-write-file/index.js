//Импорт всех требуемых модулей.
const fs = require('fs');
const path = require('path');

const testFileName = 'text.txt';
const testFilePath =path.join(__dirname, testFileName);


// Создание потока записи в текстовый файл

function writeOutput (outputFile){
  if (!outputFile) {
    throw new Error ('no file name specified');
  } 
  let stream = fs.createWriteStream(outputFile,  {flags: 'a'}); //append mode
  return stream;
}

// Вывод в консоль приветственного сообщения
console.log(`All your input will be saved in file: ${testFilePath} \n Enter 'exit' to stop`);
fs.writeFile(testFilePath, '', function(){console.log(`File ${testFilePath} created`);});

// Ожидание ввода текста пользователем, с дальнейшей проверкой ввода на наличие ключевого слова exit

function getInput (){
  let stream = process.stdin;
  return stream;    
}

// Запись текста в файл
// Ожидание дальнейшего ввода
getInput().pipe(writeOutput(testFilePath));

// Реализация прощального сообщения при остановке процесса
process.on('exit', function (){
  console.log(`You stopped writing to the file ${testFilePath}. \n Goodbye!`);
});
//ctrl+c event => process.exit()
process.on('SIGINT', process.exit);
//catch "exit" on stdin
process.stdin.addListener('data', function(data) {
  if (data.toString().trim().toLowerCase() == 'exit') process.exit();
});