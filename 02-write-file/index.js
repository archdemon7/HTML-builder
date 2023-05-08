const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Write text: \n');
stdin.on('data', data => {
  if (data.toString().trim() == 'exit') {
    console.log('goodbye');
    process.exit();
  } else {
    output.write(data);
  }
})

process.on('SIGINT', ()=> {
  console.log('goodbye');
  process.exit();
})