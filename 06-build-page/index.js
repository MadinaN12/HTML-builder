const fs = require('fs');
const path = require('path');

const newFolder = path.join(__dirname, 'project-dist');
const tempFile = path.join(__dirname, './template.html');
const htmlFile = path.join(newFolder, './index.html');
const compFolder = path.join(__dirname, 'components');
const cssFile = path.join(newFolder, './style.css');
const stylesFolder = path.join(__dirname, 'styles');
const assetsOldFolder = path.join(__dirname, 'assets');
const assetsNewFolder = path.join(newFolder, 'assets');


async function createHTML() {
    await fs.promises.mkdir(newFolder, { recursive: true });

    await fs.promises.copyFile(tempFile, htmlFile);

    let htmlFiles = await fs.promises.readdir(compFolder, {withFileTypes: true});

    for (let file of htmlFiles) {
        let fileExtension = path.extname(file.name);
        let fileName = path.basename(file.name, fileExtension);

        if (file.isFile() && fileExtension === '.html') {
            let compHtml = path.join(compFolder, './', file.name);
            let dataCompHtml = await fs.promises.readFile(compHtml, 'utf-8');
            let tag = `{{${fileName}}}`;
            let newData = await fs.promises.readFile(htmlFile, 'utf-8');

            await fs.promises.writeFile(htmlFile, newData.replace(tag, dataCompHtml));
        }
    }
}


async function createCSS() {
    let streamWrite = fs.createWriteStream(cssFile);

    fs.readdir(stylesFolder, {withFileTypes: true}, (err, files) => {
        files.forEach(file => {    
            fs.stat(path.join(stylesFolder, file.name), (err, elem) => {
                if (!elem.isFile()) return;
            
                let fileExtension = path.extname(file.name);
                if (fileExtension === '.css') {
                    var stream = new fs.ReadStream(path.join(stylesFolder, './', file.name), 'utf-8');
    
                    stream.on('data', function(chunk){
                        streamWrite.write(chunk + '\r\n');
                    });
                }
                
            });   
        });
    });  
}

async function clearFolder(assetsNewFolder) {
    let files = await fs.promises.readdir(assetsNewFolder, {withFileTypes: true});

    for (let file of files) {
        let filePath = path.join(assetsNewFolder, file.name);
        if (!file.isFile()) {
            clearFolder(filePath);
        } else {
            await fs.promises.unlink(filePath);
        }
    }
}

async function copyDir(assetsOldFolder, assetsNewFolder) {
    await fs.promises.mkdir(assetsNewFolder, { recursive: true });

    let inner = await fs.promises.readdir(assetsNewFolder, {withFileTypes: true});
    for (let file of inner) {
        let filePath = path.join(assetsNewFolder, file.name);

        await clearFolder(filePath);
        await fs.promises.rmdir(filePath);
    }

    let files = await fs.promises.readdir(assetsOldFolder, {withFileTypes: true});

    for (let file of files) {
        let oldFiles = path.join(assetsOldFolder, file.name);
        let newFiles = path.join(assetsNewFolder, file.name);
        
        if (file.isFile()) {
            await fs.promises.copyFile(oldFiles, newFiles);
        } else {
            copyDir(oldFiles, newFiles);
        }
        
    }
}

async function build() {
    await createHTML();
    await createCSS();
    await copyDir(assetsOldFolder, assetsNewFolder);
}

build ();