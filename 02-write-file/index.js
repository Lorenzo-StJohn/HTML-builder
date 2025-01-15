const fs = require('fs');
const path = require('path');
const textFile = path.join(__dirname, 'text.txt');
const file = fs.createWriteStream(textFile);

const standardOutputStream = () => {
  process.stdout.write('Type something here:\n');
};

file.addListener('open', standardOutputStream);
