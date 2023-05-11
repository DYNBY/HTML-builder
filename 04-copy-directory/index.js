const fs = require('fs');
const path = require('path');
const sourceDirPath = path.join(__dirname, 'files');
const destDirPath = path.join(__dirname, 'files-copy');

async function copyDirectory() {
  try {
    await fs.promises.mkdir(destDirPath, { recursive: true });
    fs.readdir(destDirPath, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }
      files.forEach((file) => {
        const filePath = path.join(destDirPath, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
    });
    const entries = await fs.promises.readdir(sourceDirPath, { withFileTypes: true });
    for (const entry of entries) {
      const sourcePath = path.join(sourceDirPath, entry.name);
      const destPath = path.join(destDirPath, entry.name);

      if (entry.isDirectory()) {
        await copyDirectoryRecursive(sourcePath, destPath);
      } else {
        await fs.promises.copyFile(sourcePath, destPath);
      }
    }
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
