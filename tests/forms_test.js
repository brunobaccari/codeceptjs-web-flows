const assert = require('node:assert/strict');

Feature('Formulários HTML e transições assíncronas');

Scenario('envia Unicode e caracteres reservados sem perder valores', async ({ I }) => {
  I.amOnPage('/web-form.html');
  I.fillField('[name="my-text"]', 'João & QA + 100%');
  I.fillField('[name="my-textarea"]', 'Integração: ação = revisão?');
  I.selectOption('[name="my-select"]', 'Two');
  I.fillField('[name="my-datalist"]', 'Seattle');
  I.click('Submit');
  I.see('Received!', '#message');
  const url = new URL(await I.grabCurrentUrl());
  assert.equal(url.pathname, '/selenium/web/submitted-form.html');
  assert.equal(url.searchParams.get('my-text'), 'João & QA + 100%');
  assert.equal(url.searchParams.get('my-textarea'), 'Integração: ação = revisão?');
  assert.equal(url.searchParams.get('my-select'), '2');
  assert.equal(url.searchParams.get('my-datalist'), 'Seattle');
});

Scenario('campo desabilitado não é enviado e readonly mantém o valor', async ({ I }) => {
  I.amOnPage('/web-form.html');
  I.seeElement('[name="my-disabled"]:disabled');
  I.seeElement('[name="my-readonly"][readonly]');
  I.seeInField('[name="my-readonly"]', 'Readonly input');
  I.click('[name="my-readonly"]');
  I.pressKey('X');
  I.seeInField('[name="my-readonly"]', 'Readonly input');
  I.click('Submit');
  I.see('Received!', '#message');
  const params = new URL(await I.grabCurrentUrl()).searchParams;
  assert.equal(params.has('my-disabled'), false);
  assert.equal(params.get('my-readonly'), 'Readonly input');
});

Scenario('checkboxes são independentes e radios são mutuamente exclusivos', async ({ I }) => {
  I.amOnPage('/web-form.html');
  I.seeCheckboxIsChecked('#my-check-1');
  I.dontSeeCheckboxIsChecked('#my-check-2');
  I.checkOption('#my-check-2');
  I.seeCheckboxIsChecked('#my-check-1');
  I.seeCheckboxIsChecked('#my-check-2');
  I.checkOption('#my-radio-2');
  I.dontSeeCheckboxIsChecked('#my-radio-1');
  I.seeCheckboxIsChecked('#my-radio-2');
  I.click('Submit');
  I.see('Received!', '#message');
  const params = new URL(await I.grabCurrentUrl()).searchParams;
  assert.deepEqual(params.getAll('my-check'), ['on', 'on']);
  assert.deepEqual(params.getAll('my-radio'), ['on']);
});

Scenario('seleciona arquivo e envia somente o nome no formulário GET', async ({ I }) => {
  I.amOnPage('/web-form.html');
  I.attachFile('[name="my-file"]', 'fixtures/nota-qa.txt');
  I.click('Submit');
  I.see('Received!', '#message');
  const params = new URL(await I.grabCurrentUrl()).searchParams;
  assert.equal(params.get('my-file'), 'nota-qa.txt');
});

Scenario('aguarda campo oculto ficar visível antes de editar', ({ I }) => {
  I.amOnPage('/dynamic.html');
  I.dontSeeElement('#revealed');
  I.click('#reveal');
  I.waitForVisible('#revealed');
  I.fillField('#revealed', 'campo pronto');
  I.seeInField('#revealed', 'campo pronto');
});

Scenario('adicionar duas caixas preserva a primeira e não duplica IDs', ({ I }) => {
  I.amOnPage('/dynamic.html');
  I.seeNumberOfElements('.redbox', 0);
  I.click('#adder');
  I.waitForVisible('#box0');
  I.click('#adder');
  I.waitForVisible('#box1');
  I.seeNumberOfElements('.redbox', 2);
  I.seeNumberOfElements('#box0', 1);
  I.seeNumberOfElements('#box1', 1);
});
