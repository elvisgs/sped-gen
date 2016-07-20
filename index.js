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
  validateOptions(options);

  let opts = Object.assign({}, DEFAULT_OPTIONS, options);

  if (typeof opts.fileName === 'function') {
    opts.fileName = opts.fileName(opts);
  }

  const metadata = require(`./meta/metadados-${opts.layoutSped}`);

  const template = opts.template != null ? opts.template : fs.readFileSync(opts.templateFile).toString();
  const compiledTemplate = handlebars.compile(template);

  opts.writer = opts.writer || (opts.singleFile ? singleFileWriter : multiFileWriter);
  singleFileWriter.reset();

  metadata.filter(opts.filter).forEach(registro => {
    registro.bloco = registro.id[0];
    registro.abertura = spedUtils.ehAbertura(registro.id);
    registro.encerramento = spedUtils.ehEncerramento(registro.id);
    registro.layoutSped = opts.layoutSped;
    registro.campos.shift(); // remove campo REG

    const newFields = Object.assign({}, DEFAULT_OPTIONS.aditionalFields, opts.aditionalFields);
    registro = Object.assign({}, registro, newFields);

    opts.handler(registro);

    registro = opts.mapper(registro);

    const result = compiledTemplate(registro);
    if (result.trim() !== '') {
      opts.writer(result, registro, opts);
    }
  });

  singleFileWriter.flushIfNeeded(opts);

};

const validateOptions = opts => {
  if (opts.template == null && (opts.templateFile == null || opts.templateFile === '')) {
    throw new Error('Opção template ou templateFile não informada');
  }
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
  const buffer = singleFileWriter.buffer;
  if (!buffer || buffer.trim() === '') return;

  if (options.singleFile && options.writer === singleFileWriter) {
    const fileName = options.fileName;

    mkdirp.sync(path.dirname(fileName));

    fs.writeFileSync(fileName, buffer);
  }
}
singleFileWriter.reset = () => {
  delete singleFileWriter.buffer;
};

const registerHelper = (name, func) => {
  handlebars.registerHelper(name, func);
};

module.exports = generate;
module.exports.layouts = { FISCAL: LAYOUT_FISCAL, CONTRIB: LAYOUT_CONTRIB };
module.exports.utils = spedUtils;
module.exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
module.exports.registerHelper = registerHelper;
