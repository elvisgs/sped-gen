'use strict';

 module.exports = {
  ehRegistroSped: reg => /[019ACDEGHMP]\d{3}$/.test(reg),

  ehAbertura: reg => /^.001$/.test(reg),

  ehEncerramento: reg => /^(?:.990)|(?:.999)$/.test(reg)
 };