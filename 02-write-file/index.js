const fs = require('node:fs');
const path = require('node:path');
const { stdin, stdout } = require('node:process');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hey, type smth\n');
stdin.on('data', (chunk) => {
  if (chunk.toString().trim() === 'exit') {
    process.exit();
  } else {
    output.write(chunk);
  }
});
process.on('exit', () => stdout.write('Thank you!\n'));
process.on('SIGINT', () => {
  process.exit();
});
