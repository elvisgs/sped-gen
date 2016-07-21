/**
 * Não gera arquivo algum; apenas escreve a saída no console
 */

'use strict';

const spedGen = require('../index');

const options = {
  template: 'Bloco{{bloco}} - Registro {{id}}',

  writer(chunk/* , registro, options */) {
    console.log(chunk)
  }
};

spedGen(options);