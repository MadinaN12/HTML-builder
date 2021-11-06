const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'secret-folder');


fs.readdir(folder, {withFileTypes: true}, (err, files) => {
    files.forEach(file => {    
        fs.stat(path.join(folder, file.name), (err, elem) => {
            if (!elem.isFile()) return;
           
            let fileExtension = path.extname(file.name);
            let fileName = path.basename(file.name, fileExtension);
            let fileSize = elem.size / 1024;

            console.log(`${fileName} - ${fileExtension.substring(1)} - ${fileSize}kb`);
        });   
    });
});    