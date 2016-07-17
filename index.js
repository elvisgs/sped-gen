'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const handlebars = require('handlebars');
const spedUtils = require('./lib/sped-utils');
require('./lib/custom-helpers').registerCustomHelpers(handlebars);

const DEFAULT_FILTER = reg => true;
const DEFAULT_MAPPER = reg => reg;
const NO_OP = () => {};
const LAYOUT_FISCAL = 'fiscal';
const LAYOUT_CONTRIB = 'contrib';

const DEFAULT_OPTIONS = {
  layoutSped: LAYOUT_FISCAL,
  template: null,
  templateFile: null,
  fileName: null,
  singleFile: false,
  filter: DEFAULT_FILTER,
  handler: NO_OP,
  mapper: DEFAULT_MAPPER,
  writer: null,
  aditionalFields: {
    prefixo: null
  }
};

const generate = options => {
  let opts = Object.assign(DEFAULT_OPTIONS, options);

  if (typeof opts.fileName === 'function') {
    opts.fileName = opts.fileName(opts);
  }

  const metadata = require(`./meta/metadados-${opts.layoutSped}`);

  const template = opts.template || fs.readFileSync(opts.templateFile).toString();
  const compiledTemplate = handlebars.compile(template);

  opts.writer = opts.writer || (opts.singleFile ? singleFileWriter : multiFileWriter);

  metadata.forEach(registro => {
    registro.bloco = registro.id[0];

    registro.campos.shift(); // remove campo REG
    registro.abertura = spedUtils.ehAbertura(registro.id);
    registro.encerramento = spedUtils.ehEncerramento(registro.id);
    registro.layoutSped = opts.layoutSped;

    registro = Object.assign(registro, DEFAULT_OPTIONS.aditionalFields, opts.aditionalFields);

    const shouldWrite = opts.filter(registro);
    if (shouldWrite === false) return;

    opts.handler(registro);

    registro = opts.mapper(registro);

    const result = compiledTemplate(registro);
    opts.writer(result, registro, opts);
  });

  singleFileWriter.flushIfNeeded(opts);

};

const multiFileWriter = (chunk, registro, options) => {
  const fileName = handlebars.compile(options.fileName)(registro);

  mkdirp.sync(path.dirname(fileName));

  fs.writeFileSync(fileName, chunk);
};

const singleFileWriter = (chunk, registro, options) => {
  singleFileWriter.buffer = singleFileWriter.buffer || '';
  singleFileWriter.buffer += chunk + '\n';
};
singleFileWriter.flushIfNeeded = options => {
  if (options.singleFile && options.writer === singleFileWriter) {
    const fileName = options.fileName;

    mkdirp.sync(path.dirname(fileName));

    fs.writeFileSync(fileName, singleFileWriter.buffer);
  }
}

const registerHelper = (name, func) => {
  handlebars.registerHelper(name, func);
};

module.exports = generate;
module.exports.layouts = { FISCAL: LAYOUT_FISCAL, CONTRIB: LAYOUT_CONTRIB };
module.exports.utils = spedUtils;
module.exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
module.exports.registerHelper = registerHelper;
