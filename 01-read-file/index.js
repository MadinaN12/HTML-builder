const fs = require('fs');
const path = require('path');
 
var stream = new fs.ReadStream(path.join(__dirname, './text.txt'), 'utf-8');
 
stream.on('data', function(chunk){
    console.log(chunk);
});