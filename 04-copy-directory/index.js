const fs = require('node:fs');
const path = require('node:path');

function copyDir() {
  const srcDir = path.join(__dirname, 'files');
  const distDir = path.join(__dirname, 'files-copy');

  fs.rm(distDir, { recursive: true, force: true }, (err) => {
    if (err) throw err;
    fs.mkdir(
      distDir,
      {
        recursive: true,
      },
      (err) => {
        if (err) throw err;
        fs.readdir(srcDir, { withFileTypes: true }, (err, files) => {
          if (err) throw err;
          files.forEach((file) => {
            fs.copyFile(
              path.join(srcDir, file.name),
              path.join(distDir, file.name),
              (err) => {
                if (err) throw err;
              },
            );
          });
        });
      },
    );
  });
}

copyDir();
