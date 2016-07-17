'use strict';

const camelize = str => {
  return str.toLowerCase().replace(/_(.)/g, (match, group, index) => {
    return group.toUpperCase();
  });
};

exports.registerCustomHelpers = handlebars => {
  handlebars.registerHelper('camelize', camelize);

  handlebars.registerHelper('getter', campo => camelize('get_' + campo));

  handlebars.registerHelper('setter', campo => camelize('set_' + campo));

  handlebars.registerHelper('addOne', value => value + 1);

  handlebars.registerHelper('getJavaType', campo => {
    var tipo = 'String';

    if (campo.tipo === 'C') tipo = 'String';
    if (campo.tipo === 'D') tipo = 'Date';
    if (campo.tipo === 'N') tipo = campo.tamanho ? 'String' : 'Integer';
    if (campo.casasdecimais) tipo = 'Double';

    return tipo;
  });

  handlebars.registerHelper('getBloco', reg => reg[0]);

  handlebars.registerHelper('pascalCase', str => camelize('x_' + str).substr(1));

  handlebars.registerHelper('lcase', str => str.toLowerCase());

  handlebars.registerHelper('ucase', str => str.toUpperCase());
};