const fs = require('node:fs');
const path = require('node:path');

const distDir = path.join(__dirname, 'project-dist');
const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
const stylesDir = path.join(__dirname, 'styles');
const stylesArray = [];

fs.mkdir(distDir, { recursive: true }, (err) => {
  if (err) console.log(err);

  const srcAssetsDir = path.join(__dirname, 'assets');
  const distAssetsDir = path.join(distDir, 'assets');
  fs.mkdir(distAssetsDir, { recursive: true }, (err) => {
    if (err) console.log(err);
    function copyDir(src, dist) {
      fs.readdir(src, { withFileTypes: true }, (err, files) => {
        if (err) console.log(err);
        files.forEach((file) => {
          if (file.isFile()) {
            fs.copyFile(
              path.join(src, file.name),
              path.join(dist, file.name),
              (err) => {
                if (err) console.log(err);
              },
            );
          } else {
            const innerDistDir = path.join(dist, file.name);
            const innerSrcDir = path.join(src, file.name);
            fs.mkdir(innerDistDir, { recursive: true }, (err) => {
              if (err) console.log(err);
              copyDir(innerSrcDir, innerDistDir);
            });
          }
        });
      });
    }
    copyDir(srcAssetsDir, distAssetsDir);
  });

  let templateData = '';
  const templateStream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  templateStream.on('data', (chunk) => (templateData += chunk));
  templateStream.on('end', () => {
    const componentsDir = path.join(__dirname, 'components');
    fs.readdir(componentsDir, { withFileTypes: true }, (err, files) => {
      if (err) console.log(err);

      const htmlFiles = files.filter(
        (file) => file.isFile() && path.extname(file.name) === '.html',
      );
      let filesReplaced = 0;
      htmlFiles.forEach((file) => {
        const fileName = file.name.slice(0, file.name.lastIndexOf('.'));
        let componentData = '';
        const componentStream = fs.createReadStream(
          path.join(componentsDir, file.name),
          'utf-8',
        );
        componentStream.on('data', (chunk) => (componentData += chunk));
        componentStream.on('end', () => {
          templateData = templateData.replace(`{{${fileName}}}`, componentData);
          filesReplaced++;
          if (filesReplaced === htmlFiles.length) {
            fs.writeFile(
              path.join(distDir, 'index.html'),
              templateData,
              (err) => {
                if (err) console.log(err);
              },
            );
          }
        });
      });
    });
  });
});

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
