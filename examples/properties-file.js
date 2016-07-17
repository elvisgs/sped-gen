/**
 * Exemplo de geração um único arquivo de propriedades contendo
 * descrições dos registros e seus campos
 */

'use strict';

const fs = require('fs');
const path = require('path');
const spedGen = require('../index');

const template = fs.readFileSync('./properties-file.hbs').toString()

const options = {
  template: template,

  singleFile: true,

  fileName: options => {
    // Aqui o caminho do arquivo é construído utilizado as opções
    // Ex.: ./out/fiscal/messages-fiscal.properties
    const layout = options.layoutSped;
    return path.join('./out', layout, `/messages-${layout}.properties`);
  },

  // Só processa registros do bloco 0
  filter: registro => registro.bloco === '0',

  // Mapper que simplifica a estrutura do registro e de seus campos
  mapper: registro => {
    const campos = registro.campos.map(campo => {
      return {
        nome: campo.id,
        descricao: campo.descricao
      };
    });

    return {
      bloco: registro.bloco,
      nome: registro.id,
      descricao: registro.descricao || registro.rotulo,
      campos: campos
    };
  }
};

spedGen(options);