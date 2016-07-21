'use strict';

const rewire = require('rewire');
const spedGen = rewire('../index');
const sinon = require('sinon');
const should = require('should');
const fs = require('fs');
const rmrf = require('rimraf');
require('should-sinon');
require('mocha-sinon')();

describe('Sped Gen', function () {
  it('deve exportar uma função', function () {
    spedGen.should.be.a.Function();
  });

  it('deve exportar hash de layouts', function () {
    spedGen.should.have.property('layouts').which.is.an.Object();

    const layouts = spedGen.layouts;
    layouts.should.have.property('FISCAL').which.is.an.String();
    layouts.should.have.property('CONTRIB').which.is.an.String();
  });

  it('deve exportar funções do módulo sped-utils', function () {
    spedGen.should.have.property('utils').which.is.an.Object();
  });

  it('deve exportar default options', function () {
    spedGen.should.have.property('DEFAULT_OPTIONS').which.is.an.Object();
  });

  it('deve exportar função para registrar helpers do handlebars', function() {
    spedGen.should.have.property('registerHelper').which.is.a.Function();
  });

  describe('Função principal', function () {
    let revertRequireStub;

    beforeEach(function() {
      this.noop_opts = {
        template: 'no template',
        writer: () => {},
        filter: () => false
      };

      rmrf.sync('./test/generated/');
    });

    afterEach(function clearCache() {
      if (revertRequireStub) {
        revertRequireStub();
      }
    });

    it('deve extender opções default com opções informadas', function () {
      sinon.spy(Object, "assign");

      spedGen(this.noop_opts);

      Object.assign.should.be.calledWithMatch({}, spedGen.DEFAULT_OPTIONS, this.noop_opts);
    });

    it('deve invocar opção filename se for função', function () {
      const fileName = this.noop_opts.fileName = sinon.spy();

      spedGen(this.noop_opts);

      fileName.should.be.calledOnce();
    });

    it('deve carregar metadados do layout Sped informado nas opções', function () {
      const req = sinon.stub().returns([]);
      revertRequireStub = spedGen.__set__('require', req);
      this.noop_opts.layoutSped = 'fiscal';

      spedGen(this.noop_opts);

      req.should.be.calledWith('./meta/metadados-fiscal');
    });

    it('deve lançar exceção se a opção template ou templateFile não informada', function(done) {
      this.noop_opts.template = null;
      this.noop_opts.templateFile = null;

      try {
        spedGen(this.noop_opts);
        should.fail('Exceção não foi lançada');
      } catch (error) {
        error.message.should.equal('Opção template ou templateFile não informada');
        done();
      }
    });

    it('deve compilar template', function () {
      const compile = sinon.spy(require('handlebars'), 'compile');

      spedGen(this.noop_opts);

      compile.should.be.calledWith(this.noop_opts.template);
    });

    it('deve usar filter informado nas opções, se houver', function () {
      const filter = this.noop_opts.filter = sinon.stub().returns(false);

      spedGen(this.noop_opts);

      filter.should.be.called();
    });

    it('deve usar writer informado nas opções, se houver', function () {
      const writer = this.noop_opts.writer = sinon.spy();
      this.noop_opts.filter = reg => reg.id === '0000';

      spedGen(this.noop_opts);

      writer.should.be.called();
    });

    it('deve incluir campos default aos registros', function () {
      this.noop_opts.filter = reg => reg.id === '0000';
      const forEach = sinon.stub(Array.prototype, 'forEach');

      spedGen(this.noop_opts);

      let registro = forEach.getCall(0).thisValue
      registro.should.have.property('bloco');
      registro.should.have.property('abertura');
      registro.should.have.property('encerramento');
      registro.should.have.property('layoutSped');

      forEach.restore();
    });

    it('deve incluir campos adicionais aos registros', function () {
      this.noop_opts.filter = reg => reg.id === '0000';
      this.noop_opts.aditionalFields = { foo: 'bar' };
      const forEach = sinon.stub(Array.prototype, 'forEach');

      spedGen(this.noop_opts);

      let registro = forEach.getCall(0).thisValue
      registro.should.have.property('foo');

      forEach.restore();
    });

    it('deve usar handler informado nas opções, se houver', function () {
      this.noop_opts.filter = reg => reg.id === '0000';
      const handler = this.noop_opts.handler = sinon.spy();

      spedGen(this.noop_opts);

      handler.should.be.called();
    });

    it('deve usar mapper informado nas opções, se houver', function () {
      this.noop_opts.filter = reg => reg.id === '0000';
      const mapper = this.noop_opts.mapper = sinon.spy();

      spedGen(this.noop_opts);

      mapper.should.be.called();
    });

    it('deve escrever arquivo quando opção singleFile true', function () {
      this.noop_opts.filter = reg => reg.id === '0000';
      this.noop_opts.singleFile = true;
      this.noop_opts.writer = null; // força o uso do writer interno
      const fileName = this.noop_opts.fileName = './test/generated/singleFileTest';

      spedGen(this.noop_opts);

      fs.existsSync(fileName).should.be.true();
    });

    it('não deve escrever arquivo se não gerar conteúdo', function () {
      this.noop_opts.filter = reg => reg.id === '0000';
      this.noop_opts.singleFile = true;
      this.noop_opts.writer = null; // força o uso do writer interno
      this.noop_opts.template = ""; // template vazio não gera conteúdo
      const fileName = this.noop_opts.fileName = './test/generated/singleFileTest2';

      spedGen(this.noop_opts);

      fs.existsSync(fileName).should.be.false();
    });

    it('deve escrever arquivo com multiFileWriter', function() {
      this.noop_opts.filter = reg => reg.id === '0000' || reg.id === '0001';
      this.noop_opts.singleFile = false;
      this.noop_opts.writer = null; // força o uso do writer interno
      const fileName = this.noop_opts.fileName = './test/generated/multiFilesTest{{id}}';

      spedGen(this.noop_opts);

      const file0000 = './test/generated/multiFilesTest0000';
      const file0001 = './test/generated/multiFilesTest0001';
      fs.existsSync(file0000).should.be.true();
      fs.existsSync(file0001).should.be.true();
    });

    it('não deve invocar writer se não gerar conteúdo', function () {
      this.noop_opts.filter = reg => reg.id === '0000';
      this.noop_opts.singleFile = true;
      const writer = this.noop_opts.writer = sinon.spy()
      this.noop_opts.template = ""; // template vazio não gera conteúdo

      spedGen(this.noop_opts);

      writer.should.not.be.called();
    });

    it('deve escrever template computado no arquivo gerado', function () {
      this.noop_opts.filter = reg => reg.id === '0000' || reg.id === '0001';
      this.noop_opts.singleFile = true;
      this.noop_opts.writer = null; // força o uso do writer interno
      this.noop_opts.template = 'Registro {{id}}';
      const fileName = this.noop_opts.fileName = './test/generated/singleFileTest3';

      spedGen(this.noop_opts);

      const content = fs.readFileSync(fileName).toString();
      content.should.be.equal('Registro 0000\nRegistro 0001\n');
    });
  });
});
