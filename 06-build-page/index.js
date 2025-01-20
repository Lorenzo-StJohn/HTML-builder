const fsPromises = require('fs/promises');
const path = require('path');
const projectDistFolder = path.join(__dirname, 'project-dist');
const templateHTML = path.join(__dirname, 'template.html');

const styles = path.join(__dirname, 'styles');
const styleCSS = path.join(__dirname, 'project-dist', 'style.css');

const assetsDir = path.join(__dirname, 'assets');
const newAssetsDir = path.join(__dirname, 'project-dist', 'assets');

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

async function build(
  projectDist,
  templateFile,
  stylesFolder,
  styleFile,
  assetsFrom,
  assetsTo,
) {
  try {
    await fsPromises.mkdir(projectDist, { recursive: true });
    const readTemplate = await fsPromises.readFile(templateFile);
    const template = readTemplate.toString();
    let start;
    let resultHTML = '';
    let last = -2;
    for (let i = 1; i < template.length - 1; i += 1) {
      if (template[i] === '{' && template[i - 1] === '{') start = i;
      if (template[i] === '}' && template[i + 1] === '}' && start !== -1) {
        resultHTML += template.substring(last + 2, start - 1);
        last = i;
        const nameComponent = template.substring(start + 1, last) + '.html';
        const component = path.join(__dirname, 'components', nameComponent);
        const data = await fsPromises.readFile(component);
        resultHTML += data.toString();
        resultHTML += '\n';
        start = -1;
      }
    }
    resultHTML += template.substring(last + 2);
    const indexHTML = path.join(projectDist, 'index.html');
    await fsPromises.writeFile(indexHTML, resultHTML);

    const stylesFiles = await fsPromises.readdir(stylesFolder, {
      withFileTypes: true,
    });
    const arrData = [];
    for (const file of stylesFiles) {
      if (file.isFile()) {
        let fileExtension = path.extname(file.name);
        fileExtension = fileExtension.substring(1).toLowerCase();
        if (fileExtension === 'css') {
          const style = await fsPromises.readFile(
            path.join(stylesFolder, file.name),
          );
          arrData.push(style.toString() + '\n');
        }
      }
    }
    await fsPromises.writeFile(styleFile, arrData.join(''));
    await copyDir(assetsFrom, assetsTo);
  } catch (err) {
    console.error(err);
  }
}

build(
  projectDistFolder,
  templateHTML,
  styles,
  styleCSS,
  assetsDir,
  newAssetsDir,
);
