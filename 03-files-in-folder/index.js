const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');
fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files.forEach((file) => {
    if (file.isFile()) {
      const fileName = file.name; 
      const fileExt = path.extname(fileName);
      const fileExtNoDot = fileExt.replace('.','');
      const fileBase = path.basename(fileName, fileExt);
      const filePath = path.join(folderPath, fileName);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        const fileSize = (stats.size)/1024;
        console.log(`${fileBase} - ${fileExtNoDot} - ${fileSize}kb`);
      });
    }
  });
});
