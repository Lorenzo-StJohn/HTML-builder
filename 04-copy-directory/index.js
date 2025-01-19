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
    for (const file of copyFiles) {
      console.log(file);
      const stat = await fsPromises.stat(path.join(fromDir, file.name));
      console.log(stat.ctime);
    }
    const existedFiles = await fsPromises.readdir(toDir, {
      withFileTypes: true,
    });
    for (const file of existedFiles) {
      console.log(file);
      const stat = await fsPromises.stat(path.join(toDir, file.name));
      console.log(stat.ctime);
    }
  } catch (err) {
    console.error(err);
  }
}

copyDir(filesDir, filesCopyDir);
