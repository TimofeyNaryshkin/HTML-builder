const fs = require('node:fs');
const path = require('node:path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  {
    withFileTypes: true,
  },
  (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (file.isFile()) {
        const name = file.name.slice(0, file.name.lastIndexOf('.'));
        const ext = path.extname(file.name).replace('.', '');
        fs.stat(
          path.join(__dirname, 'secret-folder', file.name),
          (err, stats) => {
            console.log(`${name} - ${ext} - ${stats.size}b`);
          },
        );
      }
    });
  },
);
