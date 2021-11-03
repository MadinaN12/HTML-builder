const fs = require('fs');
const path = require('path');
const process = require('process');

let stream = fs.createWriteStream(path.join(__dirname, 'newFile.txt'));

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log('Write something:');
    
readline.on(`line`, (input) => {
  if (input.includes('exit')) {
    readline.close();
  } else {
    stream.write(input);
    stream.write('\n');
  }
});
    
process.on('exit', () => {
    readline.close();
    console.log(`Bye bye!!!`);  
});