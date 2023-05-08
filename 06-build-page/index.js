const fsPromises = require('fs/promises');
const fs = require('fs')
const path = require('path');

async function copyDir(dir) {
  try {
    await fsPromises.mkdir(path.join(__dirname, 'project-dist', dir), { recursive: true });
    const copiedFiles = await fsPromises.readdir(path.join(__dirname, 'project-dist', dir));
    if (copiedFiles.length > 0) {
      for (let copiedFile of copiedFiles) {
        await fsPromises.rm(path.join(__dirname, 'project-dist', dir, copiedFile));
      }
    }
    const files = await fsPromises.readdir(path.join(__dirname, dir));
    for (let file of files) {
      await fsPromises.copyFile(path.join(__dirname, dir, file), path.join(__dirname, 'project-dist', dir, file))
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function createCss() {
  try{
    fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
    const cssFiles = await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
    for (let cssFile of cssFiles) {
      if (cssFile.isFile() && path.extname(cssFile.name) == '.css') {
        await fsPromises.appendFile(
          path.join(__dirname, 'project-dist', 'style.css'),
          await fsPromises.readFile(path.join(__dirname, 'styles', cssFile.name),
          { encoding: 'utf-8' }));
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function createPage() {
  await fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
  const copiedFiles = await fsPromises.readdir(path.join(__dirname, 'assets'), { withFileTypes: true });
  for (let copiedFile of copiedFiles) {
    if (copiedFile.isFile()) {
      await fsPromises.copyFile(path.join(__dirname, dir, copiedFile), path.join(__dirname, 'project-dist', dir, copiedFile));
    } else {
      await copyDir(path.join('assets', copiedFile.name));
    }
  }
  await createCss();
  const components = await fsPromises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
  const template = await fsPromises.readFile(path.join(__dirname, 'template.html'), { encoding: 'utf-8' });
  let templateCopy = template;
  for (let component of components) {
    if (component.isFile() && path.extname(component.name) == '.html') {
      let reg = new RegExp(`{{${component.name.split('.')[0]}}}`, 'g');
      templateCopy = templateCopy.replace(reg, (await fsPromises.readFile(path.join(__dirname, 'components', component.name), {encoding: 'utf-8' })).toString());
    }
  }
  await fsPromises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), templateCopy);
}

createPage();