const fsPromises = require('fs/promises');
const path = require('path');

const filesDir = path.join(__dirname, 'files');
const filesCopyDir = path.join(__dirname, 'files-copy');

async function copyDir(fromDir, toDir) {
  try {
    fsPromises.mkdir(toDir, { recursive: true });
    const copyFiles = await fsPromises.readdir(fromDir, {
      withFileTypes: true,
    });
    const existedFiles = await fsPromises.readdir(toDir, {
      withFileTypes: true,
    });
    const existedNames = [];
    const copyNames = [];
    for (const file of copyFiles) {
      copyNames.push(file.name);
    }
    for (const file of existedFiles) {
      if (!copyNames.includes(file.name)) {
        if (file.isFile()) {
          await fsPromises.unlink(path.join(toDir, file.name));
        } else {
          await fsPromises.rm(path.join(toDir, file.name), {
            recursive: true,
          });
        }
      } else existedNames.push(file.name);
    }
    for (const file of copyFiles) {
      if (file.isFile()) {
        if (!existedNames.includes(file.name)) {
          await fsPromises.copyFile(
            path.join(fromDir, file.name),
            path.join(toDir, file.name),
          );
        }
      } else {
        copyDir(path.join(fromDir, file.name), path.join(toDir, file.name));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

copyDir(filesDir, filesCopyDir);
