const fsPromises = require('fs/promises');
const path = require('path');
const projectDistFolder = path.join(__dirname, 'project-dist');

async function build(projectDist) {
  await fsPromises.mkdir(projectDist, { recursive: true });
}

build(projectDistFolder);
