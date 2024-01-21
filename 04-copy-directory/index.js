const path = require('path');
const fs = require('fs');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) throw err;
});

fs.readdir(
  path.join(__dirname, 'files'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;
    for (let file of files) {
      if (file.isFile()) {
        const filePath = path.join(__dirname, 'files', file.name);
        const distPath = path.join(
          __dirname,
          'files-copy',
          `copy-${file.name}`,
        );
        copyFile(filePath, distPath);
      }
    }
  },
);

function copyFile(src, dest) {
  fs.copyFile(src, dest, (err) => {
    if (err) throw err;
  });
}
