const fsPromises = require('fs/promises');
const fs = require('fs')
const path = require('path');

async function createCss() {
  try{
    const bundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
    const cssFiles = await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
    for (let cssFile of cssFiles) {
      if (cssFile.isFile() && path.extname(cssFile.name) == '.css') {
        await fsPromises.appendFile(
          path.join(__dirname, 'project-dist', 'bundle.css'),
          await fsPromises.readFile(path.join(__dirname, 'styles', cssFile.name),
          { encoding: 'utf-8' }));
      }
    }
  } catch (err) {
    console.log(err.message);
  }
  
}

createCss();