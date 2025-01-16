const fs = require('fs');
const path = require('path');
const readline = require('readline');
const textFile = path.join(__dirname, 'text.txt');
const writerStream = fs.createWriteStream(textFile);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const startWriting = () => {
  rl.write('Type something and press "Enter" after each line:\n');
  rl.addListener('line', writeToFile);
};

const writeToFile = (line) => {
  if (line.trim() === 'exit') {
    finishWriting();
  } else {
    writerStream.write(line + '\n');
  }
};

const finishWriting = () => {
  rl.removeAllListeners('line');
  rl.write('The task is completed. Have a nice day!\n');
  writerStream.close();
  rl.close();
};

writerStream.addListener('open', startWriting);
rl.addListener('SIGINT', finishWriting);
