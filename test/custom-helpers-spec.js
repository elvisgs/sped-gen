'use strict';

const hbs = require('handlebars');
const customHelpers = require('../lib/custom-helpers.js');
require('should');

describe('Custom Handlebars Helpers', function () {
  before(function() {
    customHelpers.registerCustomHelpers(hbs);
  });

  it('deve registrar helper camelize', function () {
    hbs.helpers.camelize.should.be.a.Function();
  });

  it('deve registrar helper getter', function () {
    hbs.helpers.getter.should.be.a.Function();
  });

  it('deve registrar helper setter', function () {
    hbs.helpers.setter.should.be.a.Function();
  });

  it('deve registrar helper getJavaType', function () {
    hbs.helpers.getJavaType.should.be.a.Function();
  });

  it('deve registrar helper getBloco', function () {
    hbs.helpers.getBloco.should.be.a.Function();
  });

  it('deve registrar helper pascalCase', function () {
    hbs.helpers.pascalCase.should.be.a.Function();
  });

  it('deve registrar helper lcase', function () {
    hbs.helpers.lcase.should.be.a.Function();
  });

  it('deve registrar helper ucase', function () {
    hbs.helpers.ucase.should.be.a.Function();
  });

  it('deve registrar helper addOne', function () {
    hbs.helpers.addOne.should.be.a.Function();
  });

  it('deve registrar helper lcase', function () {
    hbs.helpers.lcase.should.be.a.Function();
  });

  it('deve registrar helper ucase', function () {
    hbs.helpers.ucase.should.be.a.Function();
  });

  describe('camelize', function () {
    it('deve converter string para camelcase', function () {
      hbs.helpers.camelize('foo_bar_baz').should.be.equal('fooBarBaz');
      hbs.helpers.camelize('Foo_bar_baz').should.be.equal('fooBarBaz');
      hbs.helpers.camelize('FOO_BAR_BAZ').should.be.equal('fooBarBaz');
    });
  });

  describe('getter', function () {
    it('deve converter string para java getter', function () {
      hbs.helpers.getter('um_campo').should.be.equal('getUmCampo');
      hbs.helpers.getter('UM_CAMPO').should.be.equal('getUmCampo');
    });
  });

  describe('setter', function () {
    it('deve converter string para java setter', function () {
      hbs.helpers.setter('um_campo').should.be.equal('setUmCampo');
      hbs.helpers.setter('UM_CAMPO').should.be.equal('setUmCampo');
    });
  });

  describe('getJavaType', function () {
    it('deve retornar String se tipo for C', function () {
      hbs.helpers.getJavaType({tipo: 'C'}).should.be.equal('String');
    });

    it('deve retornar Date se tipo for D', function () {
      hbs.helpers.getJavaType({tipo: 'D'}).should.be.equal('Date');
    });

    it('deve retornar String se tipo for N e tiver tamanho', function () {
      hbs.helpers.getJavaType({tipo: 'N', tamanho: 10}).should.be.equal('String');
    });

    it('deve retornar Integer se tipo for N e não tiver tamanho', function () {
      hbs.helpers.getJavaType({tipo: 'N'}).should.be.equal('Integer');
    });

    it('deve retornar Double se tiver casas decimais', function () {
      hbs.helpers.getJavaType({tipo: 'N', casasdecimais: 2}).should.be.equal('Double');
    });
  });

  describe('getBloco', function () {
    it('deve retornar bloco do registro', function () {
      hbs.helpers.getBloco('A100').should.be.equal('A');
      hbs.helpers.getBloco('0150').should.be.equal('0');
    });
  });

  describe('pascalCase', function () {
    it('deve converter string para pascal case', function () {
      hbs.helpers.pascalCase('um_campo').should.be.equal('UmCampo');
      hbs.helpers.pascalCase('UM_CAMPO').should.be.equal('UmCampo');
    });
  });

  describe('addOne', function () {
    it('deve incrementar em 1', function () {
      hbs.helpers.addOne(9).should.be.equal(10);
      hbs.helpers.addOne(-2).should.be.equal(-1);
    });
  });

  describe('lcase', function () {
    it('deve converter string para lower case', function () {
      hbs.helpers.lcase('FoO').should.be.equal('foo');
      hbs.helpers.lcase('BAR').should.be.equal('bar');
    });
  });

  describe('ucase', function () {
    it('deve converter string para upper case', function () {
      hbs.helpers.ucase('foO').should.be.equal('FOO');
      hbs.helpers.ucase('bar').should.be.equal('BAR');
    });
  });
});
