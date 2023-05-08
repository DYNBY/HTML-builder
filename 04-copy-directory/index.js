
const fs = require('fs');
const path = require('path');
const sourceDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

fs.mkdir(destDir, (err) => {
  if (err && err.code !== 'EEXIST') {
    throw err;
  }

  fs.readdir(sourceDir, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const sourceFile = path.join(sourceDir, file);
      const destFile = path.join(destDir, file);
      fs.copyFile(sourceFile, destFile, (err) => {
        if (err) throw err;
      });
    });
  });

  fs.watch(sourceDir, { persistent: false }, (eventType, fileName) => {
    const sourceFile = path.join(sourceDir, fileName);
    const destFile = path.join(destDir, fileName);
    if (eventType === 'rename') {
      fs.stat(sourceFile, (err, stats) => {
        if (err) {
          fs.unlink(destFile, (err) => {
            if (err && err.code !== 'ENOENT') {
              throw err;
            }
          });
        } else {
          fs.copyFile(sourceFile, destFile, (err) => {
            if (err) throw err;
          });
        }
      });
    } else if (eventType === 'change') {
      fs.copyFile(sourceFile, destFile, (err) => {
        if (err) throw err;
      });
    }
  });
});