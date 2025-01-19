const fsPromises = require('fs/promises');
const path = require('path');
const secretFolder = path.join(__dirname, 'secret-folder');

async function findFiles() {
  try {
    const files = await fsPromises.readdir(secretFolder, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        let fileExtension = path.extname(file.name);
        const fileName = path.basename(file.name, fileExtension);
        fileExtension = fileExtension.substring(1);
        const stat = await fsPromises.stat(path.join(secretFolder, file.name));
        const fileSize = stat.size;
        console.log(`${fileName}-${fileExtension}-${fileSize}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

findFiles();
