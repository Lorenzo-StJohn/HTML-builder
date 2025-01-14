const fs = require('fs');
const path = require('path');
const textFile = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(textFile);

const standardOutputStream = (chunk) => {
  process.stdout.write(chunk.toString() + '\n');
};

const closeReadStream = () => {
  readStream.close();
};

readStream.addListener('data', standardOutputStream);
readStream.addListener('end', closeReadStream);
