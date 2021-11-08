const fs = require('fs');
const path = require('path');

let streamWrite = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

const folder = path.join(__dirname, 'styles');

fs.readdir(folder, {withFileTypes: true}, (err, files) => {
    files.forEach(file => {    
        fs.stat(path.join(folder, file.name), (err, elem) => {
            if (!elem.isFile()) return;
           
            let fileExtension = path.extname(file.name);
            if (fileExtension === '.css') {
                var stream = new fs.ReadStream(path.join(folder, './', file.name), 'utf-8');
 
                stream.on('data', function(chunk){
                    streamWrite.write(chunk + '\r\n');
                });
            }
            
        });   
    });
});  