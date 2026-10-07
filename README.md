# CodeceptJS · formulários e estados

[English](README.en.md) · [Actions](https://github.com/brunobaccari/codeceptjs-web-flows/actions)

![CodeceptJS](https://img.shields.io/badge/CodeceptJS-4.2.0-f6e05e?logo=codeceptjs&logoColor=black)
![Playwright](https://img.shields.io/badge/Playwright-Chromium-2ead33?logo=playwright)

Testes nas páginas hospedadas do Selenium, com CodeceptJS e o helper Playwright. O foco é o que acontece entre editar um controle e enviar o formulário: valores preservados, exclusão de campos desabilitados e transições que dependem de JavaScript.

## Cenários

| Cenário | Resultado conferido |
| --- | --- |
| Texto com acento, `&`, `+` e `%` | Confirmação visível e valores decodificados idênticos na URL |
| Disabled e readonly | Disabled ausente do envio; readonly intacto após digitação e presente no envio |
| Checkbox e radio | Checkboxes independentes; escolha de radio desmarca o anterior; cardinalidade do envio |
| Seleção de arquivo | Nome do arquivo sintético presente no formulário GET |
| Campo revelado com atraso | Invisível inicialmente; editável depois da ação e espera por visibilidade |
| Adição assíncrona de caixas | Duas caixas, preservação da primeira e IDs únicos |

Os cenários usam classes de equivalência de controles e transições de estado. Os oráculos vêm do [HTML do formulário](https://github.com/SeleniumHQ/selenium/blob/trunk/common/src/web/web-form.html) e do [script de controles dinâmicos](https://github.com/SeleniumHQ/selenium/blob/trunk/common/src/web/dynamic.html). O [exemplo oficial do Selenium](https://www.selenium.dev/documentation/webdriver/getting_started/first_script/) usa o mesmo alvo hospedado para automação.

## Executar

Node.js 24 e Python 3.13 (somente para o gate do relatório).

```sh
npm ci --ignore-scripts
npx playwright install chromium
cp .env.example .env
npm test
python scripts/summary.py --self-test
```

No PowerShell, use `Copy-Item .env.example .env`. `BASE_URL` pode apontar para outro deployment das mesmas páginas. Não informe dados pessoais: o formulário envia valores na URL. Não há credenciais.

`tests/forms_test.js` contém os seis cenários. `fixtures/nota-qa.txt` é entrada sintética. Cada cenário abre um novo contexto; não há sleeps, retries ou alteração do DOM para produzir o resultado.

## Actions e evidências

A pipeline executa Chromium contra o site hospedado e exige seis casos aprovados, zero falhas e zero skips. Relatório ausente, vazio ou inválido reprova o gate. O código de saída dos testes continua valendo mesmo se houver XML antigo ou parcial.

O summary lista cada cenário e o estado da etapa. O artifact `codeceptjs-results`, retido por 14 dias, contém JUnit com os passos, summary Markdown e traces de todos os cenários; falhas também geram screenshot. Para abrir um trace baixado:

```sh
npx playwright show-trace caminho/para/trace.zip
```

`results/`, `.env` e dependências ficam fora do Git. Não há resultado local versionado como prova de CI.

## Limites

O alvo é uma página de teste pública, não um produto com regras de negócio ou persistência. O formulário usa GET: selecionar um arquivo confere somente seu nome no envio, não upload, armazenamento ou conteúdo. Chromium é o único navegador desta suíte. Indisponibilidade do site/CDNs falha a execução e precisa de diagnóstico.

CodeceptJS 4.2.0 inclui dependências transitivas com alertas no `npm audit`; este projeto não declara a árvore livre de vulnerabilidades. Não aplique `audit fix --force` sem validar a migração sugerida. Não há servidor ou credencial de produção neste projeto.

[Helper Playwright](https://codecept.io/playwright) · [Reporters CodeceptJS](https://codecept.io/reports)

O summary do Actions lista cada cenário, duração, totais e motivo de bloqueio. O gate exige a quantidade prevista no workflow, sem falhas ou skips; JUnit ausente ou inválido reprova. O resumo também acompanha o artifact.

Screenshots do estado final também são capturados nos testes de interface aprovados e ficam nos artifacts, fora do Git.
