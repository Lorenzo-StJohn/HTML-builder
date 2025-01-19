const fsPromises = require('fs/promises');
const path = require('path');

const styles = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundle(from, toFile) {
  try {
    const stylesFiles = await fsPromises.readdir(from, {
      withFileTypes: true,
    });
    const arrData = [];
    for (const file of stylesFiles) {
      if (file.isFile()) {
        let fileExtension = path.extname(file.name);
        fileExtension = fileExtension.substring(1).toLowerCase();
        if (fileExtension === 'css') {
          const style = await fsPromises.readFile(path.join(from, file.name));
          arrData.push(style + '\n');
        }
      }
    }
    await fsPromises.writeFile(toFile, arrData.join(''));
  } catch (err) {
    console.error(err);
  }
}

bundle(styles, bundleFile);
