const path = require('path');
const fs = require('fs');

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (error, files) => {
    if (error) throw error;
    const copiedStyles = [];
    for (let file of files) {
      const filePath = path.join(__dirname, 'styles', file.name);
      const fileExtension = path.extname(filePath);
      if (file.isFile() && fileExtension === '.css') {
        fs.readFile(filePath, 'utf-8', (error, data) => {
          if (error) throw error;
          copiedStyles.push(data);
          fs.writeFile(
            path.join(__dirname, 'project-dist', 'bundle.css'),
            copiedStyles.join(''),
            (error) => {
              if (error) throw error;
            },
          );
        });
      }
    }
  },
);
