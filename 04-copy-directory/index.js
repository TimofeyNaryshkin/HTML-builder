const path = require('path');
const fs = require('fs');

const copyDirPath = path.join(__dirname, 'files-copy');

fs.mkdir(copyDirPath, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.readdir(copyDirPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  for (let file of files) {
    fs.unlink(path.join(__dirname, 'files-copy', file.name), (err) => {
      if (err) throw err;
    });
  }
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
