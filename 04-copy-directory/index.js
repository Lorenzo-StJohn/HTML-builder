const fsPromises = require('fs/promises');
const path = require('path');

const filesDir = path.join(__dirname, 'files');
const filesCopyDir = path.join(__dirname, 'files-copy');

async function copyDir(fromDir, toDir) {
  try {
    await fsPromises.rm(toDir, {
      recursive: true,
      force: true,
    });
    await fsPromises.mkdir(toDir, { recursive: true });
    const copyFiles = await fsPromises.readdir(fromDir, {
      withFileTypes: true,
    });
    for (const file of copyFiles) {
      if (file.isFile()) {
        await fsPromises.copyFile(
          path.join(fromDir, file.name),
          path.join(toDir, file.name),
        );
      } else {
        await copyDir(
          path.join(fromDir, file.name),
          path.join(toDir, file.name),
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}

copyDir(filesDir, filesCopyDir);
