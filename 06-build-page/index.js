const fsPromises = require('fs/promises');
const path = require('path');
const projectDistFolder = path.join(__dirname, 'project-dist');
const templateHTML = path.join(__dirname, 'template.html');

async function build(projectDist, templateFile) {
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
    console.log(resultHTML);
  } catch (err) {
    console.error(err);
  }
}

build(projectDistFolder, templateHTML);
