const fsPromises = require('fs/promises');
const path = require('path');

async function copyDir() {
  try {
    await fsPromises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });
    const copiedFiles = await fsPromises.readdir(path.join(__dirname, 'files-copy'));
    if (copiedFiles.length > 0) {
      for (let copiedFile of copiedFiles) {
        await fsPromises.rm(path.join(__dirname, 'files-copy', copiedFile));
      }
    }
    const files = await fsPromises.readdir(path.join(__dirname, 'files'));
    for (let file of files) {
      await fsPromises.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file))
    }
  } catch (err) {
    console.log(err.message);
  }
  
}

copyDir()