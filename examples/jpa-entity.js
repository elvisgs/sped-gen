/**
 * Exemplo de geração de múltiplos arquivos java utilizando
 * um template de entidade JPA
 */

'use strict';

const fs = require('fs');
const path = require('path');
const spedGen = require('../index');

const template = fs.readFileSync('./jpa-entity.hbs').toString()

const options = {
  template: template,

  fileName: options => {
    // Aqui o caminho do arquivo é construído utilizado as opções
    // e contem variáveis de template que serão processadas para cada registro.
    // Ex.: ./out/fiscal/entities/bloco0/Reg0000.java
    const layout = options.layoutSped;
    return path.join('./out', layout, "entities/bloco{{bloco}}/Reg{{id}}.java");
  },

  // Só processa o registro 0150 (remova esse filtro para processar todos os registros)
  filter: registro => registro.id === '0150',

  handler: registro => {
    // Adiciona um campo ao registro com o package da entidade.
    // Apenas para demonstração; poderia ser adicionado diretamente
    // no template como "br.com.sped.{{layoutSped}}.entities.bloco{{bloco}}"
    registro.package = `br.com.sped.${registro.layoutSped}.entities.bloco${registro.bloco}`;
  }
};

spedGen(options);