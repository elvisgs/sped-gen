'use strict';

const fs = require('fs');
const handlebars = require('handlebars');
const spedUtils = require('./lib/sped-utils');
const DefaultWriter = require('./lib/default-writer');

require('./lib/custom-helpers').registerCustomHelpers(handlebars);

const LAYOUT_FISCAL = 'fiscal';
const LAYOUT_CONTRIB = 'contrib';

const versoes = {
  FISCAL: ['009', '010', '011'],
  CONTRIB: ['002', '003', '004', '005']
};

const DEFAULT_OPTIONS = {
  layoutSped: LAYOUT_FISCAL,
  versaoLayout: null,
  template: null,
  templateFile: null,
  fileName: null,
  singleFile: false,
  filter: () => true,
  handler: () => {},
  mapper: reg => reg,
  writer: null,
  aditionalFields: {},
  helpers: null
};

const generate = options => {
  validateOptions(options);

  let opts = Object.assign({}, DEFAULT_OPTIONS, options);

  if (typeof opts.fileName === 'function') {
    opts.fileName = opts.fileName(opts);
  }

  validateVersion(opts);

  if (opts.versaoLayout == null) {
    const versions = getVersions(opts.layoutSped);
    opts.versaoLayout = versions[versions.length - 1]
  }

  const metadata = require(`./meta/metadados-${opts.layoutSped}-v${opts.versaoLayout}`);

  const template = opts.template != null ? opts.template : fs.readFileSync(opts.templateFile).toString();
  const compiledTemplate = handlebars.compile(template);

  opts.writer = opts.writer || new DefaultWriter(opts, handlebars);
  if (typeof opts.writer === 'function') {
    const write = opts.writer;
    opts.writer = { write };
  }

  opts.helpers = opts.helpers || {};
  Object.keys(opts.helpers).forEach(name => registerHelper(name, opts.helpers[name]));

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

  Object.keys(opts.helpers).forEach(name => handlebars.unregisterHelper(name));
};

const validateOptions = opts => {
  if (opts.template == null && (opts.templateFile == null || opts.templateFile === '')) {
    throw new Error('Opção template ou templateFile não informada');
  }
};

const validateVersion = opts => {
  const layout = opts.layoutSped;
  const version = opts.versaoLayout;

  if (version == null) return;

  const validVersions = getVersions(layout);

  if (validVersions.indexOf(version) === -1) {
    const msg = `Versão '${version}' inválida para o layout '${layout}'. Versões válidas: ${validVersions.join(', ')}`;
    throw new Error(msg);
  }
};

const getVersions = layout => versoes[layout.toUpperCase()];

const registerHelper = (name, func) => {
  handlebars.registerHelper(name, func);
};

module.exports = generate;
module.exports.layouts = { FISCAL: LAYOUT_FISCAL, CONTRIB: LAYOUT_CONTRIB };
module.exports.versoes = versoes;
module.exports.utils = spedUtils;
module.exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
module.exports.registerHelper = registerHelper;
