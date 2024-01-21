const path = require('path');
const fs = require('fs');
const { stdout, exit } = process;
const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'));
readableStream.on('data', (chunk) => {
  stdout.write(chunk);
  exit();
});
