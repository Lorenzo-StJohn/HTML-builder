const fsPromises = require('fs/promises');
const path = require('path');
const projectDistFolder = path.join(__dirname, 'project-dist');
const templateHTML = path.join(__dirname, 'template.html');

const styles = path.join(__dirname, 'styles');
const styleCSS = path.join(__dirname, 'project-dist', 'style.css');

async function build(projectDist, templateFile, stylesFolder, styleFile) {
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
        resultHTML += data;
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
          arrData.push(style + '\n');
        }
      }
    }
    await fsPromises.writeFile(styleFile, arrData.join(''));
  } catch (err) {
    console.error(err);
  }
}

build(projectDistFolder, templateHTML, styles, styleCSS);
