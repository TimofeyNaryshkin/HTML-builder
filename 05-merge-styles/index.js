const fs = require('node:fs');
const path = require('node:path');

const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesDir = path.join(__dirname, 'styles');
const stylesArray = [];

fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
  const cssFiles = files.filter(
    (file) => file.isFile() && path.extname(file.name) === '.css',
  );
  let filesProcessed = 0;
  cssFiles.forEach((file) => {
    if (err) console.log(err);
    const filePath = path.join(stylesDir, file.name);
    let fileData = '';
    const stream = fs.createReadStream(filePath, 'utf-8');
    stream.on('data', (chunk) => {
      fileData += chunk;
    });
    stream.on('end', () => {
      stylesArray.push(fileData);
      filesProcessed++;
      if (filesProcessed === cssFiles.length) {
        fs.writeFile(bundlePath, stylesArray.join('\n'), (err) => {
          if (err) throw err;
        });
      }
    });
  });
});
