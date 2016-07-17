var camelize = function(str) {
  return str.toLowerCase().replace(/_(.)/g, function(match, group, index) {
    return group.toUpperCase();
  });
};

exports.registerCustomHelpers = function(handlebars) {
  handlebars.registerHelper('camelize', camelize);

  handlebars.registerHelper('getter', function(campo) {
    return camelize('get_' + campo);
  });

  handlebars.registerHelper('setter', function(campo) {
    return camelize('set_' + campo);
  });

  handlebars.registerHelper('addOne', function(value) {
    return value + 1;
  });

  handlebars.registerHelper('getType', function(campo) {
    var tipo = 'String';

    if (campo.tipo === 'C') tipo = 'String';
    if (campo.tipo === 'D') tipo = 'Date';
    if (campo.tipo === 'N') tipo = campo.tamanho ? 'String' : 'Integer';
    if (campo.casasdecimais) tipo = 'Double';

    return tipo;
  });

  handlebars.registerHelper('getBloco', function(reg) {
      return reg[0];
  });

  handlebars.registerHelper('pascalCase', function(str) {
      return camelize('x_' + str).substr(1);
  });

  handlebars.registerHelper('lcase', function(str) {
    return str.toLowerCase();
  });
};