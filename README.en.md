# CodeceptJS · forms and states

[Português](README.md) · [Actions](https://github.com/brunobaccari/codeceptjs-web-flows/actions)

![CodeceptJS](https://img.shields.io/badge/CodeceptJS-4.2.0-f6e05e?logo=codeceptjs&logoColor=black)
![Playwright](https://img.shields.io/badge/Playwright-Chromium-2ead33?logo=playwright)

Tests against Selenium's hosted test pages using CodeceptJS and the Playwright helper. They check what happens between editing a control and submitting a form: preserved values, excluded disabled fields and JavaScript-driven state transitions.

## Scenarios

| Scenario | Verified outcome |
| --- | --- |
| Accented text, `&`, `+` and `%` | Visible confirmation and identical decoded URL values |
| Disabled and readonly controls | Disabled excluded; readonly unchanged after typing and included in submission |
| Checkboxes and radios | Independent checkboxes; selecting a radio clears its sibling; submitted cardinality |
| File selection | Synthetic filename appears in the GET submission |
| Delayed reveal | Initially hidden; editable after the action and visibility wait |
| Asynchronous boxes | Two boxes, first preserved, unique IDs |

The suite uses control equivalence classes and state transitions. Oracles come from the [form HTML](https://github.com/SeleniumHQ/selenium/blob/trunk/common/src/web/web-form.html) and [dynamic-control script](https://github.com/SeleniumHQ/selenium/blob/trunk/common/src/web/dynamic.html). The [official Selenium example](https://www.selenium.dev/documentation/webdriver/getting_started/first_script/) uses this same hosted automation target.

## Run

Node.js 24 and Python 3.13 (only for the report gate).

```sh
npm ci --ignore-scripts
npx playwright install chromium
cp .env.example .env
npm test
python scripts/summary.py --self-test
```

On PowerShell, use `Copy-Item .env.example .env`. `BASE_URL` can point to another deployment of the same pages. Never enter personal data: form values are sent in the URL. No credentials are required.

`tests/forms_test.js` contains the six scenarios. `fixtures/nota-qa.txt` is synthetic input. Each scenario starts a fresh browser context; no sleeps, retries or DOM changes manufacture results.

## Actions and evidence

The workflow runs Chromium against the hosted site and requires six passed cases, zero failures and zero skips. Missing, empty or invalid reports fail the gate. The test process exit status remains authoritative even with stale or partial XML.

The summary lists each scenario and the test step status. The `codeceptjs-results` artifact, retained for 14 days, includes JUnit with step details, Markdown summary and traces for every scenario; failures also produce screenshots. Open a downloaded trace with:

```sh
npx playwright show-trace path/to/trace.zip
```

`results/`, `.env` and installed dependencies stay out of Git. No committed local report is used as proof of CI.

## Limits

The target is a public test page, not a product with business rules or persistence. Its form uses GET: file selection verifies only the submitted filename, not upload, storage or content. Chromium is the only browser covered. Site/CDN outages fail the run and require diagnosis.

CodeceptJS 4.2.0 includes transitive dependencies flagged by `npm audit`; this project does not claim a vulnerability-free tree. Do not apply `audit fix --force` without validating the proposed migration. No production server or credential is involved.

[Playwright helper](https://codecept.io/playwright) · [CodeceptJS reporters](https://codecept.io/reports)

The Actions summary lists every scenario, duration, totals and blocking reason. The gate requires the count configured in the workflow, with no failures or skips; missing or invalid JUnit fails the gate. The summary is also included in the artifact.

Final-state screenshots are also captured for passing UI tests and stored in artifacts, outside Git.
