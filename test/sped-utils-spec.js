'use strict';

const spedUtils = require('../lib/sped-utils.js');
require('should');

describe('Sped Utils', function() {
  describe('ehRegistroSped', function() {
    it('deve retornar true se string representar um registro Sped', function() {
      spedUtils.ehRegistroSped('A100').should.be.true();
      spedUtils.ehRegistroSped('9900').should.be.true();
      spedUtils.ehRegistroSped('C500').should.be.true();
    });

    it('deve retornar false se string não representar um registro Sped', function() {
      spedUtils.ehRegistroSped('X123').should.be.false();
      spedUtils.ehRegistroSped('Z001').should.be.false();
      spedUtils.ehRegistroSped('W990').should.be.false();
    });
  });

  describe('ehAbertura', function() {
    it('deve retornar true se string representar um registro de abertura de bloco', function() {
      spedUtils.ehAbertura('A001').should.be.true();
      spedUtils.ehAbertura('C001').should.be.true();
    });

    it('deve retornar false se string não representar um registro de abertura de bloco', function() {
      spedUtils.ehAbertura('A100').should.be.false();
      spedUtils.ehAbertura('C500').should.be.false();
    });
  });

  describe('ehEncerramento', function() {
    it('deve retornar true se string representar um registro de encerramento de bloco', function() {
      spedUtils.ehEncerramento('A990').should.be.true();
      spedUtils.ehEncerramento('C990').should.be.true();
    });

    it('deve retornar false se string não representar um registro de encerramento de bloco', function() {
      spedUtils.ehEncerramento('A100').should.be.false();
      spedUtils.ehEncerramento('C500').should.be.false();
    });
  });
});