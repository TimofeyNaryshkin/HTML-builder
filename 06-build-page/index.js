const path = require('path');
const fs = require('fs');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;

  //copy assets
  fs.mkdir(
    path.join(__dirname, 'project-dist', 'assets'),
    { recursive: true },
    (err) => {
      if (err) throw err;
    },
  );
  fs.readdir(
    path.join(__dirname, 'assets'),
    { withFileTypes: true },
    (error, folders) => {
      if (error) throw error;
      for (let folder of folders) {
        if (folder.isDirectory()) {
          fs.mkdir(
            path.join(__dirname, 'project-dist', 'assets', folder.name),
            { recursive: true },
            (err) => {
              if (err) throw err;
            },
          );
          fs.readdir(
            path.join(__dirname, 'assets', folder.name),
            { withFileTypes: true },
            (error, files) => {
              if (error) throw error;
              for (let file of files) {
                if (file.isFile()) {
                  const filePath = path.join(
                    __dirname,
                    'assets',
                    folder.name,
                    file.name,
                  );
                  const distPath = path.join(
                    __dirname,
                    'project-dist',
                    'assets',
                    folder.name,
                    file.name,
                  );
                  copyFile(filePath, distPath);
                }
              }
            },
          );
        }
      }
    },
  );
});

//read template file
fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (error, data) => {
  if (error) throw error;
  let templateStr = '';
  templateStr += data;

  //read components folder
  fs.readdir(
    path.join(__dirname, 'components'),
    { withFileTypes: true },
    (error, files) => {
      if (error) throw error;
      for (let file of files) {
        const filePath = path.join(__dirname, 'components', file.name);
        const fileName = file.name.substring(0, file.name.indexOf('.'));
        const componentContent = [];

        //read component file
        fs.readFile(filePath, 'utf-8', (error, data) => {
          if (error) throw error;
          componentContent.push(data);
          const regexp = new RegExp(`{{${fileName}}}`);

          //replace tag with component's data
          if (regexp.test(templateStr)) {
            templateStr = templateStr.replace(regexp, componentContent[0]);
          }
          if (!templateStr.includes('{{')) {
            writeIndex(templateStr);
          }
        });
      }
    },
  );
});

function writeIndex(temp) {
  fs.writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    temp,
    (error) => {
      if (error) throw error;
    },
  );
}

//create style.css
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
            path.join(__dirname, 'project-dist', 'style.css'),
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

function copyFile(src, dest) {
  fs.copyFile(src, dest, (err) => {
    if (err) throw err;
  });
}
