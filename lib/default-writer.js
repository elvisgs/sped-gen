'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

class DefaultWriter {
  constructor(options, handlebars) {
    this.hbs = handlebars;

    const fileName = options.fileName;
    if (options.singleFile && fs.existsSync(fileName)) {
      fs.unlinkSync(fileName);
    }
  }

  write(chunk, registro, options) {
    const fileName = this.hbs.compile(options.fileName)(registro);

    const dirName = path.dirname(fileName);
    if (!fs.existsSync(dirName)) {
      mkdirp.sync(dirName);
    }

    let flag = 'w';
    if (options.singleFile) {
      flag = 'a';
      chunk += '\n';
    }

    fs.writeFileSync(fileName, chunk, {flag});
  }
}

module.exports = DefaultWriter;