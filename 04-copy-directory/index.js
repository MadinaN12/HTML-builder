const fs = require('fs');
const path = require('path');

async function copyDir() {
    const newFolder = path.join(__dirname, 'files-copy');
    const oldFolder = path.join(__dirname, 'files');

    await fs.promises.mkdir(newFolder, { recursive: true });

    let filesDel = await fs.promises.readdir(newFolder, {withFileTypes: true});

    for (let file of filesDel) {
        let filePath = path.join(newFolder, file.name);
        
        await fs.promises.unlink(filePath);
    }

    let files = await fs.promises.readdir(oldFolder, {withFileTypes: true});

    for (let file of files) {
        let oldFiles = path.join(oldFolder, file.name);
        let newFiles = path.join(newFolder, file.name);
        
        await fs.promises.copyFile(oldFiles, newFiles);
    }
}

copyDir();