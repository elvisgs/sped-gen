'use strict';

const fs = require('fs');
const handlebars = require('handlebars');
const spedUtils = require('./lib/sped-utils');
const DefaultWriter = require('./lib/default-writer');

require('./lib/custom-helpers').registerCustomHelpers(handlebars);

const LAYOUT_FISCAL = 'fiscal';
const LAYOUT_CONTRIB = 'contrib';

const DEFAULT_OPTIONS = {
  layoutSped: LAYOUT_FISCAL,
  template: null,
  templateFile: null,
  fileName: null,
  singleFile: false,
  filter: reg => true,
  handler: reg => {},
  mapper: reg => reg,
  writer: null,
  aditionalFields: {}
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

  opts.writer = opts.writer || new DefaultWriter(handlebars);
  if (typeof opts.writer === 'function') {
    const write = opts.writer;
    opts.writer = { write };
  }

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
      opts.writer.write(result, registro, opts);
    }
  });
};

const validateOptions = opts => {
  if (opts.template == null && (opts.templateFile == null || opts.templateFile === '')) {
    throw new Error('Opção template ou templateFile não informada');
  }
};

const registerHelper = (name, func) => {
  handlebars.registerHelper(name, func);
};

module.exports = generate;
module.exports.layouts = { FISCAL: LAYOUT_FISCAL, CONTRIB: LAYOUT_CONTRIB };
module.exports.utils = spedUtils;
module.exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
module.exports.registerHelper = registerHelper;
