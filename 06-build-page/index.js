const fs = require('fs');
const path = require('path');
const templatePath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const distDir = path.join(__dirname, 'project-dist');

fs.mkdir(distDir, { recursive: true }, err => {
  if (err) throw err;
  fs.readFile(templatePath, 'utf8', (err, templateContent) => {
    if (err) throw err;
    const tags = templateContent.match(/{{\w+}}/g);
    tags.forEach(tag => {
      const componentName = tag.slice(2, -2);
      const componentPath = path.join(componentsDir, componentName + '.html');
      fs.readFile(componentPath, 'utf8', (err, componentContent) => {
        if (err) throw err;
        templateContent = templateContent.replace(tag, componentContent);
        if (tags.indexOf(tag) === tags.length - 1) {
          const indexPath = path.join(distDir, 'index.html');
          fs.writeFile(indexPath, templateContent, err => {
            if (err) throw err;
          });
        }
      });
    });
  });
});

const cssFiles = [];
fs.readdir(stylesDir, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if (path.extname(file) === '.css') {
      const filePath = path.join(stylesDir, file);
      cssFiles.push(filePath);
    }
  });
  let cssContent = '';
  cssFiles.forEach(file => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) throw err;
      cssContent += data;
      if (cssFiles.indexOf(file) === cssFiles.length - 1) {
        const cssPath = path.join(distDir, 'style.css');
        fs.writeFile(cssPath, cssContent, err => {
          if (err) throw err;
        });
      }
    });
  });
});

const assetsPath = path.join(distDir, 'assets');
fs.mkdir(assetsPath, { recursive: true }, err => {
  if (err) throw err;
  fs.readdir(assetsDir, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      const scrPath = path.join(assetsDir, file);
      const destPath = path.join(assetsPath, file);
      fs.stat(scrPath, (err, stats) => {
        if (err) throw err;
        if (stats.isFile() && path.extname(file) !== '.html') {
          const readStream = fs.createReadStream(scrPath);
          const writeStream = fs.createWriteStream(destPath);
          readStream.on('error', err => {
            throw err;
          });
          writeStream.on('error', err => {
            throw err;
          });
          readStream.pipe(writeStream);
        }
      });
    });
  });
});

async function copyDirectory() {
  try {
    const assetsPath = path.join(distDir, 'assets');
    await fs.promises.mkdir(assetsPath, { recursive: true });
    
    fs.rm(assetsPath, { recursive: true }, async () => {
      const entries = await fs.promises.readdir(assetsDir, { withFileTypes: true });
      for (const entry of entries) {
        const sourcePath = path.join(assetsDir, entry.name);
        const destPath = path.join(assetsPath, entry.name);

        if (entry.isDirectory()) {
          await copyDirectoryRecursive(assetsDir, assetsPath);
        } else {
          await fs.promises.copyFile(assetsDir, assetsPath);
        }
      }
    });
  } catch (err) {
  }
}
async function copyDirectoryRecursive(sourcePath, destPath) {
  try {
    await fs.promises.mkdir(destPath, { recursive: true });
    const entries = await fs.promises.readdir(sourcePath, { withFileTypes: true });
    for (const entry of entries) {
      const sourceEntryPath = path.join(sourcePath, entry.name);
      const destEntryPath = path.join(destPath, entry.name);

      if (entry.isDirectory()) {
        await copyDirectoryRecursive(sourceEntryPath, destEntryPath);
      } else {
        await fs.promises.copyFile(sourceEntryPath, destEntryPath);
      }
    }
  } catch (err) {
  }
}
(async () => {
  await copyDirectory();
})();

