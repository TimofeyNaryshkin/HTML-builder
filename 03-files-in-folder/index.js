const path = require('path');
const fs = require('fs');
const { stdout } = process;

const files = fs.promises.readdir(path.join(__dirname, 'secret-folder'), {
  withFileTypes: true,
});

files
  .then((files) => {
    for (let file of files) {
      if (file.isFile()) {
        const fileName = file.name.substring(0, file.name.indexOf('.'));
        const filePath = path.join(__dirname, 'secret-folder', file.name);
        const fileExtension = path.extname(filePath);
        const fileExtWODot = fileExtension.substring(1);
        fs.stat(filePath, (error, stats) => {
          console.log(`${fileName} - ${fileExtWODot} - ${stats.size}`);
        });
      }
    }
  })

  .catch((err) => {
    console.log(err);
  });
