const fs = require('fs');
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const bundlePath = path.join(distDir, 'bundle.css');

fs.readdir(stylesDir, (err, files) => {
  if (err) throw err;
  const cssFiles = files.filter(file => path.extname(file) === '.css');
  let bundleContent = '';
  cssFiles.forEach(file => {
    const filePath = path.join(stylesDir, file);
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) throw err;
      bundleContent += data;
      if (cssFiles.indexOf(file) === cssFiles.length - 1) {
        fs.writeFile(bundlePath, bundleContent, err => {
          if (err) throw err;
        });
      }
    });
  });
});