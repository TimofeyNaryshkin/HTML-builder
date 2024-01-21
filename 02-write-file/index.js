const path = require('path');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);
const { stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Greetings my friend!\n');
rl.on('line', (data) => {
  if (data === 'exit') {
    exitFile();
  } else {
    output.write(data);
  }
});

rl.on('SIGINT', exitFile);

function exitFile() {
  stdout.write('Farewell my friend');
  process.exit();
}
